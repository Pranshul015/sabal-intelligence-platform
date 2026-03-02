import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Upload, CheckCircle, Clock, FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userAPI, applicationsAPI, documentsAPI } from "../lib/api";

interface QuickStatsProps {
  darkMode?: boolean;
}

export function QuickStats({ darkMode }: QuickStatsProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    eligibleSchemes: 0,
    pendingApplications: 0,
    totalApplications: 0,
    verifiedDocs: 0,
    totalDocs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [schemesRes, appsRes, docsRes] = await Promise.all([
        userAPI.getEligibleSchemes().catch(() => ({ data: { schemes: [] } })),
        applicationsAPI.getAll().catch(() => ({ data: { applications: [] } })),
        documentsAPI.getAll().catch(() => ({ data: { documents: [] } })),
      ]);

      const schemes = schemesRes.data.schemes || [];
      const apps = appsRes.data.applications || [];
      const docs = docsRes.data.documents || [];

      const pendingApps = apps.filter((a: any) =>
        ["PENDING", "IN_REVIEW"].includes(a.status)
      ).length;
      const verifiedDocs = docs.filter(
        (d: any) => d.ocrStatus === "COMPLETED"
      ).length;

      setStats({
        eligibleSchemes: schemes.length,
        pendingApplications: pendingApps,
        totalApplications: apps.length,
        verifiedDocs,
        totalDocs: docs.length,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const docProgress =
    stats.totalDocs > 0
      ? Math.round((stats.verifiedDocs / stats.totalDocs) * 100)
      : 0;
  const appSuccessRate =
    stats.totalApplications > 0
      ? Math.round(
        ((stats.totalApplications - stats.pendingApplications) /
          stats.totalApplications) *
        100
      )
      : 0;

  return (
    <div className="space-y-6 sticky top-20">
      {/* Quick Stats Panel */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-500">Loading...</span>
            </div>
          ) : (
            <>
              {/* Eligible Schemes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Eligible Schemes</span>
                  <span className="text-blue-600 dark:text-blue-400">{stats.eligibleSchemes}</span>
                </div>
                <Progress value={Math.min(stats.eligibleSchemes * 5, 100)} className="h-2" />
              </div>

              {/* Pending Applications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Pending Applications</span>
                  <span className="text-orange-600 dark:text-orange-400">{stats.pendingApplications}</span>
                </div>
                <Progress
                  value={stats.totalApplications > 0 ? (stats.pendingApplications / stats.totalApplications) * 100 : 0}
                  className="h-2"
                />
              </div>

              {/* Documents Verified */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Documents Verified</span>
                  <span className="text-green-600 dark:text-green-400">
                    {stats.verifiedDocs}/{stats.totalDocs}
                  </span>
                </div>
                <Progress value={docProgress} className="h-2" />
              </div>

              {/* Application Success Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">Processed Rate</span>
                  <span className="text-purple-600 dark:text-purple-400">{appSuccessRate}%</span>
                </div>
                <Progress value={appSuccessRate} className="h-2" />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Upload Button */}
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        onClick={() => navigate("/dashboard/upload")}
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Document
      </Button>
    </div>
  );
}
