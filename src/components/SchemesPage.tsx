import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Search,
  Filter,
  BookmarkPlus,
  ChevronRight,
  Building2,
  MapPin,
  Users,
  TrendingUp,
  X,
  Check,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { schemesAPI } from "../lib/api";

interface SchemesPageProps {
  onBack: () => void;
  isDarkMode: boolean;
}

interface Scheme {
  id: string;
  title: string;
  department: string;
  ministry: string;
  benefit: string;
  category: string[];
  state: string;
  description: string;
  eligibility: string[];
  documents: string[];
  benefitAmount?: string;
  applicationLink: string;
  deadline?: string;
  isCentral: boolean;
}

export function SchemesPage({ onBack, isDarkMode }: SchemesPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [allSchemes, setAllSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const res = await schemesAPI.getAll({ limit: 100 });
      setAllSchemes(res.data.schemes);
    } catch (error) {
      console.error("Failed to load schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter schemes based on search and filters
  const filteredSchemes = allSchemes.filter((scheme) => {
    const matchesSearch =
      searchQuery === "" ||
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.benefit.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      scheme.category.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase());

    const matchesState =
      selectedState === "all" ||
      scheme.state === selectedState ||
      scheme.state === "All India";

    const matchesDepartment =
      selectedDepartment === "all" ||
      scheme.ministry === selectedDepartment;

    return matchesSearch && matchesCategory && matchesState && matchesDepartment;
  });

  const handleBookmark = (schemeId: string) => {
    setBookmarkedSchemes(prev =>
      prev.includes(schemeId)
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedState("all");
    setSelectedDepartment("all");
    setSearchQuery("");
  };

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedState !== "all" ? 1 : 0) +
    (selectedDepartment !== "all" ? 1 : 0);

  // Extract unique values for filters
  const categories = [...new Set(allSchemes.flatMap(s => s.category))].sort();
  const states = [...new Set(allSchemes.map(s => s.state))].sort();
  const ministries = [...new Set(allSchemes.map(s => s.ministry))].sort();

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
                <h1 className="text-2xl font-bold text-gray-900">Scheme Discovery</h1>
                <p className="text-sm text-gray-600">Browse all available government schemes</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {filteredSchemes.length} Schemes
            </Badge>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search schemes by name, benefit, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="size-4 mr-2" />
                More Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-blue-600 text-white size-5 p-0 flex items-center justify-center rounded-full">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  <X className="size-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Ministry/Department
                  </label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Ministry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ministries</SelectItem>
                      {ministries.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schemes List */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading schemes...</span>
          </div>
        ) : filteredSchemes.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="size-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No schemes found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSchemes.map((scheme) => (
              <Card
                key={scheme.id}
                className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-600"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {scheme.title}
                            </h3>
                            {scheme.isCentral && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Central Scheme
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Building2 className="size-4" />
                              {scheme.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="size-4" />
                              {scheme.state}
                            </span>
                          </div>

                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <div className="flex items-start gap-2">
                              <TrendingUp className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-green-900">Primary Benefit</p>
                                <p className="text-sm text-green-700">{scheme.benefit}</p>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3">{scheme.description}</p>

                          <div className="flex flex-wrap gap-2">
                            {scheme.category.map((cat, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(scheme.id)}
                        className={bookmarkedSchemes.includes(scheme.id) ? "text-blue-600" : ""}
                      >
                        {bookmarkedSchemes.includes(scheme.id) ? (
                          <Check className="size-4" />
                        ) : (
                          <BookmarkPlus className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="size-4" />
                      <span>{scheme.eligibility.length} eligibility criteria</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedScheme(scheme)}
                      >
                        View Details
                        <ChevronRight className="size-4 ml-1" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate(`/dashboard/apply/${scheme.id}`)}
                      >
                        Apply Now →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Scheme Details Modal */}
      <Dialog open={selectedScheme !== null} onOpenChange={() => setSelectedScheme(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedScheme && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedScheme.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedScheme.department} • {selectedScheme.state}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Benefit Highlight */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="size-5 text-blue-600" />
                    Benefit Amount
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">{selectedScheme.benefitAmount}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedScheme.benefit}</p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">About this Scheme</h3>
                  <p className="text-gray-700">{selectedScheme.description}</p>
                </div>

                {/* Eligibility */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Eligibility Criteria</h3>
                  <ul className="space-y-2">
                    {selectedScheme.eligibility.map((criteria, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Documents */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Required Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedScheme.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <Check className="size-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setSelectedScheme(null);
                      navigate(`/dashboard/apply/${selectedScheme.id}`);
                    }}
                  >
                    Apply Now →
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleBookmark(selectedScheme.id)}
                  >
                    {bookmarkedSchemes.includes(selectedScheme.id) ? (
                      <>
                        <Check className="size-4 mr-2" />
                        Bookmarked
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="size-4 mr-2" />
                        Bookmark
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
