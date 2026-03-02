import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [income, setIncome] = useState("");
  const navigate = useNavigate();

  const handleQuickCheck = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ age, location, income });
    navigate("/login");
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-16 sm:py-24 lg:py-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-10">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1523287562758-66c7fc58967f?w=1920&q=80"
          alt="Diverse community"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Hero Text */}
          <h1 className="text-gray-900 mb-6 max-w-4xl mx-auto">
            Discover Government Schemes Tailored to You
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            AI-driven eligibility mapping with document upload and personalized recommendations
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white mb-12"
            onClick={() => navigate("/login")}
          >
            Start Your Eligibility Check
          </Button>

          {/* Quick Input Form */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h3 className="text-gray-900 mb-6">Quick Eligibility Preview</h3>
            <form onSubmit={handleQuickCheck} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="age" className="block text-gray-700 mb-2">
                    Age
                  </label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-gray-700 mb-2">
                    Location
                  </label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location" className="w-full">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="west-bengal">West Bengal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="income" className="block text-gray-700 mb-2">
                    Annual Income
                  </label>
                  <Select value={income} onValueChange={setIncome}>
                    <SelectTrigger id="income" className="w-full">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below-1">Below ₹1 Lakh</SelectItem>
                      <SelectItem value="1-3">₹1-3 Lakhs</SelectItem>
                      <SelectItem value="3-5">₹3-5 Lakhs</SelectItem>
                      <SelectItem value="5-10">₹5-10 Lakhs</SelectItem>
                      <SelectItem value="above-10">Above ₹10 Lakhs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Check Eligibility
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}