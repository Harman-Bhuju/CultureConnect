import React from "react";
import { BookOpen, CheckCircle, Play, Clock, Lock } from "lucide-react";

export default function CurriculumSidebar({
  videos,
  activeVideo,
  completedVideos,
  onVideoSelect,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Course Curriculum
          </h3>
          <span className="text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
            {videos.length} Lessons
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
            <span>Curriculum Progress</span>
            <span className="text-blue-600">
              {completedVideos.length}/{videos.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-white rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
              style={{
                width: `${(completedVideos.length / videos.length) * 100}%`,
              }}></div>
          </div>
        </div>
      </div>

      {/* Video List */}
      <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
        <div className="divide-y divide-gray-50">
          {videos.map((video, index) => {
            const isActive = activeVideo?.id === video.id;
            const isCompleted = completedVideos.includes(video.id);

            return (
              <button
                key={video.id}
                onClick={() => {
                  onVideoSelect(video);
                  if (window.innerWidth < 1024) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`w-full text-left p-4 flex items-start gap-3 transition-all hover:bg-gray-50 relative group ${
                  isActive
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : "bg-white"
                }`}>
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                )}

                {/* Status Icon */}
                <div className="relative shrink-0 mt-0.5">
                  {isCompleted ? (
                    <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-green-200">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  ) : isActive ? (
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-200 animate-pulse">
                      <Play className="w-4 h-4 fill-white" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 border-2 border-gray-200 text-gray-400 rounded-xl flex items-center justify-center group-hover:border-blue-300 group-hover:text-blue-600 transition-all">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p
                      className={`text-sm font-semibold leading-snug line-clamp-2 ${
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                            ? "text-gray-600"
                            : "text-gray-900 group-hover:text-blue-600"
                      }`}>
                      {video.video_title}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={`font-medium flex items-center gap-1 ${
                        isActive ? "text-blue-600" : "text-gray-500"
                      }`}>
                      <Clock className="w-3 h-3" />
                      {video.duration || "0:00"}
                    </span>
                    {isActive && (
                      <span className="text-blue-600 font-bold bg-blue-100 px-2 py-0.5 rounded-full animate-pulse">
                        Playing
                      </span>
                    )}
                    {isCompleted && !isActive && (
                      <span className="text-green-600 font-semibold">
                        ✓ Done
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Summary */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">
            {completedVideos.length} completed
          </span>
          <span className="text-gray-600 font-medium">
            {videos.length - completedVideos.length} remaining
          </span>
        </div>
      </div>
    </div>
  );
}
