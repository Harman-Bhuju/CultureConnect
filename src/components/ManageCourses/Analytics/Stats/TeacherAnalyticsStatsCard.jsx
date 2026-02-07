import React from "react";

const TeacherAnalyticsStatsCard = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  label,
  value,
}) => (
  <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
      <div
        className={`${iconBgColor} p-2 sm:p-2.5 lg:p-3 rounded-lg flex-shrink-0`}>
        <Icon className={`${iconColor} w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-gray-500 text-[10px] sm:text-xs font-medium truncate uppercase tracking-wide">
          {label}
        </p>
        <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 truncate">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default TeacherAnalyticsStatsCard;
