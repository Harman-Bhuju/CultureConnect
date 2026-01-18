import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CulturalStorySection = () => {
  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f0e6d6] -skew-x-12 transform translate-x-20 hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content */}
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}>
              <span className="text-gold font-bold tracking-widest uppercase text-sm mb-2 block">
                Our Mission
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal leading-tight mb-6">
                Preserving Heritage, <br />
                <span className="text-heritage-red">Empowering Artisans</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Culture Connect is more than a marketplace; it's a movement to
                revitalize fading traditions. We bridge the gap between rural
                master craftsmen and global connoisseurs, ensuring that every
                purchase directly supports the artist and the continuation of
                their legacy.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-3xl font-bold text-royal-blue mb-1">
                  2000+
                </h4>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Artisans Supported
                </p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-royal-blue mb-1">
                  100%
                </h4>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Authentic Handcrafted
                </p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-royal-blue mb-1">50+</h4>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Heritage Art Forms
                </p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-royal-blue mb-1">
                  Global
                </h4>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Community Reach
                </p>
              </div>
            </div>

            <Link to="/about">
              <button className="mt-4 border-b-2 border-charcoal pb-1 text-charcoal font-bold hover:text-heritage-red hover:border-heritage-red transition-colors">
                Read Our Full Story
              </button>
            </Link>
          </div>

          {/* Image Grid */}
          <div className="lg:w-1/2 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.img
                src="/Home-Images/about/artisan-story.jpg"
                alt="Artisan at work"
                className="rounded-2xl shadow-xl w-full h-64 object-cover transform translate-y-12"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 48 }}
                transition={{ duration: 0.8 }}
              />
              <motion.img
                src="/Home-Images/about/workshop.png"
                alt="Traditional Art"
                className="rounded-2xl shadow-xl w-full h-64 object-cover"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gold/20 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalStorySection;
