import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Notification = ({ type, message, onClose }) => {
  let bgColor, textColor;
  
  switch (type) {
    case 'error':
      bgColor = 'bg-red-200';
      textColor = 'text-red-800';
      break;
    case 'success':
      bgColor = 'bg-green-200';
      textColor = 'text-green-800';
      break;
    case 'info':
      bgColor = 'bg-yellow-200';
      textColor = 'text-yellow-800';
      break;
    default:
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-800';
  }

  return (
    <div className={`${bgColor} p-4 rounded-lg mb-4 text-center relative`}>
      <p className={`${textColor}`}>
        {message}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes className="text-xl" />
        </button>
      </p>
    </div>
  );
};

export default Notification;
