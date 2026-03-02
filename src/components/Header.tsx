import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-blue-700">Sabal Setu</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="#schemes" className="text-gray-700 hover:text-blue-600 transition-colors">
              Schemes
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="text-blue-600" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate("/login")}>
                  Sign Up
                </Button>
              </>
            )}
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
          <div className="md:hidden py-4 space-y-4">
            <a href="#home" className="block text-gray-700 hover:text-blue-600 py-2">
              Home
            </a>
            <a href="#about" className="block text-gray-700 hover:text-blue-600 py-2">
              About
            </a>
            <a href="#schemes" className="block text-gray-700 hover:text-blue-600 py-2">
              Schemes
            </a>
            <a href="#contact" className="block text-gray-700 hover:text-blue-600 py-2">
              Contact
            </a>
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" className="text-blue-600 w-full" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" onClick={() => navigate("/login")}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}