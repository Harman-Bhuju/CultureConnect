import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, X, Menu, ArrowLeft } from "lucide-react";
import { SidebarTrigger, useSidebar } from "../../components/ui/sidebar";
import { useAuth } from "../../context/AuthContext";
import CultureConnectLogo from "../../assets/logo/cultureconnect__fav.png";
import { useNavigate, useLocation } from "react-router-dom";
import default_logo from "../../assets/default-image.jpg";
import SearchBar from "../Common/SearchBar";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearch, setIsMobileSearch] = useState(false);
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const getSearchContext = () => {
    const path = location.pathname;
    if (
      path.includes("/marketplace") ||
      path.includes("/products") ||
      path.includes("/sellerprofile")
    ) {
      let category = "";
      if (path.includes("/traditional")) category = "cultural-clothes";
      if (path.includes("/instruments")) category = "musical-instruments";
      if (path.includes("/arts_decors")) category = "handicraft-decors";
      return { type: "product", category };
    }
    if (
      path.includes("/learnculture") ||
      path.includes("/courses") ||
      path.includes("/teacherprofile")
    ) {
      let category = "";
      if (path.includes("/dances")) category = "Cultural Dances";
      if (path.includes("/singing")) category = "Cultural Singing";
      if (path.includes("/instruments")) category = "Musical Instruments";
      if (path.includes("/art")) category = "Cultural Art & Crafts";
      return { type: "course", category };
    }
    return { type: "all", category: "" };
  };

  const context = getSearchContext();

  const handleSearchToggle = () => setIsSearchOpen(!isSearchOpen);

  useEffect(() => {
    const handleResize = () => setIsMobileSearch(window.innerWidth < 768); // Align with md breakpoint
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b">
      <div className="max-w-full px-2 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center lg:hidden md:gap-2 sm:gap-1">
              <SidebarTrigger className="lg:hidden text-2xl">
                <Menu />
              </SidebarTrigger>
              <img
                src={CultureConnectLogo}
                alt="Logo"
                className="w-6 h-6 md:w-8 md:h-8 object-contain"
              />
              <span className="text-sm xs:text-base md:text-[18px] font-bold text-gray-800">
                CultureConnect
              </span>
            </div>
            {!isSearchOpen && isCollapsed && (
              <div className="hidden lg:flex items-center gap-2">
                <img
                  src={CultureConnectLogo}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold text-gray-800">
                  CultureConnect
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 md:gap-3 flex-1 justify-end">
            {/* Desktop & Tablet Search */}
            <div className="hidden md:flex flex-1 max-w-sm lg:max-w-xl">
              <SearchBar
                variant="navbar"
                contextType={context.type}
                initialCategory={context.category}
              />
            </div>

            {/* Mobile Actions */}
            {!isSearchOpen && (
              <div className="md:hidden">
                <button
                  onClick={handleSearchToggle}
                  className="p-2.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-all active:scale-90">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            )}

            {!isSearchOpen && (
              <>
                <button
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95"
                  onClick={() => navigate("/cart")}>
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button
                  className="flex-shrink-0 hover:opacity-80 transition-opacity active:scale-95"
                  onClick={() => navigate("/settings")}>
                  <img
                    src={user?.avatar || default_logo}
                    alt="User"
                    className="w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-gray-200"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && isMobileSearch && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex flex-col p-4 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-xl border border-gray-100">
            <button
              onClick={handleSearchToggle}
              className="py-2 pl-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <SearchBar
                variant="navbar"
                contextType={context.type}
                initialCategory={context.category}
              />
            </div>
          </div>
          <div className="mt-8 px-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
              Quick Search
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Dances", "Instruments", "Crafts", "Sellers"].map((tag) => (
                <button
                  key={tag}
                  className="px-4 py-2 bg-gray-50 hover:bg-amber-50 hover:text-amber-600 rounded-full text-sm font-medium transition-colors border border-gray-100">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
