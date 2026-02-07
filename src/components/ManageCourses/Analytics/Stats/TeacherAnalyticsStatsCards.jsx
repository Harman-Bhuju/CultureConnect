import React from "react";
import {
  BookOpen,
  Users,
  DollarSign,
  Box,
  FileText,
  Trash2,
  Grid,
} from "lucide-react";
import TeacherAnalyticsStatsCard from "./TeacherAnalyticsStatsCard";

const TeacherAnalyticsStatsCards = ({
  selectedPeriod,
  totalRevenue,
  totalStudents,
  totalCourses,
  courseStats,
}) => {
  const getDynamicLabel = (baseLabel) => {
    if (selectedPeriod === "This month") return `${baseLabel} THIS MONTH`;
    if (selectedPeriod === "This year") return `${baseLabel} THIS YEAR`;
    return `TOTAL ${baseLabel}`;
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Performance Stats - Main metrics */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <TeacherAnalyticsStatsCard
          icon={DollarSign}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          label={getDynamicLabel("REVENUE")}
          value={`Rs. ${totalRevenue}`}
        />

        <TeacherAnalyticsStatsCard
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          label={getDynamicLabel("STUDENTS")}
          value={totalStudents}
        />

        <TeacherAnalyticsStatsCard
          icon={BookOpen}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          label="TOTAL COURSES"
          value={totalCourses}
        />
      </div>

      {/* Course Stats - Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <TeacherAnalyticsStatsCard
          icon={Grid}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          label="ALL COURSES"
          value={totalCourses}
        />

        <TeacherAnalyticsStatsCard
          icon={Box}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
          label="ACTIVE"
          value={courseStats.active_courses}
        />

        <TeacherAnalyticsStatsCard
          icon={FileText}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          label="DRAFT"
          value={courseStats.draft_courses}
        />

        <TeacherAnalyticsStatsCard
          icon={Trash2}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          label="ARCHIVED"
          value={courseStats.deleted_courses || 0}
        />
      </div>
    </div>
  );
};

export default TeacherAnalyticsStatsCards;
