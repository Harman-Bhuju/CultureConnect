import React, { useEffect } from "react";
import AppSidebar from "../../components/Layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";
import HeroSection from "../../components/Home/HeroSection";
import CategorySection from "../../components/Home/CategorySection";
import FeaturedProducts from "../../components/Home/FeaturedProducts";
import CulturalStorySection from "../../components/Home/CulturalStorySection";
import TeacherSection from "../../components/Home/TeacherSection";
import TestimonialsSection from "../../components/Home/TestimonialsSection";
import NewsletterSection from "../../components/Home/NewsletterSection";

const Home = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="md:overflow-x-hidden h-screen overflow-y-auto bg-white scroll-smooth font-body text-gray-900 antialiased selection:bg-heritage-red selection:text-white">
        <Navbar />

        <main className="flex-1 w-full">
          <HeroSection />
          <CategorySection />
          <FeaturedProducts />
          <CulturalStorySection />
          <TeacherSection />
          <TestimonialsSection />
          <NewsletterSection />
        </main>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
