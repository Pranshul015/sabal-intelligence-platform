import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  FolderLock,
  FileText,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  File,
  Shield,
  HardDrive,
  Share2,
  X,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert";
import { documentsAPI } from "../lib/api";

interface MyDocumentsPageProps {
  onBack: () => void;
  onNavigateToUpload: () => void;
  isDarkMode: boolean;
}

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  size: number;
  verificationStatus: string;
  fileUrl: string;
  extractedData?: any;
}

export function MyDocumentsPage({ onBack, onNavigateToUpload, isDarkMode }: MyDocumentsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentsAPI.getAll();
      const docs = (res.data.documents || []).map((doc: any) => ({
        id: doc.id,
        name: doc.originalName || doc.fileName,
        type: doc.fileType?.split("/")[1]?.toUpperCase() || "FILE",
        category: doc.category || "other",
        uploadDate: doc.uploadedAt,
        size: doc.fileSize / (1024 * 1024), // bytes to MB
        verificationStatus: mapOcrStatus(doc.ocrStatus),
        fileUrl: `/uploads/${doc.fileName}`,
        extractedData: doc.extractedData,
      }));
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const mapOcrStatus = (status: string) => {
    switch (status) {
      case "COMPLETED": return "verified";
      case "PROCESSING": return "pending";
      case "FAILED": return "rejected";
      default: return "not-verified";
    }
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    try {
      setDeleting(true);
      await documentsAPI.delete(documentToDelete.id);
      setShowDeleteDialog(false);
      setDocumentToDelete(null);
      await loadDocuments();
    } catch (error) {
      console.error("Failed to delete document:", error);
    } finally {
      setDeleting(false);
    }
  };

  const categories = Array.from(new Set(documents.map(d => d.category)));
  const totalStorage = 100; // MB
  const usedStorage = documents.reduce((acc, doc) => acc + doc.size, 0);
  const storagePercentage = (usedStorage / totalStorage) * 100;

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || doc.verificationStatus === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "not-verified":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="size-4" />;
      case "pending":
        return <Clock className="size-4" />;
      case "rejected":
        return <X className="size-4" />;
      case "not-verified":
        return <AlertCircle className="size-4" />;
      default:
        return <FileText className="size-4" />;
    }
  };


  const formatFileSize = (sizeInMB: number) => {
    return sizeInMB < 1 ? `${(sizeInMB * 1024).toFixed(0)} KB` : `${sizeInMB.toFixed(1)} MB`;
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FolderLock className="size-6 text-blue-600" />
                  My Documents Vault
                </h1>
                <p className="text-sm text-gray-600">Securely store and manage your documents</p>
              </div>
            </div>
            <Button onClick={onNavigateToUpload} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="size-4 mr-2" />
              Upload Documents
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Storage Info Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <HardDrive className="size-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Storage Usage</h3>
                  <p className="text-sm text-gray-600">
                    {usedStorage.toFixed(1)} MB of {totalStorage} MB used
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
                <p className="text-sm text-gray-600">Documents</p>
              </div>
            </div>
            <Progress value={storagePercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Expiry Warnings */}
        {documents.some(d => isExpiringSoon(d.expiryDate)) && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertCircle className="size-4 text-amber-600" />
            <AlertTitle className="text-amber-900">Documents Expiring Soon</AlertTitle>
            <AlertDescription className="text-amber-800">
              {documents.filter(d => isExpiringSoon(d.expiryDate)).length} document(s) will expire within 30 days. Please renew them to avoid application delays.
            </AlertDescription>
          </Alert>
        )}

        {documents.some(d => isExpired(d.expiryDate)) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <X className="size-4 text-red-600" />
            <AlertTitle className="text-red-900">Expired Documents</AlertTitle>
            <AlertDescription className="text-red-800">
              {documents.filter(d => isExpired(d.expiryDate)).length} document(s) have expired. Upload renewed versions immediately.
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="not-verified">Not Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-green-600">
                    {documents.filter(d => d.verificationStatus === "verified").length}
                  </p>
                </div>
                <CheckCircle className="size-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {documents.filter(d => d.verificationStatus === "pending").length}
                  </p>
                </div>
                <Clock className="size-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Not Verified</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {documents.filter(d => d.verificationStatus === "not-verified").length}
                  </p>
                </div>
                <AlertCircle className="size-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {documents.filter(d => isExpiringSoon(d.expiryDate)).length}
                  </p>
                </div>
                <AlertCircle className="size-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="size-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Upload your first document to get started"}
                </p>
                <Button onClick={onNavigateToUpload} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="size-4 mr-2" />
                  Upload Documents
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  {/* Document Icon and Type */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <File className="size-6 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {doc.type}
                    </Badge>
                  </div>

                  {/* Document Name */}
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{doc.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{doc.category}</p>

                  {/* Verification Status */}
                  <Badge className={`${getStatusColor(doc.verificationStatus)} mb-3`}>
                    {getStatusIcon(doc.verificationStatus)}
                    <span className="ml-1 capitalize">{doc.verificationStatus.replace('-', ' ')}</span>
                  </Badge>

                  {/* Expiry Warning */}
                  {isExpired(doc.expiryDate) && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                      <p className="text-xs text-red-700 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        Expired on {new Date(doc.expiryDate!).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  )}

                  {!isExpired(doc.expiryDate) && isExpiringSoon(doc.expiryDate) && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3">
                      <p className="text-xs text-amber-700 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        Expires on {new Date(doc.expiryDate!).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  )}

                  {/* Document Info */}
                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3" />
                      <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="size-3" />
                      <span>Size: {formatFileSize(doc.size)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <Eye className="size-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.fileUrl, '_blank')}
                    >
                      <Download className="size-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDocumentToDelete(doc);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="size-3 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Security Notice */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Shield className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Document Security</h4>
                <p className="text-sm text-blue-800">
                  All your documents are encrypted using AES-256 encryption and stored securely. Only you can access your documents. We never share your documents with third parties without your explicit consent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Details Modal */}
      <Dialog open={selectedDocument !== null} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-2xl">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDocument.name}</DialogTitle>
                <DialogDescription>{selectedDocument.category}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">File Type</p>
                    <p className="text-gray-900">{selectedDocument.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">File Size</p>
                    <p className="text-gray-900">{formatFileSize(selectedDocument.size)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Upload Date</p>
                    <p className="text-gray-900">
                      {new Date(selectedDocument.uploadDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Verification Status</p>
                    <Badge className={getStatusColor(selectedDocument.verificationStatus)}>
                      {getStatusIcon(selectedDocument.verificationStatus)}
                      <span className="ml-1 capitalize">
                        {selectedDocument.verificationStatus.replace('-', ' ')}
                      </span>
                    </Badge>
                  </div>
                </div>

                {selectedDocument.expiryDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Expiry Date</p>
                    <p className="text-gray-900">
                      {new Date(selectedDocument.expiryDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}

                {selectedDocument.extractedData && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Extracted Information (OCR)</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {selectedDocument.extractedData.documentNumber && (
                        <div>
                          <p className="text-sm text-gray-600">Document Number</p>
                          <p className="font-medium text-gray-900">
                            {selectedDocument.extractedData.documentNumber}
                          </p>
                        </div>
                      )}
                      {selectedDocument.extractedData.issueDate && (
                        <div>
                          <p className="text-sm text-gray-600">Issue Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedDocument.extractedData.issueDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      )}
                      {selectedDocument.extractedData.validUntil && (
                        <div>
                          <p className="text-sm text-gray-600">Valid Until</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedDocument.extractedData.validUntil).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                  Close
                </Button>
                <Button onClick={() => window.open(selectedDocument.fileUrl, '_blank')}>
                  <Download className="size-4 mr-2" />
                  Download
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{documentToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="size-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
