import React, {useEffect, useState} from 'react';

// 논문 수정을 위한 폼 컴포넌트
const PublicationForm = ({publication, onSave, onCancel}) => {
  const [formData, setFormData] = useState(publication);

  useEffect(() => {
    setFormData(publication);
  }, [publication]);

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // 폼 필드를 렌더링하는 헬퍼 함수
  const renderInput = (name, label, type = 'text', props = {}) => (
      <div>
        <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            {...props}
        />
      </div>
  );

  const renderCheckbox = (name, label) => (
      <div className="flex items-center">
        <input
            type="checkbox"
            name={name}
            checked={!!formData[name]}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{label}</label>
      </div>
  );

  const renderSelect = (name, label, options) => (
      <div>
        <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <select
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
        >
          {options.map(opt => <option key={opt.value}
                                      value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
  );

  return (
      <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {formData.id ? 'Edit Publication' : 'Add New Publication'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderInput('number', 'Number', 'number', {required: true})}
              {renderInput('year', 'Year', 'text', {required: true})}
              {renderInput('month', 'Month')}
            </div>
            {renderInput('title', 'Title', 'text', {required: true})}
            {renderInput('authors', 'Authors', 'text', {required: true})}
            {renderInput('journal', 'Journal', 'text', {required: true})}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('volume', 'Volume')}
              {renderInput('pages', 'Pages')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('doi', 'DOI')}
              {renderInput('arxiv', 'ArXiv')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput('impact_factor', 'Impact Factor', 'number',
                  {step: '0.01'})}
              {renderInput('featured_info',
                  'Featured Info (e.g., Cover article)')}
            </div>

            <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t dark:border-gray-700">
              {renderSelect('status', 'Status', [
                {value: 'published', label: 'Published'},
                {value: 'under-submission', label: 'Under Submission'},
                {value: 'in-press', label: 'In Press'},
                {value: 'in-review', label: 'In Review'},
              ])}
              {renderSelect('contribution_type', 'Contribution Type', [
                {value: 'co-author', label: 'Co-author'},
                {value: 'first-author', label: 'First-author'},
                {value: 'corresponding', label: 'Corresponding'},
              ])}
              {renderCheckbox('is_first_author', 'First Author')}
              {renderCheckbox('is_corresponding_author',
                  'Corresponding Author')}
              {renderCheckbox('is_equal_contribution', 'Equal Contribution')}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button type="button" onClick={onCancel}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                Cancel
              </button>
              <button type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

// 논문 목록을 보여주는 메인 컴포넌트
const PublicationsTab = () => {
  const [publications, setPublications] = useState([]);
  const [editingPublication, setEditingPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_ENDPOINT = '/api/publications/';

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINT, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error('Failed to fetch publications');
      }
      const data = await res.json();
      // number를 기준으로 내림차순 정렬
      setPublications(data.sort((a, b) => b.number - a.number));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleSave = async (publicationData) => {
    const method = publicationData.id ? 'PUT' : 'POST';
    const url = publicationData.id ? `${API_ENDPOINT}${publicationData.id}`
        : API_ENDPOINT;

    try {
      const response = await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(publicationData),
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save publication');
      }
      setEditingPublication(null);
      await fetchPublications(); // 목록 새로고침
    } catch (err) {
      console.error('Save error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      try {
        const response = await fetch(`${API_ENDPOINT}${id}`,
            {
              method: 'DELETE',
              credentials: "include",
            });
        if (!response.ok) {
          throw new Error('Failed to delete publication');
        }
        await fetchPublications(); // 목록 새로고침
      } catch (err) {
        console.error('Delete error:', err);
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleAddNew = () => {
    setEditingPublication({
      number: (publications[0]?.number || 0) + 1,
      title: '',
      authors: '',
      journal: '',
      year: new Date().getFullYear().toString(),
      status: 'published',
      contribution_type: 'co-author',
      is_first_author: false,
      is_corresponding_author: false,
      is_equal_contribution: false,
    });
  };

  if (loading) {
    return <div>Loading publications...</div>;
  }
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage
            Publications</h2>
          <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Add New Publication
          </button>
        </div>

        {editingPublication && (
            <PublicationForm
                publication={editingPublication}
                onSave={handleSave}
                onCancel={() => setEditingPublication(null)}
            />
        )}

        <div
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-x-auto">
          <table
              className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">#</th>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Journal</th>
              <th scope="col" className="px-6 py-3">Year</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
            </thead>
            <tbody>
            {publications.map(pub => (
                <tr key={pub.id}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">{pub.number}</td>
                  <th scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white">{pub.title}</th>
                  <td className="px-6 py-4">{pub.journal}</td>
                  <td className="px-6 py-4">{pub.year}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => setEditingPublication(pub)}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit
                    </button>
                    <button onClick={() => handleDelete(pub.id)}
                            className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default PublicationsTab;