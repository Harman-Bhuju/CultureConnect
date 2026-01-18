import React from "react";
import CategoryPageLayout from "./components/CategoryPageLayout";

// Placeholder data generator
const generateProducts = (category, count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${category}-${i}`,
    sellerId: "mock-seller-1",
    productName: `${category} Item ${i + 1}`,
    price: 1500 + i * 500, // Price varies for filtering
    image: null,
    rating: 3 + Math.random() * 2, // Random rating 3.0 - 5.0
    reviews: Math.floor(Math.random() * 50),
    seller_id: "mock-seller-1",
  }));
};

const TraditionalClothing = () => {
  // Generate more products to test pagination (e.g. 24 items => 2 pages)
  const products = generateProducts("Traditional", 36);

  return (
    <CategoryPageLayout
      title="Traditional Clothing"
      description="Authentic cultural attire from local artisans."
      products={products}
    />
  );
};

export default TraditionalClothing;
