import React, { useState } from "react";
import { ArrowLeft, ChevronDown, Menu, X } from "lucide-react";
import TeacherAnalyticsStatsCards from "./Stats/TeacherAnalyticsStatsCards";
import TopPerformingCourses from "./Chart and Enrollments/TopPerformingCourses";
import RecentEnrollments from "./Chart and Enrollments/RecentEnrollments";
import TeacherTransactionHistory from "./Chart and Enrollments/TeacherTransactionHistory";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useTeacherAnalytics from "../../../hooks/useTeacherAnalytics";

const TeacherAnalyticsDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const [selectedPeriod, setSelectedPeriod] = useState("This month");
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const periods = ["This month", "This year", "Until now"];
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "enrollments", label: "Enrollments" },
    { id: "history", label: "Transactions" },
  ];

  const { stats, courseStats, topCourses, recentEnrollments, loading, error } =
    useTeacherAnalytics(selectedPeriod, teacherId);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() =>
              navigate(
                "/teacher/manageclasses/" + (teacherId || user.teacher_id),
              )
            }
            className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-colors group">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </button>

          {/* Title & Period Selector */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mb-0.5 sm:mb-1">
                DASHBOARD
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Teacher Analytics
              </h1>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:inline">
                PERIOD
              </span>
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none px-3 sm:px-4 py-2 pr-8 sm:pr-10 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors">
                  {periods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Desktop */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 lg:px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Tabs - Mobile */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-100 rounded-lg">
              <span className="font-medium text-gray-900">
                {tabs.find((t) => t.id === activeTab)?.label}
              </span>
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
            {isMobileMenuOpen && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center">
                <p className="text-red-600 font-medium text-sm sm:text-base">
                  Error loading analytics
                </p>
                <p className="text-xs sm:text-sm text-red-500 mt-1">{error}</p>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                    Performance Overview
                  </h2>
                  <TeacherAnalyticsStatsCards
                    selectedPeriod={selectedPeriod}
                    totalRevenue={stats.total_revenue.toLocaleString()}
                    totalStudents={stats.total_students.toLocaleString()}
                    totalCourses={stats.total_courses.toLocaleString()}
                    courseStats={courseStats}
                  />
                </div>

                {/* Chart */}
                <div className="mt-6 sm:mt-8 lg:mt-10">
                  <TopPerformingCourses
                    selectedPeriod={selectedPeriod}
                    topCourses={topCourses}
                    loading={loading}
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Active Enrollments Tab */}
        {activeTab === "enrollments" && (
          <div className="mt-0 sm:mt-2">
            <RecentEnrollments
              selectedPeriod={selectedPeriod}
              enrollments={recentEnrollments.filter(
                (e) => !["Refunded"].includes(e.status),
              )}
              loading={loading}
            />
          </div>
        )}

        {/* Transaction History Tab */}
        {activeTab === "history" && (
          <div className="mt-0 sm:mt-2">
            <TeacherTransactionHistory
              selectedPeriod={selectedPeriod}
              enrollments={recentEnrollments.filter((e) => e.status !== "free")}
              loading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherAnalyticsDashboard;
