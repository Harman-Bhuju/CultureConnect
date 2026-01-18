import React from "react";
import { Link } from "react-router-dom";
import { teachers } from "../../data/homeData";
import { Star, Users, MapPin, ArrowRight } from "lucide-react";

const TeacherCard = ({ teacher }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
          <img
            src={teacher.imagePath}
            alt={teacher.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 text-gold fill-gold" /> {teacher.rating}
          </div>
        </div>

        {/* Content */}
        <div className="md:w-3/5 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-heritage-red text-sm font-bold uppercase tracking-wider">
                {teacher.specialty.split("&")[0]}
              </span>
              <span className="text-gray-400 text-xs">Since 2010</span>
            </div>

            <h3 className="text-2xl font-heading font-bold mb-3 group-hover:text-royal-blue transition-colors">
              {teacher.name}
            </h3>
            <p className="text-gray-600 mb-6 line-clamp-2">{teacher.bio}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{teacher.students} Students</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>Online & Offline</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
            <div>
              <span className="block text-xs text-gray-400 uppercase">
                Hourly Rate
              </span>
              <span className="text-lg font-bold text-gray-900">
                {teacher.hourlyRate}
              </span>
            </div>
            <Link to={`/teacher/${teacher.id}`}>
              <button className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-heritage-red transition-colors">
                View Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-royal-blue font-semibold tracking-widest uppercase text-sm">
              Learn from Masters
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mt-2 mb-4">
              Meet Our Gurus
            </h2>
            <p className="text-gray-600 text-lg">
              Connect with experienced mentors who have dedicated their lives to
              preserving and teaching traditional arts.
            </p>
          </div>
          <Link
            to="/teachers"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-medium transition-colors flex items-center gap-2">
            Find Your Teacher <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
          {/* CTA Card */}
          <div className="bg-gradient-to-br from-royal-blue to-blue-900 rounded-2xl p-12 text-white flex flex-col justify-center items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 max-w-md">
              <h3 className="text-3xl font-heading font-bold mb-4">
                Are you a Master Artist?
              </h3>
              <p className="text-blue-100 mb-8">
                Join our community of verified teachers and share your knowledge
                with students globally.
              </p>
              <button className="bg-white text-royal-blue px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
                Apply to Teach
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherSection;
