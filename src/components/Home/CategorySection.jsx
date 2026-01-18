import React from "react";
import { motion } from "framer-motion";
import { categories } from "../../data/homeData";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative overflow-hidden rounded-2xl h-[400px] cursor-pointer">
      <div className="absolute inset-0 bg-gray-900" />

      {/* Background Image */}
      <img
        src={category.imagePath}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-80 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-90"
        style={{ background: category.gradient }}
      />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
        <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
          <div className="text-4xl mb-4">{category.icon}</div>
          <h3 className="text-2xl font-bold font-heading mb-2">
            {category.name}
          </h3>
          <p className="text-white/80 mb-6 font-light line-clamp-2">
            {category.description}
          </p>

          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore Collection <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CategorySection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-heritage-red font-semibold tracking-widest uppercase text-sm">
            Curated Collections
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-2 mb-6">
            Explore by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dive deep into specific areas of cultural heritage, from hand-woven
            textiles to classical instruments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link to={`/marketplace?category=${category.id}`} key={category.id}>
              <CategoryCard category={category} index={index} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
