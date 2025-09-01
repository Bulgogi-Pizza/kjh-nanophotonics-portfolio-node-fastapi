// admin/GalleryImagesTab.jsx
import React from 'react';

function GalleryImagesTab({images, onUpdate}) {
  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gallery Images
          </h2>
          <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => alert('Gallery management will be implemented')}
          >
            Add New Image
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow">
          <div className="text-center">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Gallery Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Gallery images management will be implemented here.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Total images: {images.length}
            </p>
          </div>
        </div>
      </div>
  );
}

export default GalleryImagesTab;
