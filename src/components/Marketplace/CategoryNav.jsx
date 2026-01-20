import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Shirt, Music, Palette, Gift } from "lucide-react";

const categories = [
  {
    id: "traditional",
    title: "Traditional Clothing",
    path: "/marketplace/traditional",
    icon: Shirt,
    count: "450+ Items",
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: "instruments",
    title: "Musical Instruments",
    path: "/marketplace/instruments",
    icon: Music,
    count: "120+ Instruments",
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "arts",
    title: "Arts & Decor",
    path: "/marketplace/arts_decors",
    icon: Palette,
    count: "800+ Artworks",
    color: "bg-purple-50 text-purple-600",
  },
  // Decorations merged into Arts & Decor
];

const CategoryNav = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.id}
            to={cat.path}
            className="group relative w-full sm:w-64 p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transition-all duration-500 overflow-hidden">
            {/* Background Grain/Texture Effect (Optional aesthetic touch) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${cat.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
              <Icon size={32} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
              {cat.title}
            </h3>
            <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
              {cat.count}
            </p>

            {/* Modern Animated Underline */}
            <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-transparent via-black/20 to-transparent w-0 group-hover:w-full transition-all duration-700 ease-in-out" />

            {/* Subtle Glow on Hover */}
            <div className="absolute -inset-2 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryNav;
