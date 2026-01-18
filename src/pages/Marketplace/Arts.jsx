import React from "react";
import CategoryPageLayout from "./components/CategoryPageLayout";

const generateProducts = (category, count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${category}-${i}`,
    sellerId: "mock-seller-1",
    productName: `${category} ${i + 1}`,
    price: 1200 + i * 300,
    image: null,
    rating: 3 + Math.random() * 2,
    reviews: Math.floor(Math.random() * 100),
    seller_id: "mock-seller-1",
  }));
};

const ArtsAndDecors = () => {
  // Combine Arts and Decors data
  const arts = generateProducts("Art Piece", 15);
  const decors = generateProducts("Decoration", 15);
  const products = [...arts, ...decors]; // 30 items

  return (
    <CategoryPageLayout
      title="Arts & Decors"
      description="Masterpieces and traditional ornaments for your space."
      products={products}
    />
  );
};

export default ArtsAndDecors;
