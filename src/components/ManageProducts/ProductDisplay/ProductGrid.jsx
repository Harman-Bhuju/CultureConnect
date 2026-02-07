import React from "react";
import ProductCard from "./ProductCard";
import { Package, Search } from "lucide-react";
import DraftProductCard from "./DraftProductCard";

const ProductGrid = ({
  products,
  onView,
  onEdit,
  onDelete,
  onPublish,
  isDraftMode = false,
}) => (
  <div className="space-y-4 sm:space-y-6">
    {products.length > 0 ? (
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
        {products.map((product) =>
          isDraftMode ? (
            <DraftProductCard
              key={product.id}
              product={product}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onPublish={onPublish}
            />
          ) : (
            <ProductCard
              key={product.id}
              product={product}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ),
        )}
      </div>
    ) : (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4">
        <div className="bg-gray-50 rounded-full p-4 sm:p-5 lg:p-6 mb-3 sm:mb-4">
          <Search className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-300" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2 text-center">
          No products found
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 text-center max-w-xs sm:max-w-sm px-2">
          Try adjusting your search or filter criteria to find what you're
          looking for.
        </p>
      </div>
    )}

    {products.length > 0 && (
      <div className="flex items-center justify-center pt-1 sm:pt-2">
        <p className="text-xs sm:text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">{products.length}</span>{" "}
          {products.length === 1 ? "product" : "products"}
        </p>
      </div>
    )}
  </div>
);

export default ProductGrid;
