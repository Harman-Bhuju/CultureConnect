import React from "react";
import CategoryPageLayout from "./components/CategoryPageLayout";

const generateProducts = (category, count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${category}-${i}`,
    sellerId: "mock-seller-1",
    productName: `${category} Item ${i + 1}`,
    price: 2500 + i * 750,
    image: null,
    rating: 3.5 + Math.random() * 1.5,
    reviews: Math.floor(Math.random() * 30),
    seller_id: "mock-seller-1",
  }));
};

const Instruments = () => {
  const products = generateProducts("Instrument", 20);

  return (
    <CategoryPageLayout
      title="Musical Instruments"
      description="Handcrafted instruments that carry the rhythm of culture."
      products={products}
    />
  );
};

export default Instruments;
