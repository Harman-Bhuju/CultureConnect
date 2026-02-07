import React from "react";
import ProductListRow from "./ProductListRow";
import { Package, Search } from "lucide-react";

const ProductList = ({ products, onView, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl sm:rounded-lg shadow-sm border border-gray-100 overflow-hidden">
    {/* Table Header - Hidden on mobile */}
    <div className="hidden lg:grid grid-cols-12 gap-4 px-4 lg:px-6 py-3 lg:py-4 bg-gradient-to-r from-orange-50 to-orange-100/80 border-b border-orange-100">
      <div className="col-span-1 text-[10px] lg:text-xs font-semibold text-orange-800 uppercase tracking-wide">
        Image
      </div>
      <div className="col-span-3 text-[10px] lg:text-xs font-semibold text-orange-800 uppercase tracking-wide">
        Product Details
      </div>
      <div className="col-span-2 text-[10px] lg:text-xs font-semibold text-orange-800 uppercase tracking-wide">
        Category
      </div>
      <div className="col-span-1 text-[10px] lg:text-xs font-semibold text-orange-800 uppercase tracking-wide">
        Price
      </div>
      <div className="col-span-1 text-[10px] lg:text-xs font-semibold text-orange-800 uppercase tracking-wide">
        Stock
      </div>
      <div className="col-span-2 text-[10px] lg:text-xs font-semibold text-orange-800 uppercase tracking-wide">
        Rating
      </div>
      <div className="col-span-1 text-[10px] lg:text-xs font-semibold text-orange-800 uppercase tracking-wide">
        Status
      </div>
      <div className="col-span-1 text-[10px] lg:text-xs font-semibold text-orange-800 uppercase tracking-wide text-right">
        Actions
      </div>
    </div>

    {/* Mobile Header */}
    <div className="lg:hidden px-4 py-3 bg-orange-50 border-b border-orange-100">
      <p className="text-xs font-semibold text-orange-800 uppercase tracking-wide">
        Your Products
      </p>
    </div>

    {/* Table Body */}
    <div className="divide-y divide-gray-100">
      {products.map((product) => (
        <ProductListRow
          key={product.id}
          product={product}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>

    {/* Empty State */}
    {products.length === 0 && (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
        <div className="bg-gray-50 rounded-full p-4 sm:p-6 mb-3 sm:mb-4">
          <Search className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
          No products found
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 text-center max-w-sm">
          Try adjusting your search or filter criteria to find what you're
          looking for.
        </p>
      </div>
    )}
  </div>
);

export default ProductList;
