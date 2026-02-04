import React from 'react';

const OBRLoading: React.FC = () => {
  return (
    <div className="p-4">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Loading...</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Please wait while Owlbear Rodeo loads.
        </p>
      </div>
    </div>
  );
};

export default OBRLoading;