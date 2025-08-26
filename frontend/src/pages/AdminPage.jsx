import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function AdminPage() {
  const [representativeWorks, setRepresentativeWorks] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [researchAreas, setResearchAreas] = useState([]);
  const [activeTab, setActiveTab] = useState('representative-works');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [worksRes, imagesRes] = await Promise.all([
        fetch('/api/representative-works/?active_only=false'),
        fetch('/api/representative-works/gallery/?active_only=false')
      ]);

      const works = await worksRes.json();
      const images = await imagesRes.json();

      setRepresentativeWorks(works);
      setGalleryImages(images);
      setLoading(false);
    } catch (error) {
      console.error('Error loading ', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 py-24">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading admin
                panel...</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-12">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <Link
                to="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Site
            </Link>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="flex space-x-8">
              <button
                  onClick={() => setActiveTab('representative-works')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'representative-works'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Representative Works
              </button>
              <button
                  onClick={() => setActiveTab('gallery')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'gallery'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Gallery Images
              </button>
              <button
                  onClick={() => setActiveTab('research')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'research'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Research Areas
              </button>
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'representative-works' && (
              <RepresentativeWorksTab
                  works={representativeWorks}
                  onUpdate={loadData}
              />
          )}

          {activeTab === 'gallery' && (
              <GalleryImagesTab
                  images={galleryImages}
                  onUpdate={loadData}
              />
          )}

          {activeTab === 'research' && (
              <ResearchAreasTab
                  areas={researchAreas}
                  onUpdate={loadData}
              />
          )}
        </div>
      </div>
  );
}

// Representative Works 관리 탭
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

// Representative Work 폼 컴포넌트
function RepresentativeWorkForm({work, onClose, onSave}) {
  const [formData, setFormData] = useState({
    title: work?.title || '',
    journal: work?.journal || '',
    pages: work?.pages || '',
    year: work?.year || '',
    image_path: work?.image_path || '',
    order_index: work?.order_index || 0,
    is_active: work?.is_active ?? true,
    is_in_revision: work?.is_in_revision ?? false  // 추가
  });
  const [uploading, setUploading] = useState(false);

  // In Revision 상태에 따른 Pages, Year 필드 활성화/비활성화
  const isFieldsDisabled = formData.is_in_revision;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = work
          ? `/api/representative-works/${work.id}`
          : '/api/representative-works/';

      const method = work ? 'PUT' : 'POST';

      // In Revision인 경우 pages, year를 null로 전송
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

  // In Revision 체크박스 변경 처리
  const handleRevisionChange = (e) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      is_in_revision: isChecked,
      // In Revision이면 pages, year를 빈 문자열로 초기화
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

            <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Publication Status
            </label>
            <div
                className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              {/* In Revision 체크박스 */}
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

              {/* Pages와 Year 입력 필드 */}
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

// Gallery Images 탭 (간단 버전)
function GalleryImagesTab({images, onUpdate}) {
  return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Gallery Images
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Gallery images management will be implemented here.
        </p>
      </div>
  );
}

// ResearchAreasTab 컴포넌트
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
          method: 'DELETE'
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
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
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

// ResearchAreaForm 컴포넌트
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

export default AdminPage;
