import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Shield,
  ShoppingBag,
  Code,
  Globe,
  User,
  Settings,
  Flag,
  ArrowLeft,
  Home,
  HelpCircle,
  FileText,
} from "lucide-react";

const DocSidebar = ({ activeSection, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();

  const sections = [
    {
      id: "overview",
      title: "Overview",
      icon: BookOpen,
      color: "blue"
    },
    {
      id: "roles",
      title: "User Roles",
      icon: User,
      color: "purple"
    },
    {
      id: "features",
      title: "Features",
      icon: Settings,
      color: "green"
    },
    {
      id: "shopping",
      title: "Shopping & Payments",
      icon: ShoppingBag,
      color: "orange"
    },
    {
      id: "technical",
      title: "Technical",
      icon: Code,
      color: "gray"
    },
    {
      id: "non-functional",
      title: "Performance & SEO",
      icon: Globe,
      color: "indigo"
    },
    {
      id: "content",
      title: "Content Guidelines",
      icon: Flag,
      color: "pink"
    },
    {
      id: "operations",
      title: "Operations",
      icon: Shield,
      color: "red"
    },
  ];

  const quickLinks = [
    { name: "Home Page", icon: Home, action: () => navigate("/") },
    {
      name: "Support",
      icon: HelpCircle,
      action: () => (window.location.href = "mailto:cultureconnect0701@gmail.com"),
    },
    { name: "License", icon: FileText, action: () => {} },
  ];

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      
      // Close mobile menu after navigation
      if (setIsMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive ? "bg-blue-100 text-blue-700 border-blue-300" : "hover:bg-blue-50 text-gray-600 hover:text-blue-700",
      purple: isActive ? "bg-purple-100 text-purple-700 border-purple-300" : "hover:bg-purple-50 text-gray-600 hover:text-purple-700",
      green: isActive ? "bg-green-100 text-green-700 border-green-300" : "hover:bg-green-50 text-gray-600 hover:text-green-700",
      orange: isActive ? "bg-orange-100 text-orange-700 border-orange-300" : "hover:bg-orange-50 text-gray-600 hover:text-orange-700",
      gray: isActive ? "bg-gray-100 text-gray-900 border-gray-300" : "hover:bg-gray-50 text-gray-600 hover:text-gray-900",
      indigo: isActive ? "bg-indigo-100 text-indigo-700 border-indigo-300" : "hover:bg-indigo-50 text-gray-600 hover:text-indigo-700",
      pink: isActive ? "bg-pink-100 text-pink-700 border-pink-300" : "hover:bg-pink-50 text-gray-600 hover:text-pink-700",
      red: isActive ? "bg-red-100 text-red-700 border-red-300" : "hover:bg-red-50 text-gray-600 hover:text-red-700",
    };
    return colors[color] || colors.blue;
  };

  return (
    <aside className="w-72 lg:block fixed top-20 left-0 bottom-0 overflow-y-auto border-r border-gray-200 bg-white/95 backdrop-blur-sm px-5 py-8 scrollbar-hide">
      {/* Back Button */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all font-semibold group shadow-sm hover:shadow-md">
          <ArrowLeft size={20} className="group-hover:transform group-hover:-translate-x-1 transition-transform" />
          Back to App
        </button>
      </div>

      <div className="space-y-8">
        {/* Quick Links Section */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">
            Quick Access
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <button
                  onClick={link.action}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all font-medium">
                  <link.icon size={18} />
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Documentation Sections */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">
            Documentation
          </h3>
          <ul className="space-y-2">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    onClick={() => handleScrollTo(section.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl cursor-pointer transition-all font-medium text-sm border-2 ${
                      isActive 
                        ? `${getColorClasses(section.color, true)} shadow-md scale-105` 
                        : `${getColorClasses(section.color, false)} border-transparent`
                    }`}>
                    <section.icon size={20} className={isActive ? "" : "opacity-60"} />
                    <span className="flex-1 text-left">{section.title}</span>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Version Info */}
        <div className="pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs font-semibold text-gray-700 mb-1">Documentation v2.0</p>
            <p className="text-xs text-gray-500">Last updated: Jan 2026</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DocSidebar;