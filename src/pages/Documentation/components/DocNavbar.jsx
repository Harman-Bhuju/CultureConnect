import React from "react";
import CultureConnectLogo from "../../../assets/logo/cultureconnect__fav.png";
import { Link } from "react-router-dom";
import { Github, Menu, X } from "lucide-react";

const DocNavbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-gray-200 h-20 items-center flex">
      <div className="max-w-full px-6 lg:px-12 w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={CultureConnectLogo}
              alt="CultureConnect Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-gray-900">
              CultureConnect{" "}
              <span className="text-gray-500 font-normal hidden xs:inline">
                Docs
              </span>
            </span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-royal-blue transition-colors">
            Back to App
          </Link>
          <a
            href="https://github.com/Harman-Bhuju/CultureConnect"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            <Github size={18} />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
};

export default DocNavbar;
