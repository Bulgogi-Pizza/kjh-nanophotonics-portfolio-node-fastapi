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
  const [contentUploading, setContentUploading] = useState(false);
  const [selection, setSelection] = useState({start: 0, end: 0});
  const textareaId = "research-area-description-input";

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

  const insertAtCursor = (text) => {
    const el = document.getElementById(textareaId);
    if (!el) {
      setFormData(
          prev => ({...prev, description: (prev.description || "") + text}));
      return;
    }
    const start = el.selectionStart ?? selection.start ?? 0;
    const end = el.selectionEnd ?? selection.end ?? 0;
    const before = formData.description.slice(0, start);
    const after = formData.description.slice(end);
    const next = before + text + after;
    setFormData(prev => ({...prev, description: next}));
    requestAnimationFrame(() => {
      const pos = start + text.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  const handleContentImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setContentUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/research-areas/upload-content-image', {
        method: 'POST',
        body: fd
      });
      if (!res.ok) {
        throw new Error(
            `Upload failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      const alt = file.name.replace(/\.[^.]+$/, '');
      // Markdown 이미지 문법 자동 삽입
      insertAtCursor(`\n\n![${alt}](${data.image_path})\n\n`);
    } catch (err) {
      console.error('Error uploading content image', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setContentUploading(false);
      // 같은 파일 다시 선택 가능하게 초기화
      e.target.value = "";
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
              {/* 본문 이미지 업로드 버튼 */}
              <div className="flex items-center gap-2 mb-2">
                <label
                    className="px-3 py-1.5 border rounded cursor-pointer bg-gray-50 dark:bg-gray-700 text-sm">
                  Upload Content Image
                  <input
                      type="file"
                      accept="image/*"
                      onChange={handleContentImageUpload}
                      disabled={contentUploading}
                      className="hidden"
                  />
                </label>
                {contentUploading && (
                    <span className="text-sm text-blue-600">Uploading...</span>
                )}
                <span className="text-xs text-gray-500">
                 업로드 후 자동으로 마크다운 이미지(![])가 본문에 삽입됩니다.
               </span>
              </div>
              <textarea
                  required
                  id={textareaId}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(
                      {...formData, description: e.target.value})}
                  onSelect={(e) => {
                    const t = e.target;
                    setSelection(
                        {start: t.selectionStart, end: t.selectionEnd});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={`예) 마크다운 지원
제목은 # 로, 굵게는 **text**, 이미지: ![캡션](/static/uploads/research-areas/파일명.jpg)`}
              />
              {/* Live 미리보기 (선택 사항): react-markdown 사용 시 활성화
           <div className="mt-3 prose prose-sm dark:prose-invert max-w-none">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
               {formData.description || ""}
             </ReactMarkdown>
           </div>
           */}
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
