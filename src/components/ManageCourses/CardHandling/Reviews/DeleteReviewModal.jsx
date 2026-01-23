import React from "react";
import { createPortal } from "react-dom";
import { X, Trash2, AlertCircle } from "lucide-react";

const DeleteReviewModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Review</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              Are you sure you want to delete your review? This will also delete
              any teacher replies to this review. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition"
            disabled={isDeleting}>
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-100"
            disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DeleteReviewModal;
