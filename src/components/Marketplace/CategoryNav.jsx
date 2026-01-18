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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.id}
            to={cat.path}
            className="group relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
              <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-black">
              {cat.title}
            </h3>
            <p className="text-sm text-gray-500">{cat.count}</p>

            {/* Active Indicator (subtle) */}
            <div className="absolute bottom-0 left-0 h-1 bg-black w-0 group-hover:w-full transition-all duration-300 rounded-b-2xl" />
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryNav;
