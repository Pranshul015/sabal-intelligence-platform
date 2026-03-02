import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Sparkles,
  TrendingUp,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Award,
  BookOpen,
  Calendar,
  Download,
  Loader2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { userAPI } from "../lib/api";

interface YourSchemesPageProps {
  onBack: () => void;
  isDarkMode: boolean;
}

interface MatchedScheme {
  id: string;
  title: string;
  department: string;
  ministry: string;
  matchPercentage: number;
  matchCategory: "excellent" | "good" | "fair";
  benefit: string;
  benefitAmount: string;
  eligibilityMet: string[];
  eligibilityPending: string[];
  eligibility: string[];
  documents: string[];
  applicationLink: string;
  deadline?: string;
  state: string;
  isCentral: boolean;
  category: string[];
  description: string;
}

export function YourSchemesPage({ onBack, isDarkMode }: YourSchemesPageProps) {
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);
  const [matchedSchemes, setMatchedSchemes] = useState<MatchedScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEligibleSchemes();
  }, []);

  const loadEligibleSchemes = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getEligibleSchemes();
      setMatchedSchemes(res.data.schemes || []);
    } catch (error) {
      console.error("Failed to load eligible schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (category: string) => {
    switch (category) {
      case "excellent":
        return "bg-green-100 text-green-700 border-green-300";
      case "good":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "fair":
        return "bg-amber-100 text-amber-700 border-amber-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getMatchLabel = (category: string) => {
    switch (category) {
      case "excellent":
        return "Highly Recommended";
      case "good":
        return "Good Match";
      case "fair":
        return "Fair Match";
      default:
        return "Matched";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not-applied":
        return <Badge variant="secondary">Not Applied</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-600 text-white">In Progress</Badge>;
      case "approved":
        return <Badge className="bg-green-600 text-white">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-600 text-white">Rejected</Badge>;
      default:
        return null;
    }
  };

  const excellentMatches = matchedSchemes.filter(s => s.matchCategory === "excellent");
  const goodMatches = matchedSchemes.filter(s => s.matchCategory === "good");
  const fairMatches = matchedSchemes.filter(s => s.matchCategory === "fair");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="size-6 text-blue-600" />
                  Your Eligible Schemes
                </h1>
                <p className="text-sm text-gray-600">AI-matched schemes based on your profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading your matched schemes...</span>
          </div>
        ) : matchedSchemes.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Sparkles className="size-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No matched schemes yet</h3>
                <p className="text-gray-600 mb-4">
                  Complete your profile to get personalized scheme recommendations.
                </p>
                <Button onClick={() => navigate("/dashboard/profile")} className="bg-blue-600 hover:bg-blue-700">
                  Complete Profile
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Matches</p>
                      <p className="text-2xl font-bold text-gray-900">{matchedSchemes.length}</p>
                    </div>
                    <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="size-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Highly Recommended</p>
                      <p className="text-2xl font-bold text-green-600">{excellentMatches.length}</p>
                    </div>
                    <div className="size-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="size-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Good Matches</p>
                      <p className="text-2xl font-bold text-blue-600">{goodMatches.length}</p>
                    </div>
                    <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="size-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Fair Matches</p>
                      <p className="text-2xl font-bold text-amber-600">{fairMatches.length}</p>
                    </div>
                    <div className="size-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="size-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Important Notice */}
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Sparkles className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">AI-Powered Matching</h4>
                    <p className="text-sm text-blue-800">
                      These schemes are personally matched to your profile based on income, occupation, location,
                      caste category, and other eligibility criteria. Click on each scheme to see detailed match reasons
                      and missing requirements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Highly Recommended Section */}
            {excellentMatches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="size-5 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">Highly Recommended</h2>
                  <Badge className="bg-green-600 text-white">{excellentMatches.length}</Badge>
                </div>
                <div className="space-y-4">
                  {excellentMatches.map((scheme) => (
                    <SchemeCard
                      key={scheme.id}
                      scheme={scheme}
                      expanded={expandedScheme === scheme.id}
                      onToggle={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                      getMatchColor={getMatchColor}
                      getMatchLabel={getMatchLabel}
                      getStatusBadge={getStatusBadge}
                      onApply={() => navigate(`/dashboard/apply/${scheme.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Good Matches Section */}
            {goodMatches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="size-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Good Matches</h2>
                  <Badge className="bg-blue-600 text-white">{goodMatches.length}</Badge>
                </div>
                <div className="space-y-4">
                  {goodMatches.map((scheme) => (
                    <SchemeCard
                      key={scheme.id}
                      scheme={scheme}
                      expanded={expandedScheme === scheme.id}
                      onToggle={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                      getMatchColor={getMatchColor}
                      getMatchLabel={getMatchLabel}
                      getStatusBadge={getStatusBadge}
                      onApply={() => navigate(`/dashboard/apply/${scheme.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Fair Matches Section */}
            {fairMatches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="size-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-gray-900">Fair Matches</h2>
                  <Badge className="bg-amber-600 text-white">{fairMatches.length}</Badge>
                </div>
                <div className="space-y-4">
                  {fairMatches.map((scheme) => (
                    <SchemeCard
                      key={scheme.id}
                      scheme={scheme}
                      expanded={expandedScheme === scheme.id}
                      onToggle={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                      getMatchColor={getMatchColor}
                      getMatchLabel={getMatchLabel}
                      getStatusBadge={getStatusBadge}
                      onApply={() => navigate(`/dashboard/apply/${scheme.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface SchemeCardProps {
  scheme: MatchedScheme;
  expanded: boolean;
  onToggle: () => void;
  getMatchColor: (category: string) => string;
  getMatchLabel: (category: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  onApply: () => void;
}

function SchemeCard({
  scheme,
  expanded,
  onToggle,
  getMatchColor,
  getMatchLabel,
  getStatusBadge,
  onApply,
}: SchemeCardProps) {
  return (
    <Card className="border-l-4 border-l-green-600 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">{scheme.title}</h3>
              {scheme.isCentral && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">Central</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{scheme.department}</p>

            {/* Match Percentage */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Match Score</span>
                  <span className="font-bold text-gray-900">{scheme.matchPercentage}%</span>
                </div>
                <Progress value={scheme.matchPercentage} className="h-2" />
              </div>
              <Badge className={getMatchColor(scheme.matchCategory)}>
                {getMatchLabel(scheme.matchCategory)}
              </Badge>
            </div>

            {/* Benefit Highlight */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 mb-3">
              <div className="flex items-start gap-2">
                <TrendingUp className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">Benefit</p>
                  {scheme.benefitAmount && (
                    <p className="text-xl font-bold text-green-700">{scheme.benefitAmount}</p>
                  )}
                  <p className="text-sm text-gray-700 mt-1">{scheme.benefit}</p>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {scheme.deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>Deadline: {scheme.deadline}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <FileText className="size-4" />
                <span>{scheme.documents?.length || 0} documents required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onToggle}
          >
            {expanded ? (
              <>
                <ChevronUp className="size-4 mr-2" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="size-4 mr-2" />
                View Details
              </>
            )}
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={onApply}
          >
            <ExternalLink className="size-4 mr-2" />
            Apply Now
          </Button>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-6 pt-6 border-t space-y-6">
            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About this Scheme</h4>
              <p className="text-sm text-gray-700">{scheme.description}</p>
            </div>

            {/* Eligibility Status */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Eligibility Status</h4>

              {scheme.eligibilityMet && scheme.eligibilityMet.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-green-700 mb-2">✓ Criteria Met</p>
                  <ul className="space-y-1">
                    {scheme.eligibilityMet.map((criteria: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {scheme.eligibilityPending && scheme.eligibilityPending.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-amber-700 mb-2">⚠ Pending Requirements</p>
                  <ul className="space-y-1">
                    {scheme.eligibilityPending.map((criteria: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="size-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Required Documents */}
            {scheme.documents && scheme.documents.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Required Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {scheme.documents.map((doc: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border"
                    >
                      <FileText className="size-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility Criteria from Scheme */}
            {scheme.eligibility && scheme.eligibility.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Full Eligibility Criteria</h4>
                <ul className="space-y-2">
                  {scheme.eligibility.map((criteria: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <BookOpen className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

