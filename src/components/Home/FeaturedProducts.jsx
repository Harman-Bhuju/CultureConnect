import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { products } from "../../data/homeData";
import { ShoppingBag, Eye, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="p-2 h-full">
      <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={product.imagePath}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-black">
            {product.category.replace("-", " ")}
          </span>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
            {[ShoppingBag, Eye, Heart].map((Icon, idx) => (
              <button
                key={idx}
                className={`bg-white p-3 rounded-full hover:bg-heritage-red hover:text-white transition-all duration-300 shadow-lg transform translate-y-4 group-hover:translate-y-0 delay-${
                  idx * 75
                }`}>
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-heritage-red line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium line-clamp-1">
              by {product.artisan}
            </p>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <span className="font-bold text-lg text-gray-900">
              {product.price}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 uppercase tracking-widest">
            <span className="line-clamp-1">{product.region}</span>
            <span
              className={`font-bold whitespace-nowrap ${
                product.inStock ? "text-green-600" : "text-red-600"
              }`}>
              {product.inStock ? "In Stock" : "Sold Out"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  return (
    <section className="py-24 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-heading font-bold mb-4">
            Masterpiece Collection
          </h2>
          <p className="text-gray-600 max-w-xl">
            Exclusive handcrafted items that tell a story of centuries-old
            traditions.
          </p>
        </div>
        <Link
          to="/marketplace"
          className="hidden md:flex items-center gap-2 text-heritage-red font-medium hover:text-red-700 transition-colors">
          View All Products <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={23}
          slidesPerView={1}
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="w-full"
          style={{
            paddingBottom: "12px",
            "--swiper-pagination-bottom": "0px",
            "--swiper-theme-color": "#D4145A",
            "--swiper-navigation-color": "#D4145A",
            "--swiper-navigation-size": "24px",
          }}>
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="md:hidden px-6 mt-6">
        <Link
          to="/marketplace"
          className="flex w-full items-center justify-center gap-2 py-3 border border-gray-300 rounded-full font-medium">
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
