import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const heroSlides = [
  {
    image: "/Home-Images/Hero_images/home-hero.png",
    title: "Discover Your Cultural Heritage",
    subtitle:
      "Connect with authentic traditions through our curated marketplace.",
    color: "text-gold",
  },
  {
    image: "/Home-Images/Hero_images/clothing-hero.png",
    title: "Wear Your Tradition With Pride",
    subtitle: "Handcrafted ethnic wear that tells a story of generations.",
    color: "text-heritage-red",
  },
  {
    image: "/Home-Images/Hero_images/arts-hero.png",
    title: "Masterpieces of Craftsmanship",
    subtitle: "Adorn your space with timeless art from master artisans.",
    color: "text-royal-blue",
  },
  {
    image: "/Home-Images/Hero_images/instruments-hero.png",
    title: "The Rhythm of Culture",
    subtitle: "Authentic musical instruments handcrafted for perfect sound.",
    color: "text-amber-600",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-stone-900">
      {/* Background Slideshow */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0">
            {/* Left Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Content - Layout 1: Left Aligned, Cinzel Font */}
      <div className="relative z-20 h-full flex flex-col justify-center items-start px-8 md:px-16 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 max-w-3xl text-left">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              className={`h-1 ${heroSlides[currentSlide].color.replace(
                "text-",
                "bg-"
              )} mb-4`}
            />

            <span className="inline-block text-base md:text-lg text-gray-300 font-light tracking-[0.2em] uppercase border-l-2 border-white pl-4">
              Where Tradition Meets Modern
            </span>

            <div className="overflow-hidden">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-[Cinzel] font-bold text-white tracking-wide leading-tight drop-shadow-xl">
                {heroSlides[currentSlide].title
                  .split(" ")
                  .slice(0, 2)
                  .join(" ")}{" "}
                <br />
                <span className={`${heroSlides[currentSlide].color} italic`}>
                  {heroSlides[currentSlide].title.split(" ").slice(2).join(" ")}
                </span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed max-w-lg border-l-[1px] border-white/20 pl-6">
              {heroSlides[currentSlide].subtitle}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 pt-8">
              <Link to="/marketplace">
                <button className="px-8 py-3 bg-white text-black font-[Cinzel] font-bold text-base hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase tracking-wider">
                  Explore
                </button>
              </Link>

              <Link to="/teachers">
                <button className="px-8 py-3 border border-white text-white font-[Cinzel] font-bold text-base hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider backdrop-blur-sm">
                  Find a Guru
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators - Vertical Right */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-6">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 border border-white ${
              index === currentSlide
                ? "bg-white scale-150"
                : "bg-transparent hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 right-10 text-white/50 flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-[0.3em] rotate-90 origin-right translate-x-4 mb-8 block">
          Scroll Down
        </span>
        <div className="w-[1px] h-20 bg-white/20 overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-1/2 bg-white"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
