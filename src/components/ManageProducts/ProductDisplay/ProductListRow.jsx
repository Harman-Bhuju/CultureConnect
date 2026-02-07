import React from "react";
import { Edit2, Trash2, AlertTriangle, Star, ChevronRight } from "lucide-react";
import { BASE_URL } from "../../../Configs/ApiEndpoints";

const ProductListRow = ({ product, onView, onEdit, onDelete }) => {
  const handleRowClick = () => {
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

  // Average rating calculation
  const calculateAverageRating = () => {
    if (!product.reviews || product.reviews.length === 0) {
      return product.averageRating || 0;
    }
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / product.reviews.length) * 10) / 10;
  };

  const avgRating = calculateAverageRating();
  const reviewCount = product.reviews?.length || product.totalReviews || 0;

  // Stock status
  const isLowStock = product.stock <= 10 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  // Image
  const productImage = product.images?.[0];
  const imageUrl = productImage
    ? `${BASE_URL}/uploads/product_images/${productImage}`
    : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";

  const productName = product.productName || product.name || "Unnamed Product";

  // Price formatting
  const formattedPrice =
    typeof product.price === "number"
      ? `Rs. ${product.price.toLocaleString()}`
      : `Rs. ${parseFloat(product.price || 0).toLocaleString()}`;

  return (
    <>
      {/* Desktop Row - Hidden on mobile */}
      <div
        onClick={handleRowClick}
        className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-orange-50 transition-colors cursor-pointer group relative">
        {/* Image */}
        <div className="col-span-1 relative">
          <img
            src={imageUrl}
            alt={productName}
            className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
            }}
          />
          {/* Stock badges */}
          {isLowStock && (
            <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1">
              <AlertTriangle className="w-3 h-3 text-white" />
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
              <AlertTriangle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="col-span-3">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {productName}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1">
            {product.description}
          </p>
        </div>

        {/* Category */}
        <div className="col-span-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
            {product.category}
          </span>
        </div>

        {/* Price */}
        <div className="col-span-1">
          <span className="font-bold text-orange-600 text-sm">
            {formattedPrice}
          </span>
        </div>

        {/* Stock */}
        <div className="col-span-1">
          <div className="flex items-center gap-1">
            <span
              className={`font-semibold ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                    ? "text-orange-600"
                    : "text-gray-900"
              }`}>
              {product.stock}
            </span>
            {isLowStock && (
              <span className="text-xs text-orange-600 font-medium">Low</span>
            )}
            {isOutOfStock && (
              <span className="text-xs text-red-600 font-medium">Out</span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="col-span-2">
          {reviewCount > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-900">
                {avgRating}
              </span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < Math.floor(avgRating) ? "#f59e0b" : "none"}
                    stroke={i < Math.floor(avgRating) ? "#f59e0b" : "#d1d5db"}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">No reviews</span>
          )}
        </div>

        {/* Status */}
        <div className="col-span-1">
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
              product.status === "Active"
                ? "bg-green-100 text-green-700"
                : product.status === "Draft"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}>
            {product.status}
          </span>
        </div>

        {/* Actions */}
        <div className="col-span-1">
          <div className="flex gap-1 justify-end">
            <button
              onClick={handleEdit}
              className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-100 transition-all"
              title="Edit Product">
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-100 transition-all"
              title="Delete Product">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Card Row */}
      <div
        onClick={handleRowClick}
        className="lg:hidden flex items-center gap-3 p-3 sm:p-4 hover:bg-orange-50 transition-colors cursor-pointer group">
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={productName}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
            }}
          />
          {(isLowStock || isOutOfStock) && (
            <div
              className={`absolute -top-1 -right-1 ${
                isOutOfStock ? "bg-red-500" : "bg-orange-500"
              } rounded-full p-1`}>
              <AlertTriangle className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-orange-600 transition-colors">
                {productName}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                {product.category}
              </p>
            </div>
            {/* Status Badge */}
            <span
              className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                product.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : product.status === "Draft"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}>
              {product.status}
            </span>
          </div>

          {/* Price & Stock Row */}
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-orange-600 text-sm">
              {formattedPrice}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${
                  isOutOfStock
                    ? "text-red-600"
                    : isLowStock
                      ? "text-orange-600"
                      : "text-gray-500"
                }`}>
                {product.stock} in stock
              </span>
              <div className="flex items-center gap-0.5">
                <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                <span className="text-xs font-medium text-gray-700">
                  {avgRating}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="flex gap-1">
              <button
                onClick={handleEdit}
                className="p-1.5 rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all"
                title="Edit">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListRow;
