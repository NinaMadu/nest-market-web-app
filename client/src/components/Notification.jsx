import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const Notification = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Automatically hide the notification after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timeout on component unmount
  }, [onClose]);

  if (!isVisible) return null;

  // Define background colors based on the type
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`fixed top-4 right-4 w-80 p-4 rounded-lg shadow-lg text-white ${bgColor} flex items-center justify-between`}
    >
      <p>{message}</p>
      <button
        className="ml-4 text-white"
        onClick={() => {
          setIsVisible(false);
          onClose();
        }}
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Notification;
