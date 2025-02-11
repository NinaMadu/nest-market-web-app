import { useState } from "react";

const ConfirmationMessage = ({ message, onConfirm, onCancel, confirmColor = "bg-blue-600" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Blur Effect */}
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
        <h2 className="text-lg font-semibold text-gray-800">{message}</h2>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg ${confirmColor} hover:brightness-90`}
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationMessage;
