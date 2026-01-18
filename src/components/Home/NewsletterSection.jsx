import React from "react";
import { Send } from "lucide-react";

const NewsletterSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-heritage-red/5 to-royal-blue/5 rounded-3xl p-12 border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900">
            Join the Culture Connect Community
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Subscribe to receive updates on new collections, upcoming workshops,
            and stories from our artisans.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-heritage-red/50 text-gray-900 placeholder:text-gray-400"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-heritage-red hover:bg-red-700 text-white rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl">
              Subscribe <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
