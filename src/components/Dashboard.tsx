import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardCard } from "./DashboardCard";
import { QuickStats } from "./QuickStats";
import { RecommendedActions } from "./RecommendedActions";
import { ChatbotModal } from "./ChatbotModal";
import { ProfilePage } from "./ProfilePage";
import { SchemesPage } from "./SchemesPage";
import { YourSchemesPage } from "./YourSchemesPage";
import { ComplaintsForumPage } from "./ComplaintsForumPage";
import { SupportPage } from "./SupportPage";
import { MyDocumentsPage } from "./MyDocumentsPage";
import { UploadDocumentsPage } from "./UploadDocumentsPage";
import { SettingsPage } from "./SettingsPage";
import { ApplyNowPage } from "./ApplyNowPage";
import { TrackStatusPage } from "./TrackStatusPage";

import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Sparkles,
  MessageCircle,
  MessageSquare,
  Headphones,
  FolderLock
} from "lucide-react";

function DashboardHome() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [darkMode] = useState(false);
  const [showStayAware, setShowStayAware] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setShowStayAware(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardCards = [
    {
      icon: User,
      title: "Manage Profile",
      subtitle: "Update income, location, documents",
      cta: "Edit Profile →",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
      onClick: () => navigate("/dashboard/profile")
    },
    {
      icon: Sparkles,
      title: "Your Schemes",
      subtitle: "AI-matched schemes based on your data",
      cta: "View Matches →",
      badge: "3 New",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
      onClick: () => navigate("/dashboard/your-schemes")
    },
    {
      icon: MessageCircle,
      title: "Ask Sabal",
      subtitle: "24/7 AI chatbot for instant help",
      cta: "Start Chat",
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
      onClick: () => setChatbotOpen(true)
    },
    {
      icon: MessageSquare,
      title: "Complaints & Forum",
      subtitle: "Report issues, discuss with community",
      cta: "Go to Forum →",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
      onClick: () => navigate("/dashboard/complaints")
    },
    {
      icon: Headphones,
      title: "Helpline",
      subtitle: "Call toll-free or raise a ticket",
      cta: "Contact Support →",
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400",
      onClick: () => navigate("/dashboard/support")
    },
    {
      icon: FolderLock,
      title: "My Documents",
      subtitle: "Securely stored Aadhaar, income cert, etc.",
      cta: "View Vault →",
      color: "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400",
      onClick: () => navigate("/dashboard/documents")
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <DashboardNavbar />

        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content Area */}
              <div className="flex-1">
                {/* Welcome Section */}
                <div className="mb-8">
                  <h1 className="text-gray-900 dark:text-white mb-2">
                    Welcome back, {user?.fullName || "User"}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Here's your personalized dashboard to manage schemes and applications
                  </p>
                </div>

                {/* Dashboard Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {dashboardCards.map((card, index) => (
                    <DashboardCard key={index} {...card} />
                  ))}
                </div>

                {/* Recommended Actions */}
                <RecommendedActions darkMode={darkMode} />
              </div>

              {/* Right Sidebar - Desktop Only */}
              <aside className="hidden lg:block lg:w-80">
                <QuickStats darkMode={darkMode} />
              </aside>
            </div>

            {/* Mobile Quick Stats - Below main content on mobile */}
            <div className="lg:hidden mt-8">
              <QuickStats darkMode={darkMode} />
            </div>
          </div>
        </main>

        {/* Stay Aware Message */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-30 transition-all duration-500 ease-in-out ${showStayAware ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
            }`}
        >
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 py-2 text-center">
            <p className="text-white text-sm font-medium tracking-widest uppercase">
              🇮🇳 Stay Aware — Know Your Rights, Claim Your Benefits
            </p>
          </div>
        </div>

        {/* Chatbot Modal */}
        {chatbotOpen && (
          <ChatbotModal onClose={() => setChatbotOpen(false)} darkMode={darkMode} />
        )}
      </div>
    </>
  );
}

function DashboardRouteWrapper() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="profile" element={<ProfilePage onBack={() => navigate('/dashboard')} isDarkMode={false} />} />
      <Route path="schemes" element={<SchemesPage onBack={() => navigate('/dashboard')} isDarkMode={false} />} />
      <Route path="your-schemes" element={<YourSchemesPage onBack={() => navigate('/dashboard')} isDarkMode={false} />} />
      <Route path="complaints" element={<ComplaintsForumPage onBack={() => navigate('/dashboard')} isDarkMode={false} />} />
      <Route path="support" element={<SupportPage onBack={() => navigate('/dashboard')} isDarkMode={false} />} />
      <Route path="documents" element={<MyDocumentsPage onBack={() => navigate('/dashboard')} onNavigateToUpload={() => navigate('/dashboard/upload')} isDarkMode={false} />} />
      <Route path="upload" element={<UploadDocumentsPage onBack={() => navigate('/dashboard')} onNavigateToVault={() => navigate('/dashboard/documents')} isDarkMode={false} />} />
      <Route path="settings" element={<SettingsPage onBack={() => navigate('/dashboard')} isDarkMode={false} onToggleDarkMode={() => { }} />} />
      <Route path="apply/:schemeId" element={<ApplyNowPage />} />
      <Route path="track" element={<TrackStatusPage />} />
    </Routes>
  );
}

export function Dashboard() {
  return <DashboardRouteWrapper />;
}