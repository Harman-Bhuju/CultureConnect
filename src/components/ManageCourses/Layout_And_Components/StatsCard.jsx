import React from "react";

const StatsCard = ({ icon: Icon, iconBgColor, iconColor, label, value }) => (
  <div className="bg-white rounded-xl sm:rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center gap-3 sm:gap-4">
      <div
        className={`${iconBgColor} p-2.5 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0`}>
        <Icon className={`${iconColor} w-5 h-5 sm:w-6 sm:h-6`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-gray-500 text-xs sm:text-sm font-medium truncate">
          {label}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default StatsCard;
