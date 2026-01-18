import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { gsap } from "gsap";

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const actionsRef = useRef(null);

  // Animation on hover
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -5,
      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(imageRef.current, {
      scale: 1.05,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(actionsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(actionsRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          ref={imageRef}
          src={
            product.images?.[0]?.url ||
            product.image ||
            "https://via.placeholder.com/300"
          }
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Quick Actions Overlay */}
        <div
          ref={actionsRef}
          className="absolute inset-0 bg-black/5 flex items-center justify-center gap-2 opacity-0 translate-y-2">
          <Link
            to={`/products/${product.seller_id}/${product.id}`}
            className="p-3 bg-white rounded-full text-gray-700 hover:text-black hover:scale-110 transition-transform shadow-lg"
            title="View Details">
            <Eye size={20} />
          </Link>
          <button
            className="p-3 bg-white rounded-full text-gray-700 hover:text-red-500 hover:scale-110 transition-transform shadow-lg"
            title="Add to Wishlist">
            <Heart size={20} />
          </button>
        </div>

        {/* Badge */}
        {product.isNew && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-md">
            New
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">
              {product.category}
            </p>
          </div>
          <p className="font-bold text-lg">Rs. {product.price}</p>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
            {/* Seller avatar placeholder */}
            <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
              {product.seller_business_name?.[0] || "S"}
            </div>
          </div>
          <span className="text-xs text-gray-500 truncate">
            {product.seller_business_name || "Verified Seller"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
