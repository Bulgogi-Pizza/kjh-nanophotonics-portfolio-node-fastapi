import React, {useEffect, useState} from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';

function CVMarkdownManager() {
  const [documents, setDocuments] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editorValue, setEditorValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const [docsRes, activeRes] = await Promise.all([
        fetch('/api/cv-markdown/documents'),
        fetch('/api/cv-markdown/documents/active')
      ]);

      const docsData = await docsRes.json();
      const activeData = activeRes.ok ? await activeRes.json() : null;

      setDocuments(docsData);
      setActiveDocument(activeData);
    } catch (error) {
      console.error('Error loading documents:', error);
      setError('Failed to load CV documents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (formData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/cv-markdown/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        loadDocuments();
        setShowCreateForm(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
    } catch (error) {
      setError(`Create failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDocument = async (doc) => {
    setEditingDoc(doc);
    setEditorValue(doc.content);
  };

  const handleSaveDocument = async () => {
    if (!editingDoc) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(
          `/api/cv-markdown/documents/${editingDoc.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              content: editorValue
            })
          });

      if (response.ok) {
        setEditingDoc(null);
        setEditorValue('');
        loadDocuments();
        alert('Document saved successfully!');
      } else {
        throw new Error('Failed to save document');
      }
    } catch (error) {
      setError('Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleSetActive = async (docId) => {
    try {
      const response = await fetch(
          `/api/cv-markdown/documents/${docId}/set-active`, {
            method: 'POST'
          });

      if (response.ok) {
        loadDocuments();
      } else {
        throw new Error('Failed to set active document');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(`/api/cv-markdown/documents/${docId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadDocuments();
      } else {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleExport = (docId) => {
    window.open(`/api/cv-markdown/documents/${docId}/export`, '_blank');
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  const sampleMarkdown = `# 김주훈 (Joohoon Kim)

## Contact Information
- **Email**: joohoon@example.com
- **Phone**: +82-10-1234-5678
- **Location**: Seoul, South Korea

## Education

### Ph.D. in Nanophotonics
**POSTECH** | 2018 - 2023
- Advisor: Prof. Junsuk Rho
- Dissertation: "Advanced Nanofabrication Techniques for Metasurfaces"

### M.S. in Physics
**Seoul National University** | 2016 - 2018

## Research Experience

### Postdoctoral Researcher
**POSTECH Institute of Artificial Intelligence** | 2023 - Present
- Developing scalable nanofabrication processes
- Focus on VR/AR applications and optical computing

## Skills

### Technical Skills
- **Nanofabrication**: E-beam lithography, Photolithography
- **Programming**: Python, MATLAB, LabVIEW
- **Software**: AutoCAD, SolidWorks, COMSOL

### Languages
- **Korean**: Native
- **English**: Fluent
- **Japanese**: Conversational

## Publications

1. **Kim, J.**, et al. (2023). "Scalable Manufacturing of Metasurfaces" *Nature Nanotechnology*, 15, 123-130.
2. **Kim, J.**, et al. (2022). "VR/AR Applications of Optical Metasurfaces" *Science*, 378, 456-462.

## Awards

- Best Paper Award, International Conference on Metamaterials (2023)
- Young Researcher Award, Korean Physical Society (2022)
`;

  return (
      <div className="space-y-6">
        {error && (
            <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
              <button
                  onClick={() => setError(null)}
                  className="float-right font-bold"
              >
                ×
              </button>
            </div>
        )}

        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            CV Markdown Manager
          </h1>
          <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              disabled={loading}
          >
            Create New CV
          </button>
        </div>

        {/* 활성 문서 표시 */}
        {activeDocument && (
            <div
                className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-green-800">
                    Currently Active CV
                  </h3>
                  <p className="text-green-700">
                    {activeDocument.title} - Last updated: {formatDate(
                      activeDocument.updated_at)}
                  </p>
                </div>
                <div
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ACTIVE
                </div>
              </div>
            </div>
        )}

        {/* 문서 목록 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div
              className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All CV Documents ({documents.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((doc) => (
                <div key={doc.id}
                     className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {doc.title}
                        </h3>
                        {doc.is_active && (
                            <span
                                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        ACTIVE
                      </span>
                        )}
                        <span
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      v{doc.version}
                    </span>
                      </div>

                      {doc.description && (
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {doc.description}
                          </p>
                      )}

                      <div
                          className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created: {formatDate(doc.created_at)}</span>
                        <span>Modified: {formatDate(doc.updated_at)}</span>
                        <span>Content: {doc.content.length} chars</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                          onClick={() => handleExport(doc.id)}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                      >
                        Export .md
                      </button>

                      <button
                          onClick={() => handleEditDocument(doc)}
                          className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm hover:bg-yellow-200 transition-colors"
                          disabled={loading}
                      >
                        Edit
                      </button>

                      {!doc.is_active && (
                          <button
                              onClick={() => handleSetActive(doc.id)}
                              className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                          >
                            Set Active
                          </button>
                      )}

                      <button
                          onClick={() => handleDelete(doc.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
            ))}

            {documents.length === 0 && !loading && (
                <div className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No CV documents
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Create your first CV document to get started.
                  </p>
                </div>
            )}
          </div>
        </div>

        {/* 생성 폼 모달 */}
        {showCreateForm && (
            <CVCreateForm
                onSubmit={handleCreateDocument}
                onClose={() => setShowCreateForm(false)}
                loading={loading}
                sampleContent={sampleMarkdown}
            />
        )}

        {/* 마크다운 에디터 모달 */}
        {editingDoc && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div
                  className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-7xl h-5/6 flex flex-col">
                <div
                    className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Editing: {editingDoc.title}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                        onClick={handleSaveDocument}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={() => {
                          setEditingDoc(null);
                          setEditorValue('');
                        }}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-hidden">
                  <MDEditor
                      value={editorValue}
                      onChange={setEditorValue}
                      height={500}
                      preview="edit"
                      hideToolbar={false}
                      data-color-mode="light"
                  />
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

// CV 생성 폼 컴포넌트
function CVCreateForm({onSubmit, onClose, loading, sampleContent}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: sampleContent
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Please provide title and content');
      return;
    }
    onSubmit(formData);
  };

  return (
      <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-5/6 overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New CV Document
              </h3>
              <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                      prev => ({...prev, title: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Joohoon Kim CV 2025"
              />
            </div>

            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(
                      prev => ({...prev, description: e.target.value}))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Optional description..."
              />
            </div>

            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content (Markdown) *
              </label>
              <MDEditor
                  value={formData.content}
                  onChange={(val) => setFormData(
                      prev => ({...prev, content: val || ''}))}
                  height={300}
                  preview="edit"
                  data-color-mode="light"
              />
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
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default CVMarkdownManager;
