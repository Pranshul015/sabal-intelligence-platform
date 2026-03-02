import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { applicationsAPI } from "../lib/api";
import {
    ArrowLeft,
    Search,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    FileText,
    Loader2,
    Calendar,
    Building2,
} from "lucide-react";

interface Application {
    id: string;
    referenceNumber: string;
    status: string;
    appliedAt: string;
    updatedAt: string;
    notes: string | null;
    scheme: {
        title: string;
        department: string;
        ministry: string;
        benefitAmount: string | null;
    };
}

export function TrackStatusPage() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchRef, setSearchRef] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const res = await applicationsAPI.getAll({ limit: 50 });
            setApplications(res.data.applications);
        } catch {
            console.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "PENDING":
                return { icon: Clock, color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Pending Review", dot: "bg-yellow-500" };
            case "IN_REVIEW":
                return { icon: FileText, color: "bg-blue-100 text-blue-700 border-blue-200", label: "In Review", dot: "bg-blue-500" };
            case "APPROVED":
                return { icon: CheckCircle, color: "bg-green-100 text-green-700 border-green-200", label: "Approved", dot: "bg-green-500" };
            case "REJECTED":
                return { icon: XCircle, color: "bg-red-100 text-red-700 border-red-200", label: "Rejected", dot: "bg-red-500" };
            default:
                return { icon: Clock, color: "bg-gray-100 text-gray-700 border-gray-200", label: status, dot: "bg-gray-500" };
        }
    };

    const filteredApps = applications.filter((app) => {
        const matchesSearch = searchRef === "" ||
            app.referenceNumber.toLowerCase().includes(searchRef.toLowerCase()) ||
            app.scheme.title.toLowerCase().includes(searchRef.toLowerCase());
        const matchesFilter = filter === "all" || app.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                                <ArrowLeft className="h-4 w-4 mr-2" /> Back
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Track Applications</h1>
                                <p className="text-sm text-gray-600">Monitor the status of your scheme applications</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {applications.length} Applications
                        </Badge>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by reference number or scheme name..."
                                value={searchRef}
                                onChange={(e) => setSearchRef(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            {["all", "PENDING", "IN_REVIEW", "APPROVED", "REJECTED"].map((f) => (
                                <Button
                                    key={f}
                                    variant={filter === f ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setFilter(f)}
                                    className={filter === f ? "bg-blue-600" : ""}
                                >
                                    {f === "all" ? "All" : getStatusConfig(f).label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="container mx-auto px-4 py-8">
                {filteredApps.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                            {applications.length === 0 ? (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">No applications yet</h3>
                                    <p className="text-gray-600 mb-4">Start by exploring schemes and applying for the ones you're eligible for.</p>
                                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/dashboard/schemes")}>
                                        Browse Schemes
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">No matching applications</h3>
                                    <p className="text-gray-600">Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredApps.map((app) => {
                            const statusConfig = getStatusConfig(app.status);
                            const StatusIcon = statusConfig.icon;
                            return (
                                <Card key={app.id} className="hover:shadow-lg transition-shadow border-l-4" style={{
                                    borderLeftColor: app.status === "APPROVED" ? "#16a34a" : app.status === "REJECTED" ? "#dc2626" : app.status === "IN_REVIEW" ? "#2563eb" : "#eab308"
                                }}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-lg text-gray-900">{app.scheme.title}</h3>
                                                    <Badge className={statusConfig.color}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {statusConfig.label}
                                                    </Badge>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="h-4 w-4" />
                                                        {app.scheme.department}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        Applied: {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                    </span>
                                                </div>

                                                <div className="bg-gray-50 rounded-lg p-3 inline-block">
                                                    <span className="text-xs text-gray-500">Reference Number</span>
                                                    <p className="font-mono font-semibold text-blue-600">{app.referenceNumber}</p>
                                                </div>

                                                {app.scheme.benefitAmount && (
                                                    <p className="text-sm text-green-700 mt-2 font-medium">
                                                        Benefit: {app.scheme.benefitAmount}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status Timeline */}
                                            <div className="hidden md:flex flex-col items-center gap-1 min-w-[120px]">
                                                {["PENDING", "IN_REVIEW", "APPROVED"].map((s, i) => {
                                                    const isActive = ["PENDING", "IN_REVIEW", "APPROVED"].indexOf(app.status) >= i;
                                                    const isRejected = app.status === "REJECTED" && s === "APPROVED";
                                                    return (
                                                        <div key={s} className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-full ${isRejected ? "bg-red-500" : isActive ? "bg-green-500" : "bg-gray-300"
                                                                }`} />
                                                            <span className={`text-xs ${isActive ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                                                                {s === "PENDING" ? "Submitted" : s === "IN_REVIEW" ? "Reviewing" : isRejected ? "Rejected" : "Approved"}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
