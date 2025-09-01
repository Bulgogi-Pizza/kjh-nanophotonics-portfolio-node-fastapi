// admin/ResearchAreaForm.jsx
import React, {useState} from 'react';

function ResearchAreaForm({area, onClose, onSave}) {
  const [formData, setFormData] = useState({
    title: area?.title || '',
    slug: area?.slug || '',
    description: area?.description || '',
    icon_path: area?.icon_path || '',
    order_index: area?.order_index || 0,
    is_active: area?.is_active ?? true
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = area
          ? `/api/research-areas/${area.id}`
          : '/api/research-areas/';

      const method = area ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving research area:', error);
    }
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', file);

      const response = await fetch('/api/research-areas/upload-icon', {
        method: 'POST',
        body: formDataForUpload
      });

      if (!response.ok) {
        throw new Error(
            `Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        icon_path: result.icon_path
      }));
    } catch (error) {
      console.error('Error uploading icon:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
      <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {area ? 'Edit Research Area' : 'Add New Research Area'}
            </h3>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(
                      {...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug *
              </label>
              <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(
                      {...formData, slug: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="design, manufacturing, applications"
              />
            </div>

            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(
                      {...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icon Upload
              </label>
              <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {uploading && <p
                  className="text-sm text-blue-600 mt-1">Uploading...</p>}
              {formData.icon_path && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600 mb-2">✓ Icon
                      uploaded</p>
                    <img
                        src={formData.icon_path}
                        alt="Icon preview"
                        className="w-12 h-12 object-cover rounded border"
                    />
                  </div>
              )}
            </div>

            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order Index
              </label>
              <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData(
                      {...formData, order_index: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center">
              <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(
                      {...formData, is_active: e.target.checked})}
                  className="mr-2"
              />
              <label htmlFor="is_active"
                     className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {area ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default ResearchAreaForm;
