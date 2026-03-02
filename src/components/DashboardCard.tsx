import { LucideIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  cta: string;
  color: string;
  badge?: string;
  link?: string;
  onClick?: () => void;
}

export function DashboardCard({
  icon: Icon,
  title,
  subtitle,
  cta,
  color,
  badge,
  link,
  onClick
}: DashboardCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-600 dark:bg-gray-800 dark:border-gray-700"
      onClick={handleClick}
    >
      <CardContent className="p-6 h-full flex flex-col justify-between min-h-[180px]">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${color} transition-transform group-hover:scale-110`}>
              <Icon className="w-8 h-8" />
            </div>
            {badge && (
              <Badge className="bg-red-500 text-white hover:bg-red-600">
                {badge}
              </Badge>
            )}
          </div>
          <h3 className="text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {subtitle}
          </p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 h-auto group-hover:translate-x-2 transition-transform"
        >
          {cta}
        </Button>
      </CardContent>
    </Card>
  );
}
