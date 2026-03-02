import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, User, Settings, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";

export function DashboardNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex-shrink-0">
            <h1 className="text-blue-700 dark:text-blue-400 font-bold text-xl">Sabal Setu</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/dashboard/schemes" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors text-sm font-medium">
                     Schemes
            </Link>
            <Link to="/dashboard/your-schemes" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors text-sm font-medium">
              My Schemes
            </Link>
            <Link to="/dashboard/track" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors text-sm font-medium">
              Track Status
            </Link>
            <Link to="/dashboard/upload" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors text-sm font-medium">
              Upload Docs
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)} className="text-gray-600 dark:text-gray-400">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1 pr-3 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {user?.fullName ? getInitials(user.fullName) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.fullName || "User"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="text-sm font-medium">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/dashboard/schemes" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              Schemes
            </Link>
            <Link to="/dashboard/your-schemes" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              My Schemes
            </Link>
            <Link to="/dashboard/track" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              Track Status
            </Link>
            <Link to="/dashboard/upload" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              Upload Docs
            </Link>
            <Link to="/dashboard/profile" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              Profile
            </Link>
            <div className="border-t pt-2 mt-2">
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}