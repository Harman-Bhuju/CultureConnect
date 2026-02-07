import React, { useState } from "react";
import { ArrowLeft, Plus, BookOpen, BarChart3, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CultureConnectLogo from "../../../assets/logo/cultureconnect__fav.png";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAddCourse = () => {
    navigate(`/teacher/courses/new/${user?.teacher_id}`);
    setIsMobileMenuOpen(false);
  };

  const handleViewAnalytics = () => {
    navigate(`/teacher/analytics/${user?.teacher_id}`);
    setIsMobileMenuOpen(false);
  };

  const handleDrafts = () => {
    navigate(`/teacher/drafts/${user?.teacher_id}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/teacherprofile/${user?.teacher_id}`)}
          className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-colors group">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium text-sm sm:text-base">
            Back to Profile
          </span>
        </button>

        {/* Header Content */}
        <div className="flex justify-between items-center">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <div className="p-2 sm:p-2.5 lg:p-3 rounded-xl">
              <img
                src={CultureConnectLogo}
                alt="CultureConnect Logo"
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Culture Connect
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base font-medium hidden xs:block">
                Course Management Dashboard
              </p>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <button
              onClick={handleViewAnalytics}
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md font-semibold border border-gray-200 text-sm lg:text-base">
              <BarChart3 size={18} strokeWidth={2.5} className="lg:hidden" />
              <BarChart3
                size={20}
                strokeWidth={2.5}
                className="hidden lg:block"
              />
              <span className="hidden lg:inline">View</span> Analytics
            </button>

            <button
              onClick={handleDrafts}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md font-semibold text-sm lg:text-base">
              <BookOpen size={18} strokeWidth={2.5} className="lg:hidden" />
              <BookOpen
                size={20}
                strokeWidth={2.5}
                className="hidden lg:block"
              />
              Drafts
            </button>

            <button
              onClick={handleAddCourse}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-semibold text-sm lg:text-base">
              <Plus size={18} strokeWidth={2.5} className="lg:hidden" />
              <Plus size={20} strokeWidth={2.5} className="hidden lg:block" />
              Add Course
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Action Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100 space-y-2 animate-in slide-in-from-top duration-200">
            <button
              onClick={handleViewAnalytics}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-3 transition-all font-medium border border-gray-200 text-sm">
              <BarChart3 size={18} className="text-gray-500" />
              View Analytics
            </button>

            <button
              onClick={handleDrafts}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg flex items-center gap-3 transition-all font-medium text-sm">
              <BookOpen size={18} className="text-gray-600" />
              Manage Drafts
            </button>

            <button
              onClick={handleAddCourse}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg flex items-center gap-3 transition-all font-semibold shadow-md text-sm">
              <Plus size={18} />
              Add New Course
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
