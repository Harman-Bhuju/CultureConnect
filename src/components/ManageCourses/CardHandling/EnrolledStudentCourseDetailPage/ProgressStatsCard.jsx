import React from "react";
import { BarChart3, TrendingUp, Target, Award } from "lucide-react";

export default function ProgressStatsCard({
  progress,
  completedVideos,
  totalVideos,
}) {
  const remaining = totalVideos - completedVideos;
  const isComplete = progress === 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Your Progress
        </h3>
        {isComplete && (
          <Award className="w-5 h-5 text-amber-500" />
        )}
      </div>

      {/* Progress Circle */}
      <div className="relative">
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100">
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {progress}%
          </div>
          <p className="text-sm font-semibold text-gray-600">Complete</p>
          {isComplete && (
            <p className="text-xs text-green-600 font-semibold mt-2">
              🎉 Course Completed!
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Completed
            </span>
          </div>
          <span className="font-bold text-gray-900">{completedVideos}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Remaining
            </span>
          </div>
          <span className="font-bold text-gray-900">{remaining}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Total Lessons
            </span>
          </div>
          <span className="font-bold text-indigo-600">{totalVideos}</span>
        </div>
      </div>

      {/* Motivational Message */}
      {!isComplete && (
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            {progress === 0
              ? "Start your journey! Complete your first lesson."
              : progress < 50
              ? "Great start! Keep up the momentum."
              : progress < 90
              ? "You're doing amazing! Almost there."
              : "Final push! You're so close to finishing!"}
          </p>
        </div>
      )}
    </div>
  );
}