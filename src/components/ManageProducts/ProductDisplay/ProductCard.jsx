import React from "react";
import { Edit2, Trash2, AlertTriangle, Star } from "lucide-react";
import { BASE_URL } from "../../../Configs/ApiEndpoints";

// Product Card Component - Responsive
export default function ProductCard({ product, onEdit, onDelete, onView }) {
  const handleCardClick = (e) => {
    if (e.target.closest(".action-button")) {
      return;
    }
    onView(product);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(product);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(product);
  };

  // Check if stock is low
  const isLowStock = product.stock <= 10 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  // Get the first image from the images array
  const productImage = product.images?.[0];
  const imageUrl = productImage
    ? `${BASE_URL}/uploads/product_images/${productImage}`
    : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";

  // Get product name
  const productName = product.productName || product.name || "Unnamed Product";

  // Rating
  const rating = product.averageRating || 0;
  const reviews = product.totalReviews || 0;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group relative border border-gray-100">
      {/* Status and Stock Badges */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex flex-wrap gap-1 sm:gap-2">
        {/* Status Badge */}
        <span
          className={`px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded shadow-sm backdrop-blur-md ${
            product.status === "Active"
              ? "bg-green-100/90 text-green-700"
              : product.status === "Draft"
                ? "bg-gray-100/90 text-gray-700"
                : "bg-yellow-100/90 text-yellow-700"
          }`}>
          {product.status}
        </span>

        {/* Low Stock Badge */}
        {isLowStock && (
          <span className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded bg-orange-100/90 text-orange-700 flex items-center gap-0.5 sm:gap-1 shadow-sm">
            <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden xs:inline">Low Stock</span>
          </span>
        )}
        {isOutOfStock && (
          <span className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded bg-red-100/90 text-red-700 flex items-center gap-0.5 sm:gap-1 shadow-sm">
            <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden xs:inline">Out</span>
          </span>
        )}
      </div>

      {/* Action Buttons - Always visible on mobile */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 flex gap-1.5 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="action-button bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors border border-gray-100"
          title="Edit">
          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
        </button>
        <button
          onClick={handleDelete}
          className="action-button bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-md hover:bg-red-50 transition-colors border border-gray-100"
          title="Delete">
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square sm:h-48 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        {/* Category */}
        <div className="text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5 sm:mb-1 uppercase truncate">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-1">
          {productName}
        </h3>

        {/* Description - Hidden on smallest screens */}
        <p className="hidden xs:block text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className="sm:hidden"
                fill={i < Math.floor(rating) ? "#f59e0b" : "none"}
                stroke={i < Math.floor(rating) ? "#f59e0b" : "#d1d5db"}
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className="hidden sm:block"
                fill={i < Math.floor(rating) ? "#f59e0b" : "none"}
                stroke={i < Math.floor(rating) ? "#f59e0b" : "#d1d5db"}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-gray-500">
            ({reviews})
          </span>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <span className="text-base sm:text-lg lg:text-xl font-bold text-orange-600">
            Rs.{" "}
            {typeof product.price === "number"
              ? product.price.toLocaleString()
              : parseFloat(product.price).toLocaleString()}
          </span>
          <span
            className={`text-[10px] sm:text-sm font-medium ${
              isOutOfStock
                ? "text-red-600"
                : isLowStock
                  ? "text-orange-600"
                  : "text-gray-500"
            }`}>
            {product.stock} in stock
          </span>
        </div>
      </div>
    </div>
  );
}
