import { Search, Upload, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const features = [
  {
    icon: Search,
    title: "Personalized Scheme Finder",
    description: "Our AI analyzes your profile to match you with relevant government schemes. Get tailored recommendations based on your age, location, income, and specific needs.",
    link: "#"
  },
  {
    icon: Upload,
    title: "Secure Document Upload",
    description: "Upload documents securely with OCR technology that automatically extracts information. Your data is encrypted and handled with the highest security standards.",
    link: "#"
  },
  {
    icon: RefreshCw,
    title: "Real-Time Updates",
    description: "Stay informed with live API integration that brings you the latest scheme updates, deadlines, and policy changes as they happen.",
    link: "#"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">
            How Sabal Setu Helps You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Leverage cutting-edge technology to navigate the complex landscape of government schemes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-blue-300 transition-colors hover:shadow-lg">
                <CardHeader>
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <CardTitle className="text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button variant="link" className="text-blue-600 p-0 h-auto">
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}