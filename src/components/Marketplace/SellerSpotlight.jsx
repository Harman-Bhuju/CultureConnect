import React from "react";
import { Link } from "react-router-dom";
import { Star, ChevronRight } from "lucide-react";

const sellers = [
  {
    id: 1,
    name: "Himalayan Handcrafts",
    image:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80",
    rating: 4.8,
    products: 124,
    specialty: "Traditional Woolens",
  },
  {
    id: 2,
    name: "Kathmandu Arts",
    image:
      "https://images.unsplash.com/photo-1460661631160-a5a07cf1317d?w=400&q=80",
    rating: 4.9,
    products: 85,
    specialty: "Thangka Paintings",
  },
  {
    id: 3,
    name: "Nepal Instruments",
    image:
      "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&q=80",
    rating: 4.7,
    products: 56,
    specialty: "Musical Instruments",
  },
  {
    id: 4,
    name: "Pashmina House",
    image:
      "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&q=80",
    rating: 4.6,
    products: 210,
    specialty: "Authentic Pashmina",
  },
  {
    id: 5,
    name: "Cultural Crafts",
    image:
      "https://images.unsplash.com/photo-1493106358005-46e5ca8f5119?w=400&q=80",
    rating: 4.5,
    products: 120,
    specialty: "Decorations",
  },
];

const SellerSpotlight = () => {
  return (
    <div className="py-8 bg-gray-50 -mx-4 px-4 md:-mx-8 md:px-8">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Suggested Sellers
        </h2>
        <p className="text-sm text-gray-500">Meet top artisans</p>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-4 pb-4 md:pb-0 scrollbar-hide snap-x">
        {sellers.map((seller) => (
          <Link
            key={seller.id}
            to={`/sellerprofile/${seller.id}`}
            className="flex-shrink-0 w-[280px] md:w-[320px] snap-start bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-shadow hover:shadow-md flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <img
                src={seller.image}
                alt={seller.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate text-sm md:text-base">
                {seller.name}
              </h3>
              <p className="text-xs text-gray-500 mb-1">{seller.specialty}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-0.5 text-yellow-500 font-medium">
                  <Star size={12} fill="currentColor" /> {seller.rating}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">
                  {seller.products} Products
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SellerSpotlight;
