// src/components/Tabs.jsx
import React from "react";
import Description from "./Description";
import Specifications from "./Specifications";
import CareInstructions from "./CareInstructions";
import Reviews from "./Reviews";

const Tabs = ({
  activeTab,
  setActiveTab,
  product,
  openReviewForm,
  openDeleteModal,
  sellerId,
}) => {
  const tabs = [
    "description",
    "specifications",
    ...(product?.CareInstructions ? ["care"] : []),
    "reviews",
  ];

  return (
    <div className="mt-12 bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="flex gap-4 md:gap-8 border-b px-4 md:px-6 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 font-semibold capitalize border-b-2 transition whitespace-nowrap flex-shrink-0 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "description" && <Description product={product} />}
        {activeTab === "specifications" && <Specifications product={product} />}
        {activeTab === "care" && product?.CareInstructions && (
          <CareInstructions product={product} />
        )}
        {activeTab === "reviews" && (
          <Reviews
            product={product}
            openReviewForm={openReviewForm}
            openDeleteModal={openDeleteModal}
            sellerId={sellerId}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;
