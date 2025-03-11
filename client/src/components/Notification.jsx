import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const Notification = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Automatically fade out the notification after 4.5 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsVisible(false); // After fading out, hide the notification
        onClose();
      }, 1000); // Wait for the fade-out duration to finish
    }, 4500); // Start fading out after 4.5 seconds

    return () => clearTimeout(timer); // Cleanup timeout on component unmount
  }, [onClose]);

  if (!isVisible) return null;

  // Define background colors based on the type
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`fixed top-20 right-4 w-80 p-4 rounded-lg shadow-lg text-white ${bgColor} flex items-center justify-between transition-all duration-1000 ${fadeOut ? 'opacity-0 transform scale-95' : 'opacity-75'}`}
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
