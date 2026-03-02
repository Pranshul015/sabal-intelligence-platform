import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { schemesAPI, applicationsAPI, userAPI } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import {
    ArrowLeft,
    CheckCircle,
    FileText,
    Send,
    Loader2,
    TrendingUp,
    Building2,
    AlertCircle,
} from "lucide-react";

interface SchemeDetail {
    id: string;
    title: string;
    department: string;
    ministry: string;
    benefit: string;
    benefitAmount: string;
    description: string;
    eligibility: string[];
    documents: string[];
    category: string[];
    state: string;
    isCentral: boolean;
}

export function ApplyNowPage() {
    const { schemeId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [scheme, setScheme] = useState<SchemeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState("");
    const [error, setError] = useState("");
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, [schemeId]);

    const loadData = async () => {
        try {
            const [schemeRes, profileRes] = await Promise.all([
                schemesAPI.getById(schemeId!),
                userAPI.getProfile(),
            ]);
            setScheme(schemeRes.data.scheme);
            setProfile(profileRes.data.user);
        } catch {
            setError("Failed to load scheme details.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError("");
        try {
            const res = await applicationsAPI.create({ schemeId: schemeId!, notes });
            setReferenceNumber(res.data.application.referenceNumber);
            setSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to submit application.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
                <Card className="max-w-lg w-full text-center p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                    <p className="text-gray-600 mb-6">Your application for <strong>{scheme?.title}</strong> has been submitted successfully.</p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-700 mb-1">Reference Number</p>
                        <p className="text-2xl font-bold text-blue-900 font-mono">{referenceNumber}</p>
                        <p className="text-xs text-blue-600 mt-2">Save this number to track your application</p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => navigate("/dashboard/track")}>
                            Track Status
                        </Button>
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/dashboard")}>
                            Back to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Apply for Scheme</h1>
                            <p className="text-sm text-gray-600">{scheme?.title}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Steps Indicator */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                                }`}>
                                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                            </div>
                            {s < 3 && <div className={`w-16 h-1 mx-2 ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-8 mb-8 text-sm text-gray-600">
                    <span className={step === 1 ? "text-blue-600 font-medium" : ""}>Review Scheme</span>
                    <span className={step === 2 ? "text-blue-600 font-medium" : ""}>Your Details</span>
                    <span className={step === 3 ? "text-blue-600 font-medium" : ""}>Confirm & Submit</span>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                {/* Step 1: Scheme Review */}
                {step === 1 && scheme && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Scheme Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                        <span className="font-semibold">Benefit Amount</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600">{scheme.benefitAmount || "As per eligibility"}</p>
                                    <p className="text-sm text-gray-600 mt-1">{scheme.benefit}</p>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Building2 className="h-4 w-4" />
                                    {scheme.department} • {scheme.ministry}
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                                    <ul className="space-y-2">
                                        {scheme.eligibility.map((e: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                {e}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Required Documents</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {scheme.documents.map((d: string, i: number) => (
                                            <Badge key={i} variant="outline">{d}</Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {scheme.category.map((c: string, i: number) => (
                                        <Badge key={i} className="bg-blue-100 text-blue-700">{c}</Badge>
                                    ))}
                                    {scheme.isCentral && <Badge className="bg-green-100 text-green-700">Central Scheme</Badge>}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setStep(2)}>
                                Continue to Your Details →
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Applicant Details */}
                {step === 2 && profile && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Applicant Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Full Name</Label>
                                        <Input value={profile.fullName || ""} readOnly className="bg-gray-50" />
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <Input value={profile.email || ""} readOnly className="bg-gray-50" />
                                    </div>
                                    <div>
                                        <Label>Phone</Label>
                                        <Input value={profile.phone || "Not provided"} readOnly className="bg-gray-50" />
                                    </div>
                                    <div>
                                        <Label>Age</Label>
                                        <Input value={profile.age || "Not provided"} readOnly className="bg-gray-50" />
                                    </div>
                                    <div>
                                        <Label>State</Label>
                                        <Input value={profile.state || "Not provided"} readOnly className="bg-gray-50" />
                                    </div>
                                    <div>
                                        <Label>Category</Label>
                                        <Input value={profile.category || "Not provided"} readOnly className="bg-gray-50" />
                                    </div>
                                    <div>
                                        <Label>Annual Income</Label>
                                        <Input value={profile.annualIncome ? `₹${profile.annualIncome.toLocaleString()}` : "Not provided"} readOnly className="bg-gray-50" />
                                    </div>
                                    <div>
                                        <Label>Occupation</Label>
                                        <Input value={profile.occupation || "Not provided"} readOnly className="bg-gray-50" />
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                                    <AlertCircle className="h-4 w-4 inline mr-1" />
                                    If any details are incorrect, please <button onClick={() => navigate("/dashboard/profile")} className="text-blue-600 underline">update your profile</button> first.
                                </div>

                                <div>
                                    <Label>Additional Notes (Optional)</Label>
                                    <Textarea
                                        placeholder="Add any additional information or special circumstances..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setStep(3)}>
                                Review & Submit →
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirm */}
                {step === 3 && scheme && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Confirm Your Application</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-lg">{scheme.title}</h3>
                                    <p className="text-sm text-gray-600">{scheme.department}</p>
                                    <p className="text-blue-600 font-semibold mt-2">{scheme.benefitAmount || scheme.benefit}</p>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium mb-2">Applicant</h4>
                                    <p className="text-sm">{profile?.fullName} • {profile?.email}</p>
                                    {profile?.state && <p className="text-sm text-gray-600">{profile.state}</p>}
                                </div>

                                {notes && (
                                    <div className="border rounded-lg p-4">
                                        <h4 className="font-medium mb-2">Notes</h4>
                                        <p className="text-sm text-gray-600">{notes}</p>
                                    </div>
                                )}

                                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                                    By submitting this application, you confirm that all provided information is accurate and you agree to the scheme's terms.
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
                                ) : (
                                    <><Send className="h-4 w-4 mr-2" /> Submit Application</>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
