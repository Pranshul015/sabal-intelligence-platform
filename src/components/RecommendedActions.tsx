import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { AlertCircle, Calendar, FileCheck, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

interface RecommendedActionsProps {
  darkMode?: boolean;
}

export function RecommendedActions({ darkMode }: RecommendedActionsProps) {
  const navigate = useNavigate();

  const actions = [
    {
      icon: AlertCircle,
      title: "Complete Your Profile",
      description: "Complete your profile to unlock all features and better scheme matches.",
      deadline: "Important",
      urgency: "high",
      cta: "Complete Now",
      route: "/dashboard/profile"
    },
    {
      icon: Calendar,
      title: "Browse Schemes",
      description: "Explore government schemes you may be eligible for.",
      deadline: "Explore",
      urgency: "medium",
      cta: "Apply Now",
      route: "/dashboard/schemes"
    },
    {
      icon: FileCheck,
      title: "Upload Documents",
      description: "Upload your documents for AI-powered verification.",
      deadline: "Recommended",
      urgency: "low",
      cta: "Upload",
      route: "/dashboard/upload"
    },
    {
      icon: TrendingUp,
      title: "Your Matched Schemes",
      description: "See AI-matched schemes based on your profile data.",
      deadline: "Personalized",
      urgency: "info",
      cta: "Explore",
      route: "/dashboard/your-schemes"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "low":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900 dark:text-white">Recommended Actions</h2>
        <Button variant="ghost" className="text-blue-600 dark:text-blue-400" onClick={() => navigate("/dashboard/schemes")}>
          View All →
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
              onClick={() => navigate(action.route)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge className={getUrgencyColor(action.urgency)}>
                    {action.deadline}
                  </Badge>
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">{action.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {action.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(action.route);
                  }}
                >
                  {action.cta}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
