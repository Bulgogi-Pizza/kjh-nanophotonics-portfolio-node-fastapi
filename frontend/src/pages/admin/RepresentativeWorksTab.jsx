// admin/RepresentativeWorksTab.jsx
import React, {useState} from 'react';
import RepresentativeWorkForm from './RepresentativeWorkForm.jsx';

function RepresentativeWorksTab({works, onUpdate}) {
  const [showForm, setShowForm] = useState(false);
  const [editingWork, setEditingWork] = useState(null);

  const handleEdit = (work) => {
    setEditingWork(work);
    setShowForm(true);
  };

  const handleDelete = async (workId) => {
    if (window.confirm('Are you sure you want to delete this work?')) {
      try {
        const response = await fetch(`/api/representative-works/${workId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          onUpdate();
        }
      } catch (error) {
        console.error('Error deleting work:', error);
      }
    }
  };

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Representative Works
          </h2>
          <button
              onClick={() => {
                setEditingWork(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Work
          </button>
        </div>

        {/* Works 목록 */}
        <div className="grid gap-6">
          {works.map((work) => (
              <div key={work.id}
                   className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {work.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {work.description}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                      {work.citation}
                    </p>
                    <div
                        className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Order: {work.order_index}</span>
                      <span className={work.is_active ? 'text-green-600'
                          : 'text-red-600'}>
                        {work.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                        onClick={() => handleEdit(work)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                        onClick={() => handleDelete(work.id)}
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
            <RepresentativeWorkForm
                work={editingWork}
                onClose={() => {
                  setShowForm(false);
                  setEditingWork(null);
                }}
                onSave={() => {
                  setShowForm(false);
                  setEditingWork(null);
                  onUpdate();
                }}
            />
        )}
      </div>
  );
}

export default RepresentativeWorksTab;
