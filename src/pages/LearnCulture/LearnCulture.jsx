import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "../../components/Layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import Navbar from "../../components/Layout/NavBar";
import Footer from "../../components/Layout/Footer";

import { Search, Sparkles } from "lucide-react";
import "swiper/css/pagination";
import CourseSwiper from "../../components/LearnCulture/CourseSwiper";
import MayLikeCourse from "../../components/LearnCulture/MaylikeCourse";
import TeacherSpotlight from "../../components/LearnCulture/TeacherSpotlight";
import SearchBar from "../../components/Common/SearchBar";
import LCCategoryNav from "../../components/LearnCulture/LCCategoryNav";

const LearnCulture = () => {
  const location = useLocation();
  const isLandingPage =
    location.pathname === "/learnculture" ||
    location.pathname === "/learnculture/";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="md:overflow-x-hidden h-screen overflow-y-auto bg-white">
        <Navbar />

        <div className="md:p-0 max-w-7xl mx-auto w-full">
          {isLandingPage ? (
            <div>
              {/* Hero Section */}
              <div className="relative text-center pt-20 pb-12 px-4 mb-8">
                {/* Decorative Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-50/50 blur-[120px] rounded-full -z-10" />

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                  Learn{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                    Heritage
                  </span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-medium">
                  Connect with your roots through master-led courses in
                  traditional arts, music, and dance.
                </p>

                {/* Search Bar */}
                <SearchBar variant="hero-learn" contextType="course" />
              </div>

              {/* Category Navigation */}
              <div className="px-4 md:px-8">
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold mb-4">
                    <Sparkles size={14} /> EXPLORE PATHWAYS
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Preserving Traditions
                  </h2>
                  <p className="text-gray-500">
                    Structured learning paths from verified cultural experts
                  </p>
                </div>
                <LCCategoryNav />
                <CourseSwiper />
              </div>

              <div className="space-y-8 pb-20">
                {/* Teacher Spotlight */}
                <TeacherSpotlight />

                {/* May Like Courses */}
                <MayLikeCourse />
              </div>
            </div>
          ) : (
            <div className="p-4">
              <Outlet />
            </div>
          )}
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LearnCulture;
