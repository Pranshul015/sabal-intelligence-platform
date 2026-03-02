import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  X,
  Scan,
  Shield,
  Eye,
  Loader2,
  Save,
  Edit,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert";
import { documentsAPI } from "../lib/api";

interface UploadDocumentsPageProps {
  onBack: () => void;
  onNavigateToVault: () => void;
  isDarkMode: boolean;
}

interface UploadedFile {
  id: string;
  file: File;
  category: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  extractedData?: any;
  documentId?: string;
  error?: string;
}

export function UploadDocumentsPage({ onBack, onNavigateToVault, isDarkMode }: UploadDocumentsPageProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("aadhaar_card");
  const [reviewingFile, setReviewingFile] = useState<UploadedFile | null>(null);
  const [editedData, setEditedData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const documentCategories = [
    { value: "aadhaar_card", label: "Aadhaar Card" },
    { value: "pan_card", label: "PAN Card" },
    { value: "income_certificate", label: "Income Certificate" },
    { value: "caste_certificate", label: "Caste Certificate" },
    { value: "voter_id", label: "Voter ID" },
    { value: "driving_license", label: "Driving License" },
    { value: "ration_card", label: "Ration Card" },
    { value: "birth_certificate", label: "Birth Certificate" },
    { value: "bank_passbook", label: "Bank Passbook" },
    { value: "other", label: "Other Document" },
  ];

  const handleFileSelection = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `file-${Date.now()}-${i}`;

      const newFile: UploadedFile = {
        id: fileId,
        file,
        category: selectedCategory,
        status: "uploading",
        progress: 0,
      };

      setUploadedFiles((prev) => [...prev, newFile]);

      // Upload to backend
      try {
        // Simulate progress
        setUploadedFiles((prev) =>
          prev.map((f) => f.id === fileId ? { ...f, status: "processing" as const, progress: 50 } : f)
        );

        const response = await documentsAPI.upload(file, selectedCategory);
        const { document, extractedData } = response.data;

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                ...f,
                status: "completed" as const,
                progress: 100,
                extractedData,
                documentId: document.id,
              }
              : f
          )
        );
      } catch (error: any) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: "error" as const, error: error.response?.data?.error || "Upload failed" }
              : f
          )
        );
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelection(e.dataTransfer.files);
  };

  const handleRemoveFile = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file?.documentId) {
      try {
        await documentsAPI.delete(file.documentId);
      } catch {
        // Ignore delete errors
      }
    }
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleReview = (file: UploadedFile) => {
    setReviewingFile(file);
    setEditedData({ ...(file.extractedData || {}) });
  };

  const handleConfirmData = async () => {
    if (!reviewingFile?.documentId || !editedData) return;
    setSaving(true);
    try {
      await documentsAPI.confirm(reviewingFile.documentId, {
        extractedData: editedData,
        autoUpdateProfile: true,
      });
      setReviewingFile(null);
      setEditedData(null);
    } catch {
      // Show error
    } finally {
      setSaving(false);
    }
  };

  const completedFiles = uploadedFiles.filter((f) => f.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>← Back</Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Document Vault</h1>
              <p className="text-sm text-gray-600">Upload documents for AI-powered OCR extraction</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Security Notice */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Secure Processing</AlertTitle>
          <AlertDescription className="text-blue-700">
            Your documents are processed using Google Gemini AI for data extraction.
            Extracted data is saved to your profile and can be reviewed before confirming.
          </AlertDescription>
        </Alert>

        {/* Upload Area */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label>Document Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Drag & drop files here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse — Images only (JPEG, PNG, WebP — max 10MB)</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                onChange={(e) => handleFileSelection(e.target.files)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uploaded Documents ({uploadedFiles.length})
                </span>
                {completedFiles.length > 0 && (
                  <Badge className="bg-green-100 text-green-700">
                    {completedFiles.length} processed
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      {file.file.type.includes("image") ? (
                        <ImageIcon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-blue-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.file.size)}</p>

                      {file.status === "uploading" && (
                        <div className="flex items-center gap-2 mt-1">
                          <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                          <span className="text-xs text-blue-600">Uploading...</span>
                        </div>
                      )}
                      {file.status === "processing" && (
                        <div className="flex items-center gap-2 mt-1">
                          <Scan className="h-3 w-3 animate-pulse text-purple-600" />
                          <span className="text-xs text-purple-600">AI extracting data with Gemini...</span>
                        </div>
                      )}
                      {file.status === "completed" && (
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">
                            OCR Complete — {file.extractedData?.documentType || "Document processed"}
                          </span>
                        </div>
                      )}
                      {file.status === "error" && (
                        <div className="flex items-center gap-2 mt-1">
                          <AlertCircle className="h-3 w-3 text-red-600" />
                          <span className="text-xs text-red-600">{file.error || "Upload failed"}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {file.status === "completed" && (
                        <Button variant="outline" size="sm" onClick={() => handleReview(file)}>
                          <Eye className="h-3 w-3 mr-1" /> Review
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(file.id)}>
                        <X className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review & Confirm Modal */}
        {reviewingFile && editedData && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-blue-600" />
                    Review & Confirm Extracted Data
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setReviewingFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Please review the AI-extracted data below. Correct any mistakes before saving to your profile.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "documentType", label: "Document Type" },
                    { key: "fullName", label: "Full Name" },
                    { key: "documentNumber", label: "Document Number" },
                    { key: "dateOfBirth", label: "Date of Birth" },
                    { key: "gender", label: "Gender" },
                    { key: "fatherName", label: "Father's Name" },
                    { key: "state", label: "State" },
                    { key: "district", label: "District" },
                    { key: "address", label: "Address" },
                    { key: "annualIncome", label: "Annual Income" },
                    { key: "issueDate", label: "Issue Date" },
                    { key: "expiryDate", label: "Expiry Date" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <Label className="text-sm">{label}</Label>
                      <Input
                        value={editedData[key] || ""}
                        onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
                        placeholder={`Not detected`}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1" onClick={() => setReviewingFile(null)}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleConfirmData}
                    disabled={saving}
                  >
                    {saving ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="h-4 w-4 mr-2" /> Confirm & Save to Profile</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigate to Documents Vault */}
        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => navigate("/dashboard/documents")}>
            View My Document Vault →
          </Button>
        </div>
      </div>
    </div>
  );
}
