"use client";
import { useState, useEffect } from "react";

const LoadingSpinner = ({ isLoading = true, children }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
            </div>
            
            {/* Inner Ring */}
            <div className="absolute top-2 left-2 w-12 h-12 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-purple-500 dark:border-t-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            
            {/* Center Dot */}
            <div className="absolute top-6 left-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Loading AIspire
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Preparing your career journey...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

export default LoadingSpinner; 