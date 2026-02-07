import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Package,
  Clock,
  Hash,
  BookOpen,
  CreditCard,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

const TeacherTransactionHistory = ({
  selectedPeriod,
  enrollments = [],
  loading,
}) => {
  const [sortOrder, setSortOrder] = useState("newest");

  const completedEnrollments = useMemo(() => {
    let items = [...enrollments];
    items.sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.updatedAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    return items;
  }, [enrollments, sortOrder]);

  const formatDateLabel = (dateString, selectedPeriod) => {
    const date = new Date(dateString);
    if (selectedPeriod === "This month") {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
  };

  const groupedEnrollments = useMemo(() => {
    const groups = {};
    completedEnrollments.forEach((item) => {
      const date = new Date(item.date || item.createdAt);
      const dateKey = formatDateLabel(date, selectedPeriod);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });
    return groups;
  }, [completedEnrollments, selectedPeriod]);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "This month":
        return "this month";
      case "This year":
        return "this year";
      default:
        return "all time";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex justify-center items-center py-10 sm:py-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-lg shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              Transaction History
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Completed enrollments - {getPeriodLabel()}
            </p>
          </div>

          <div className="relative self-start sm:self-auto">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer transition-colors">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {completedEnrollments.length > 0 && (
        <div className="mb-4 sm:mb-6 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-gray-50 rounded-xl p-2.5 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {completedEnrollments.length}
                </p>
              </div>
              <p className="text-[9px] sm:text-xs text-gray-500">Completed</p>
            </div>
            <div className="bg-green-50 rounded-xl p-2.5 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {completedEnrollments.length}
                </p>
              </div>
              <p className="text-[9px] sm:text-xs text-gray-500">Students</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-2.5 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
              </div>
              <p className="text-sm sm:text-xl font-bold text-gray-900 truncate">
                Rs.{" "}
                {completedEnrollments
                  .reduce((sum, item) => sum + item.amount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-[9px] sm:text-xs text-gray-500">Revenue</p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="space-y-4 sm:space-y-6">
        {Object.keys(groupedEnrollments).length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-sm sm:text-base">
              No completed transactions yet
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {selectedPeriod === "This month"
                ? "No completed transactions this month"
                : selectedPeriod === "This year"
                  ? "No completed transactions this year"
                  : "Completed transactions will appear here"}
            </p>
          </div>
        ) : (
          Object.entries(groupedEnrollments).map(([date, items]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center mb-2 sm:mb-4">
                <div className="text-xs sm:text-sm font-semibold text-gray-900 bg-green-50 border border-green-200 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  {date}
                </div>
                <div className="flex-1 h-px bg-gray-200 ml-3 sm:ml-4"></div>
                <div className="text-[10px] sm:text-xs text-gray-500 ml-3 sm:ml-4">
                  {items.length} transaction{items.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Transaction Cards */}
              <div className="space-y-2 sm:space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                          <div className="min-w-0">
                            <h3 className="text-gray-900 font-semibold text-sm sm:text-base lg:text-lg truncate">
                              {item.course_title}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-mono mt-0.5">
                              ID: {item.id}
                            </p>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6 gap-y-2 sm:gap-y-3 mt-2 sm:mt-3">
                          <div>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                              Student
                            </p>
                            <p className="text-xs sm:text-sm text-gray-900 truncate">
                              {item.student_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Completed
                            </p>
                            <p className="text-xs sm:text-sm text-gray-900">
                              {item.date}
                            </p>
                          </div>
                          {item.transaction_uuid && (
                            <div className="col-span-2">
                              <p className="text-[10px] sm:text-xs text-gray-500 font-medium flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                Transaction UUID
                              </p>
                              <p className="text-xs sm:text-sm text-gray-900 font-mono truncate">
                                {item.transaction_uuid}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Price & Status */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div>
                              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                                Amount
                              </p>
                              <p className="text-base sm:text-lg font-bold text-gray-900">
                                Rs. {item.amount?.toLocaleString()}
                              </p>
                            </div>
                            <div className="hidden sm:block">
                              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                                Payment
                              </p>
                              <p className="text-xs sm:text-sm text-gray-900 flex items-center gap-1">
                                <CreditCard className="w-3 h-3 text-green-600" />
                                eSewa
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-0.5 sm:mr-1" />
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherTransactionHistory;
