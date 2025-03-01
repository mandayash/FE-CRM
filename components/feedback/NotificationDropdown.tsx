"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { newFeedbackIds } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-1.5 sm:p-2 hover:bg-[#CF0000]/10 rounded-full transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        {newFeedbackIds.length > 0 && (
          <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 rounded-full" />
        )}
      </button>
    </div>
  );
};

export default NotificationDropdown;
