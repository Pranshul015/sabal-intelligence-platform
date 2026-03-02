import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Home, Heart, Briefcase, GraduationCap, Leaf, Users } from "lucide-react";

const schemes = [
  {
    id: 1,
    name: "PM Awas Yojana",
    category: "Housing",
    location: "All India",
    description: "Financial assistance for building or buying a house for economically weaker sections and low-income groups.",
    icon: Home,
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: 2,
    name: "Ayushman Bharat",
    category: "Healthcare",
    location: "All India",
    description: "Health insurance scheme providing coverage of ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
    icon: Heart,
    color: "bg-red-100 text-red-600"
  },
  {
    id: 3,
    name: "PM Kisan Samman Nidhi",
    category: "Agriculture",
    location: "All India",
    description: "Income support of ₹6,000 per year to all farmer families with cultivable land, paid in three equal installments.",
    icon: Leaf,
    color: "bg-green-100 text-green-600"
  },
  {
    id: 4,
    name: "Mudra Yojana",
    category: "Business",
    location: "All India",
    description: "Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises for business expansion.",
    icon: Briefcase,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 5,
    name: "National Scholarship Portal",
    category: "Education",
    location: "All India",
    description: "Centralized platform for various scholarship schemes for students from pre-matric to post-graduation levels.",
    icon: GraduationCap,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: 6,
    name: "PM Jan Dhan Yojana",
    category: "Financial Inclusion",
    location: "All India",
    description: "Financial inclusion program ensuring access to financial services like banking, savings, and credit facilities.",
    icon: Users,
    color: "bg-indigo-100 text-indigo-600"
  }
];

export function SchemeExplorer() {
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

  const filteredSchemes = schemes.filter(scheme => {
    const categoryMatch = category === "all" || scheme.category === category;
    const locationMatch = location === "all" || scheme.location === location;
    return categoryMatch && locationMatch;
  });

  return (
    <section id="schemes" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">
            Explore Government Schemes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Browse popular schemes and find the ones that match your eligibility
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="w-full sm:w-64">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Financial Inclusion">Financial Inclusion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-64">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="All India">All India</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => {
            const Icon = scheme.icon;
            return (
              <Card key={scheme.id} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${scheme.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {scheme.location}
                    </Badge>
                  </div>
                  <CardTitle className="text-gray-900">{scheme.name}</CardTitle>
                  <Badge className="w-fit bg-green-100 text-green-700 hover:bg-green-200">
                    {scheme.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {scheme.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Check Eligibility
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No schemes match your filters. Try adjusting your selection.</p>
          </div>
        )}
      </div>
    </section>
  );
}
