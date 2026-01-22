import React from "react";
import { X, Save, Edit, AlertCircle } from "lucide-react";

const EditCourseConfirmationModal = ({
  course,
  onClose,
  onConfirm,
  actionType = "saveAsDraft" // 'saveAsDraft' or 'editCourse'
}) => {
  const courseTitle = course?.title || course?.courseTitle || "this course";
  const isSaveAsDraft = actionType === "saveAsDraft";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSaveAsDraft ? "bg-orange-100" : "bg-indigo-100"
              }`}>
              {isSaveAsDraft ? (
                <Save className="w-5 h-5 text-orange-600" />
              ) : (
                <Edit className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {isSaveAsDraft ? "Save as Draft" : "Edit Course"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700 mb-2">
                Do you want to make changes to{" "}
                <span className="font-semibold">"{courseTitle}"</span>?
              </p>
              {isSaveAsDraft ? (
                <p className="text-sm text-gray-600">
                  This will save your changes and change the course status to draft. The course will no longer be visible to students.
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  This will update the course and keep it published. Changes will be visible to students immediately.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            No
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors font-medium flex items-center justify-center gap-2 ${isSaveAsDraft
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}>
            {isSaveAsDraft ? (
              <>
                <Save className="w-4 h-4" />
                Yes, Save as Draft
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Yes, Edit Course
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourseConfirmationModal;
