import React from "react";
import { motion } from "framer-motion";
import { testimonials } from "../../data/homeData";
import { Quote } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-stone-900 text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-heritage-red/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-royal-blue/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold tracking-widest uppercase text-sm">
            Community Voices
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-2">
            Stories from Our Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/10 rotate-180" />

              <p className="text-lg text-gray-300 italic mb-8 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold"
                />
                <div>
                  <h4 className="font-bold font-heading text-lg">
                    {testimonial.name}
                  </h4>
                  <span className="text-xs text-stone-400 uppercase tracking-wider">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
