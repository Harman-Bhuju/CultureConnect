import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "../../components/Layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import Navbar from "../../components/Layout/NavBar";
import Footer from "../../components/Layout/Footer";
import CategoryNav from "../../components/Marketplace/CategoryNav";
import TrendingCarousel from "../../components/Carousel/TrendingCarousel";
import MayLike from "../../components/Carousel/MayLike";
import SellerSpotlight from "../../components/Marketplace/SellerSpotlight";
import { Search } from "lucide-react";
import SearchBar from "../../components/Common/SearchBar";

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
            <div>
              {/* Hero Section */}
              <div className="relative text-center pt-20 pb-12 px-4">
                {/* Subtle Decorative Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-50/50 blur-[120px] rounded-full -z-10" />

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                  Cultural{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                    Marketplace
                  </span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-medium">
                  Discover authentic handcrafted items from master artisans.
                  Support local heritage with every purchase.
                </p>

                {/* Search Bar Refined */}
                <SearchBar variant="hero-marketplace" contextType="product" />
              </div>

              {/* Category Navigation */}
              <div className="px-4 md:px-8">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Explore by Category
                  </h2>
                  <p className="text-gray-500">
                    Pick a category to find unique items
                  </p>
                </div>
                <CategoryNav />
              </div>

              <div className="space-y-8">
                {/* Trending Products */}
                <TrendingCarousel />

                {/* Seller Spotlight */}
                <SellerSpotlight />

                <MayLike />
              </div>
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
