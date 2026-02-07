import React, { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import { Outlet } from "react-router-dom";
import CultureConnectLogo from "../assets/logo/cultureconnect__fav.png";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative group/sidebar-wrapper flex min-h-screen w-full bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <main className="bg-background relative flex w-full flex-1 flex-col md:ml-0 transition-[margin] duration-200 ease-linear">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <img
              src={CultureConnectLogo} // Using favicon as logo placeholder, replace with actual logo import if available in this scope
              alt="Logo"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.src = "https://placehold.co/400"; // Fallback
              }}
            />
            <span className="font-bold text-lg text-gray-900">
              CultureConnect
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
