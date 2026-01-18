import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "../../components/Layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import Navbar from "../../components/Layout/NavBar";
import Footer from "../../components/Layout/Footer";
import CategoryNav from "../../components/Marketplace/CategoryNav";
import TrendingCarousel from "../../components/Carousel/TrendingCarousel";
import CardsArranged from "../../components/Home/CardsArranged";
import MayLike from "../../components/Carousel/MayLike";
import SellerSpotlight from "../../components/Marketplace/SellerSpotlight";
import { Search } from "lucide-react";

const Marketplace = () => {
  const location = useLocation();
  const isLandingPage =
    location.pathname === "/marketplace" ||
    location.pathname === "/marketplace/";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="md:overflow-x-hidden h-screen overflow-y-auto bg-white">
        <Navbar />

        <div className="md:p-0 max-w-7xl mx-auto w-full">
          {/* Landing Page Content */}
          {isLandingPage ? (
            <div className="space-y-4">
              {/* Hero Section */}
              <div className="text-center py-8 px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                  Cultural Marketplace
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
                  Discover authentic handcrafted items from master artisans.
                  Support local heritage with every purchase.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group">
                  <input
                    type="text"
                    placeholder="Search for clothes, instruments, art..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-black/5 focus:border-gray-300 outline-none transition-all hover:bg-white hover:shadow-md"
                  />
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600"
                    size={20}
                  />
                </div>
              </div>

              {/* Category Navigation */}
              <div className="px-4 md:px-8">
                <CategoryNav />
              </div>

              {/* Trending Products */}
              <TrendingCarousel />

              {/* Seller Spotlight */}
              <div className="px-4 md:px-8">
                <SellerSpotlight />
              </div>

              {/* May Like */}
              <MayLike />
            </div>
          ) : (
            /* Sub-page Content */
            <Outlet />
          )}
        </div>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Marketplace;
