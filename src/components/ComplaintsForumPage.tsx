import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  MessageSquare,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Upload,
  FileText,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Eye,
  Send,
  User,
  Building2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { applicationsAPI, complaintsAPI } from "../lib/api";

interface ComplaintsForumPageProps {
  onBack: () => void;
  isDarkMode: boolean;
}

interface Application {
  id: string;
  referenceNumber: string;
  status: string;
  appliedAt: string;
  notes: string | null;
  scheme: {
    title: string;
    department: string;
    ministry: string;
    benefitAmount?: string;
  };
}

interface Complaint {
  id: string;
  applicationId: string | null;
  schemeId: string | null;
  category: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  application?: {
    referenceNumber: string;
  } | null;
  scheme?: {
    title: string;
  } | null;
}

export function ComplaintsForumPage({ onBack, isDarkMode }: ComplaintsForumPageProps) {
  const [selectedTab, setSelectedTab] = useState("applications");
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appsRes, complaintsRes] = await Promise.all([
        applicationsAPI.getAll(),
        complaintsAPI.getAll(),
      ]);
      setApplications(appsRes.data.applications || []);
      setComplaints(complaintsRes.data.complaints || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Complaint form state
  const [complaintForm, setComplaintForm] = useState({
    applicationId: "",
    category: "",
    subject: "",
    description: "",
    priority: "MEDIUM",
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "open":
        return "bg-amber-100 text-amber-700";
      case "in_review":
      case "in-review":
      case "in_progress":
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "approved":
      case "resolved":
        return "bg-green-100 text-green-700";
      case "rejected":
      case "closed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "open":
        return <Clock className="size-4" />;
      case "in_review":
      case "in-review":
      case "in_progress":
      case "in-progress":
        return <AlertCircle className="size-4" />;
      case "approved":
      case "resolved":
        return <CheckCircle className="size-4" />;
      case "rejected":
      case "closed":
        return <XCircle className="size-4" />;
      default:
        return <Clock className="size-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleComplaintSubmit = async () => {
    if (!complaintForm.category || !complaintForm.subject || !complaintForm.description) {
      return;
    }
    try {
      setSubmitting(true);
      await complaintsAPI.create({
        applicationId: complaintForm.applicationId || undefined,
        category: complaintForm.category,
        subject: complaintForm.subject,
        description: complaintForm.description,
        priority: complaintForm.priority,
      });
      setShowComplaintForm(false);
      // Reset form
      setComplaintForm({
        applicationId: "",
        category: "",
        subject: "",
        description: "",
        priority: "MEDIUM",
      });
      // Reload data
      await loadData();
    } catch (error) {
      console.error("Failed to submit complaint:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      searchQuery === "" ||
      (complaint.scheme?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || complaint.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="size-6 text-blue-600" />
                  Complaints & Application Tracking
                </h1>
                <p className="text-sm text-gray-600">Track your applications and raise grievances</p>
              </div>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowComplaintForm(true)}
            >
              <Plus className="size-4 mr-2" />
              Raise Complaint
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="complaints">My Complaints</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Applications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading applications...</span>
                  </div>
                ) : applications.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No applications yet. Browse schemes and apply!</p>
                ) : (
                  applications.map((app) => (
                    <Card key={app.id} className="border-l-4 border-l-blue-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{app.scheme?.title || 'Unknown Scheme'}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <Building2 className="size-4" />
                                {app.scheme?.department || 'N/A'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm text-gray-600">Reference:</span>
                              <Badge variant="outline">{app.referenceNumber}</Badge>
                            </div>
                            <Badge className={getStatusColor(app.status)}>
                              {getStatusIcon(app.status)}
                              <span className="ml-1 capitalize">{app.status.replace('_', ' ').toLowerCase()}</span>
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(app);
                              setComplaintForm(prev => ({ ...prev, applicationId: app.id }));
                              setShowComplaintForm(true);
                            }}
                          >
                            <MessageSquare className="size-4 mr-2" />
                            Raise Complaint
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Search complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Complaints List */}
            {filteredComplaints.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <MessageSquare className="size-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">No complaints found</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't raised any complaints yet
                    </p>
                    <Button onClick={() => setShowComplaintForm(true)}>
                      <Plus className="size-4 mr-2" />
                      Raise Your First Complaint
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <Card key={complaint.id} className="border-l-4 border-l-orange-600 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{complaint.subject}</h3>
                            <Badge className={getPriorityColor(complaint.priority)}>
                              {complaint.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{complaint.scheme?.title || complaint.application?.referenceNumber || 'General'}</p>
                          <Badge variant="outline" className="mb-3">{complaint.category}</Badge>

                          <p className="text-gray-700 mb-4">{complaint.description}</p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="size-4" />
                              Created: {new Date(complaint.createdAt).toLocaleDateString('en-IN')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-4" />
                              Last Updated: {new Date(complaint.updatedAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>

                          <Badge className={getStatusColor(complaint.status)}>
                            {getStatusIcon(complaint.status)}
                            <span className="ml-1 capitalize">{complaint.status.replace('_', ' ').toLowerCase()}</span>
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          <Eye className="size-4 mr-2" />
                          View Details
                        </Button>
                      </div>

                      {/* Resolution (if resolved) */}
                      {complaint.resolution && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                          <div className="flex gap-2">
                            <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-green-900 mb-1">Resolution</p>
                              <p className="text-sm text-green-800">{complaint.resolution}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Raise Complaint Modal */}
      <Dialog open={showComplaintForm} onOpenChange={setShowComplaintForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Raise a Complaint</DialogTitle>
            <DialogDescription>
              Fill out this form to report an issue with your scheme application
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Application Selection */}
            <div>
              <Label>Select Application *</Label>
              <Select
                value={complaintForm.applicationId}
                onValueChange={(value) => setComplaintForm({ ...complaintForm, applicationId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose the application" />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.scheme?.title || 'Unknown'} - {app.referenceNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Issue Category */}
            <div>
              <Label>Issue Category *</Label>
              <Select
                value={complaintForm.category}
                onValueChange={(value) => setComplaintForm({ ...complaintForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing-delay">Processing Delay</SelectItem>
                  <SelectItem value="document-issue">Document Verification Issue</SelectItem>
                  <SelectItem value="payment-delay">Payment/Benefit Delay</SelectItem>
                  <SelectItem value="office-misconduct">Office Staff Misconduct</SelectItem>
                  <SelectItem value="technical-issue">Website/Technical Issue</SelectItem>
                  <SelectItem value="eligibility-dispute">Eligibility Dispute</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div>
              <Label>Subject *</Label>
              <Input
                placeholder="Brief description of the issue"
                value={complaintForm.subject}
                onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
              />
            </div>

            {/* Detailed Description */}
            <div>
              <Label>Detailed Description *</Label>
              <Textarea
                placeholder="Provide complete details about your issue including dates, reference numbers, and any relevant information..."
                rows={5}
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
              />
            </div>

            {/* Priority */}
            <div>
              <Label>Priority</Label>
              <Select
                value={complaintForm.priority}
                onValueChange={(value) => setComplaintForm({ ...complaintForm, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Important Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Please Note:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure all information provided is accurate</li>
                      <li>You will receive a complaint reference number</li>
                      <li>Response time is typically 24-48 hours</li>
                      <li>False complaints may result in action</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowComplaintForm(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleComplaintSubmit}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Send className="size-4 mr-2" />}
                Submit Complaint
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complaint Details Modal */}
      <Dialog open={selectedComplaint !== null} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedComplaint.subject}</DialogTitle>
                <DialogDescription>
                  Complaint ID: #{selectedComplaint.id.toUpperCase()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status and Priority */}
                <div className="flex gap-3">
                  <Badge className={getStatusColor(selectedComplaint.status)}>
                    {getStatusIcon(selectedComplaint.status)}
                    <span className="ml-1 capitalize">{selectedComplaint.status.replace('-', ' ')}</span>
                  </Badge>
                  <Badge className={getPriorityColor(selectedComplaint.priority)}>
                    {selectedComplaint.priority.toUpperCase()} PRIORITY
                  </Badge>
                </div>

                {/* Scheme Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Related To</h4>
                  <p className="text-gray-700">{selectedComplaint.scheme?.title || selectedComplaint.application?.referenceNumber || 'General Complaint'}</p>
                  <Badge variant="outline" className="mt-2">{selectedComplaint.category}</Badge>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Issue Description</h4>
                  <p className="text-gray-700">{selectedComplaint.description}</p>
                </div>

                {/* Dates */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      Filed: {new Date(selectedComplaint.createdAt).toLocaleDateString('en-IN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" />
                      Updated: {new Date(selectedComplaint.updatedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Resolution (if resolved) */}
                {selectedComplaint.resolution && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex gap-2">
                      <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900 mb-1">Final Resolution</p>
                        <p className="text-sm text-green-800">{selectedComplaint.resolution}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <FileText className="size-4 mr-2" />
                    Download Report
                  </Button>
                  {selectedComplaint.status !== "resolved" && selectedComplaint.status !== "closed" && (
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="size-4 mr-2" />
                      Add Follow-up
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}