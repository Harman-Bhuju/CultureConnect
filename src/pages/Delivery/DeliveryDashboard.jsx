import React, { useState } from "react";
import DeliverySidebar from "./DeliverySidebar";
import { Outlet } from "react-router-dom";
import { Menu, X, Truck } from "lucide-react";

const DeliveryDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-md active:scale-95 transition-all">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg tracking-tight">
            {/* Using a Truck icon as logo placeholder if image fails or isn't available, matching sidebar style */}
            <span className="flex items-center gap-2">
              <Truck className="w-6 h-6" />
              <span>CultureConnect</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar with mobile classes */}
      <div
        className={`
        fixed inset-y-0 left-0 z-[60] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:transition-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <DeliverySidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="relative flex w-full flex-1 flex-col min-w-0">
        <div className="flex-1 overflow-y-auto px-3 pb-20 pt-24 md:px-6 md:pt-24 md:pb-6 lg:p-8 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
