// admin/RepresentativeWorkForm.jsx
import React, {useState} from 'react';

function RepresentativeWorkForm({work, onClose, onSave}) {
  const [formData, setFormData] = useState({
    title: work?.title || '',
    journal: work?.journal || '',
    volume: work?.volume || '',
    pages: work?.pages || '',
    year: work?.year || '',
    image_path: work?.image_path || '',
    order_index: work?.order_index || 0,
    is_active: work?.is_active ?? true,
    is_in_revision: work?.is_in_revision ?? false
  });
  const [uploading, setUploading] = useState(false);

  const isFieldsDisabled = formData.is_in_revision;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = work
          ? `/api/representative-works/${work.id}`
          : '/api/representative-works/';

      const method = work ? 'PUT' : 'POST';

      const submissionData = {
        ...formData,
        pages: formData.is_in_revision ? null : formData.pages,
        year: formData.is_in_revision ? null : formData.year
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving work:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', file);

      const response = await fetch('/api/representative-works/upload-image', {
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
        image_path: result.image_path
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRevisionChange = (e) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      is_in_revision: isChecked,
      pages: isChecked ? '' : prev.pages,
      year: isChecked ? '' : prev.year
    }));
  };

  return (
      <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {work ? 'Edit Work' : 'Add New Work'}
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
                  placeholder="Research paper title"
              />
            </div>

            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Journal *
              </label>
              <input
                  type="text"
                  required
                  value={formData.journal}
                  onChange={(e) => setFormData(
                      {...formData, journal: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nature Materials"
              />
            </div>

            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Volume
              </label>
              <input
                  type="text"
                  value={formData.volume}
                  onChange={(e) => setFormData(
                      {...formData, volume: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="22"
              />
            </div>

            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Publication Status
              </label>
              <div
                  className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                      type="checkbox"
                      id="is_in_revision"
                      checked={formData.is_in_revision}
                      onChange={handleRevisionChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_in_revision"
                         className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Paper is currently in revision
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pages {!isFieldsDisabled && '*'}
                      {isFieldsDisabled && <span
                          className="text-xs text-gray-500 ml-1">(disabled)</span>}
                    </label>
                    <input
                        type="text"
                        required={!isFieldsDisabled}
                        value={isFieldsDisabled ? '' : formData.pages}
                        onChange={(e) => setFormData(
                            {...formData, pages: e.target.value})}
                        disabled={isFieldsDisabled}
                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md ${
                            isFieldsDisabled
                                ? 'bg-gray-100 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                        placeholder={isFieldsDisabled ? '(in revision)'
                            : '474-481'}
                    />
                  </div>

                  <div>
                    <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year {!isFieldsDisabled && '*'}
                      {isFieldsDisabled && <span
                          className="text-xs text-gray-500 ml-1">(disabled)</span>}
                    </label>
                    <input
                        type="text"
                        required={!isFieldsDisabled}
                        value={isFieldsDisabled ? '' : formData.year}
                        onChange={(e) => setFormData(
                            {...formData, year: e.target.value})}
                        disabled={isFieldsDisabled}
                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md ${
                            isFieldsDisabled
                                ? 'bg-gray-100 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                        placeholder={isFieldsDisabled ? '(in revision)'
                            : '2023'}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image Upload *
              </label>
              <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {uploading && <p
                  className="text-sm text-blue-600 mt-1">Uploading...</p>}
              {formData.image_path && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600 mb-2">✓ Image
                      uploaded: {formData.image_path}</p>
                    <img
                        src={formData.image_path}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
              )}
            </div>

            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slide Order
              </label>
              <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData(
                      {...formData, order_index: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0"
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
                {work ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default RepresentativeWorkForm;
