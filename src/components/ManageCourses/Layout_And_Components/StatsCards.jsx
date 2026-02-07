import React from "react";
import { BookOpen, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import StatsCard from "./StatsCard";

const StatsCards = ({
  totalCourses,
  activeCourses,
  draftCourses,
  totalRevenue,
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-6">
    <StatsCard
      icon={BookOpen}
      iconBgColor="bg-orange-50"
      iconColor="text-orange-500"
      label="Total Courses"
      value={totalCourses}
    />
    <StatsCard
      icon={TrendingUp}
      iconBgColor="bg-emerald-50"
      iconColor="text-emerald-500"
      label="Active Courses"
      value={activeCourses}
    />
    <StatsCard
      icon={AlertCircle}
      iconBgColor="bg-amber-50"
      iconColor="text-amber-500"
      label="Draft / Review"
      value={draftCourses}
    />
    <StatsCard
      icon={DollarSign}
      iconBgColor="bg-purple-50"
      iconColor="text-purple-500"
      label="Total Revenue"
      value={`Rs.${Number(totalRevenue).toLocaleString()}`}
    />
  </div>
);

export default StatsCards;
