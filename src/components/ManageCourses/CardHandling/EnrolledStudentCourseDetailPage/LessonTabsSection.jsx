import React from "react";
import { Info, FileText, MessageSquare, Download } from "lucide-react";

export default function LessonTabsSection({ activeTab, setActiveTab, activeVideo }) {
  const tabs = [
    { id: "description", icon: Info, label: "Overview" },
    { id: "resources", icon: FileText, label: "Resources" },
    { id: "discussions", icon: MessageSquare, label: "Discussion" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tabs Header */}
      <div className="border-b border-gray-100">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "description" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                About This Lesson
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {activeVideo?.description ||
                  "This lesson will help you understand the key concepts covered in this section of the course. Make sure to take notes and practice along with the video."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">
                No Resources Available
              </h4>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Downloadable resources for this lesson haven't been uploaded yet. Check
                back later!
              </p>
            </div>
          </div>
        )}

        {activeTab === "discussions" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center border border-blue-100">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Join the Discussion</h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto mb-4">
                Connect with fellow students, ask questions, and share your learning
                experience.
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm">
                Start a Discussion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}