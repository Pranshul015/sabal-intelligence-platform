import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Configure multer
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') },
    fileFilter: (_req, file, cb) => {
        // Images only — Gemini Vision processes image data directly
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (JPEG, PNG, WebP). Please take a clear photo of your document.'));
        }
    },
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function extractDataWithGemini(filePath: string, mimeType: string): Promise<any> {
    try {
        // Use gemini-1.5-flash — stable, high-accuracy vision model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const fileBuffer = fs.readFileSync(filePath);
        const base64Data = fileBuffer.toString('base64');

        const prompt = `You are an expert OCR system specialized in reading Indian government identity and financial documents.

Analyze this document image very carefully and extract every piece of readable information.
Return a JSON object with EXACTLY these fields. If a field is not visible or not applicable, set it to null.
Do NOT guess or invent data — only extract what is clearly printed on the document.

{
  "documentType": "The exact type of document (e.g., Aadhaar Card, PAN Card, Income Certificate, Voter ID Card, Driving Licence, Ration Card, Birth Certificate, Caste Certificate, Bank Passbook)",
  "fullName": "Full name exactly as printed on the document",
  "documentNumber": "The primary ID number: Aadhaar (12 digits), PAN (10 alphanumeric), Voter ID, DL number, etc.",
  "dateOfBirth": "Date of birth in DD/MM/YYYY format if visible",
  "gender": "Male or Female or Other — exactly as shown or inferred from the document",
  "address": "Complete address string including house no, street, village/city, district, state, PIN if present",
  "fatherName": "Father's or guardian's name if shown on document",
  "issueDate": "Date of issue in DD/MM/YYYY format if present",
  "expiryDate": "Date of expiry in DD/MM/YYYY if present",
  "annualIncome": "Annual income as a number (digits only, no commas or currency symbols) — only for income certificates",
  "state": "State name as printed on the document",
  "district": "District name as printed on the document"
}

CRITICAL RULES:
1. Return ONLY the raw JSON object — no markdown, no code fences, no explanation text.
2. Read every character carefully, especially ID numbers.
3. For Aadhaar: the number is 12 digits usually formatted as XXXX XXXX XXXX — return without spaces.
4. For PAN: it is always 10 characters like ABCDE1234F.
5. If the image is unclear or not a valid document, return {"documentType": null} only.`;

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
                    data: base64Data,
                },
            },
            prompt,
        ]);

        const responseText = result.response.text().trim();
        console.log('Gemini OCR raw response:', responseText.substring(0, 200));

        let cleanJson = responseText
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/gi, '')
            .trim();

        const firstBrace = cleanJson.indexOf('{');
        const lastBrace = cleanJson.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
        }

        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('Gemini OCR error:', error);
        return null;
    }
}

// POST /api/documents/upload
router.post('/upload', authenticate, upload.single('document'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded.' });
            return;
        }

        const category = req.body.category || 'other';

        // Create document record
        const document = await prisma.document.create({
            data: {
                userId: req.user!.id,
                fileName: req.file.filename,
                originalName: req.file.originalname,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                category,
                filePath: req.file.path,
                ocrStatus: 'PROCESSING',
            },
        });

        // Process with Gemini OCR
        const extractedData = await extractDataWithGemini(req.file.path, req.file.mimetype);

        // Update document with extracted data
        const updatedDoc = await prisma.document.update({
            where: { id: document.id },
            data: {
                extractedData: extractedData || {},
                ocrStatus: extractedData ? 'COMPLETED' : 'FAILED',
                category: extractedData?.documentType
                    ? extractedData.documentType.toLowerCase().replace(/\s+/g, '_')
                    : category,
            },
        });

        res.status(201).json({
            document: updatedDoc,
            extractedData: extractedData || null,
        });
    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ error: 'Failed to upload document.' });
    }
});

// GET /api/documents
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const documents = await prisma.document.findMany({
            where: { userId: req.user!.id },
            orderBy: { uploadedAt: 'desc' },
        });

        res.json({ documents });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ error: 'Failed to get documents.' });
    }
});

// PUT /api/documents/:id/confirm
router.put('/:id/confirm', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const document = await prisma.document.findFirst({
            where: { id: String(req.params.id), userId: req.user!.id },
        });

        if (!document) {
            res.status(404).json({ error: 'Document not found.' });
            return;
        }

        const { extractedData, autoUpdateProfile } = req.body;

        // Update document with confirmed data
        const updatedDoc = await prisma.document.update({
            where: { id: document.id },
            data: {
                extractedData: extractedData || document.extractedData,
                ocrStatus: 'COMPLETED',
            },
        });

        // Auto-update user profile if requested
        if (autoUpdateProfile && extractedData) {
            const profileUpdate: any = {};

            if (extractedData.fullName) profileUpdate.fullName = extractedData.fullName;
            if (extractedData.dateOfBirth) {
                const parts = extractedData.dateOfBirth.split('/');
                if (parts.length === 3) {
                    const year = parseInt(parts[2]);
                    const currentYear = new Date().getFullYear();
                    profileUpdate.age = currentYear - year;
                }
            }
            if (extractedData.gender) profileUpdate.gender = extractedData.gender;
            if (extractedData.state) profileUpdate.state = extractedData.state;
            if (extractedData.district) profileUpdate.district = extractedData.district;
            if (extractedData.annualIncome) profileUpdate.annualIncome = parseFloat(extractedData.annualIncome);
            if (extractedData.documentNumber) {
                const docType = (extractedData.documentType || '').toLowerCase();
                if (docType.includes('aadhaar')) profileUpdate.aadhaarNumber = extractedData.documentNumber;
                if (docType.includes('pan')) profileUpdate.panNumber = extractedData.documentNumber;
            }

            if (Object.keys(profileUpdate).length > 0) {
                await prisma.user.update({
                    where: { id: req.user!.id },
                    data: profileUpdate,
                });
            }
        }

        res.json({ document: updatedDoc });
    } catch (error) {
        console.error('Confirm document error:', error);
        res.status(500).json({ error: 'Failed to confirm document.' });
    }
});

// DELETE /api/documents/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const document = await prisma.document.findFirst({
            where: { id: req.params.id, userId: req.user!.id },
        });

        if (!document) {
            res.status(404).json({ error: 'Document not found.' });
            return;
        }

        // Delete file from filesystem
        if (fs.existsSync(document.filePath)) {
            fs.unlinkSync(document.filePath);
        }

        await prisma.document.delete({ where: { id: document.id } });

        res.json({ message: 'Document deleted successfully.' });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ error: 'Failed to delete document.' });
    }
});

export default router;
