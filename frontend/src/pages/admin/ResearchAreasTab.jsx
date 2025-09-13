// admin/ResearchAreasTab.jsx
import React, {useState} from 'react';
import ResearchAreaForm from './ResearchAreaForm.jsx';

function ResearchAreasTab({areas, onUpdate}) {
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState(null);

  const handleEdit = (area) => {
    setEditingArea(area);
    setShowForm(true);
  };

  const handleDelete = async (areaId) => {
    if (window.confirm('Are you sure you want to delete this research area?')) {
      try {
        const response = await fetch(`/api/research-areas/${areaId}`, {
          method: 'DELETE',
          credentials: "include",
        });
        if (response.ok) {
          onUpdate();
        }
      } catch (error) {
        console.error('Error deleting research area:', error);
      }
    }
  };

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Research Areas
          </h2>
          <button
              onClick={() => {
                setEditingArea(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Area
          </button>
        </div>

        {/* Areas 목록 */}
        <div className="grid gap-6">
          {areas.map((area) => (
              <div key={area.id}
                   className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-start flex-1">
                    {area.icon_path && (
                        <img
                            src={area.icon_path}
                            alt={area.title}
                            className="w-12 h-12 mr-4 rounded"
                        />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {area.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2 break-all">
                        {area.description}
                      </p>
                      <div
                          className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Slug: {area.slug}</span>
                        <span>Order: {area.order_index}</span>
                        <span className={area.is_active ? 'text-green-600'
                            : 'text-red-600'}>
                          {area.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                        onClick={() => handleEdit(area)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                        onClick={() => handleDelete(area.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* 폼 모달 */}
        {showForm && (
            <ResearchAreaForm
                area={editingArea}
                onClose={() => {
                  setShowForm(false);
                  setEditingArea(null);
                }}
                onSave={() => {
                  setShowForm(false);
                  setEditingArea(null);
                  onUpdate();
                }}
            />
        )}
      </div>
  );
}

export default ResearchAreasTab;
