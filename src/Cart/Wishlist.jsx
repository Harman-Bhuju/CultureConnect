import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Package,
  Trash2,
  ShoppingCart,
  AlertCircle,
  Sparkles,
  Star,
  ChevronDown,
} from "lucide-react";
import { BASE_URL } from "../Configs/ApiEndpoints";

const Wishlist = ({
  selectedPeriod,
  wishlistItems,
  removeFromWishlist,
  addToCart,
  loading,
}) => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("newest");

  // Sort wishlist items
  const sortedWishlist = useMemo(() => {
    const sorted = [...wishlistItems];
    sorted.sort((a, b) => {
      const dateA = new Date(a.addedAt);
      const dateB = new Date(b.addedAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [wishlistItems, sortOrder]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Wishlist</h2>
            <p className="text-xs text-gray-500">
              {wishlistItems.length} saved items
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {wishlistItems.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 rounded-full">
                <Star className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                <span className="text-xs font-semibold text-pink-700">
                  Favorites
                </span>
              </div>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer transition-colors">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
              </div>
            </>
          )}
        </div>
      </div>

      {sortedWishlist.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative shadow-lg shadow-pink-200/50">
            <Heart className="w-10 h-10 text-pink-500" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center animate-pulse shadow-md">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <p className="text-gray-900 font-bold text-lg mb-2">
            Nothing saved yet
          </p>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
            Discover beautiful cultural products and save your favorites here
          </p>
          <button className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-full hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-0.5">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {sortedWishlist.map((item) => (
            <div
              key={item.id}
              className="group relative cursor-pointer bg-white shadow-sm hover:shadow-md transition rounded-lg overflow-hidden">
              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(item.id);
                }}
                className="absolute top-1.5 right-1.5 z-20 w-6 h-6 bg-white/90 backdrop-blur-sm text-rose-500 hover:bg-rose-500 hover:text-white rounded-full shadow transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Trash2 className="w-3 h-3" />
              </button>

              {/* Heart Badge */}
              <div className="absolute top-1.5 left-1.5 z-10 w-5 h-5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow">
                <Heart className="w-2.5 h-2.5 text-white fill-white" />
              </div>

              {/* Out of Stock Badge */}
              {!item.inStock && (
                <div className="absolute top-7 left-1.5 z-10 bg-gray-900/80 text-white text-[8px] font-semibold px-1.5 py-0.5 rounded-full">
                  Sold Out
                </div>
              )}

              {/* Product Image */}
              <div
                onClick={() =>
                  navigate(`/products/${item.sellerId}/${item.productId}`)
                }
                className={`relative bg-gray-200 overflow-hidden aspect-[4/4] ${!item.inStock ? "opacity-50" : ""}`}>
                {item.productImage ? (
                  <img
                    src={`${BASE_URL}/uploads/product_images/${item.productImage}`}
                    alt={item.productName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-1.5 sm:p-2">
                <h3
                  onClick={() =>
                    navigate(`/products/${item.sellerId}/${item.productId}`)
                  }
                  className="text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-700 mb-1 line-clamp-1 cursor-pointer hover:text-pink-600 transition-colors">
                  {item.productName}
                </h3>
                <div className="flex items-center gap-1 mb-1.5">
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-pink-600">
                    Rs. {item.price.toLocaleString()}
                  </span>
                </div>

                {/* Add to Cart Button */}
                {item.inStock ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-[8px] sm:text-[9px] font-semibold py-1.5 rounded transition-all flex items-center justify-center gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    Add to Cart
                  </button>
                ) : (
                  <button className="w-full bg-gray-100 text-gray-400 text-[8px] sm:text-[9px] font-semibold py-1.5 rounded cursor-not-allowed flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Tip */}
      {sortedWishlist.length > 0 && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
          <Sparkles className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-gray-900">Quick Tip:</span>{" "}
            Items may sell out fast. Add to cart to secure them!
          </p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
