import React, {useEffect, useState} from 'react';

function CVEditorTab() {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    bio: '',
    profile_image: '',
    contact_info: [
      {label: 'E-mail', value: '', data_type: 'email', order_index: 0},
      {label: 'Office', value: '', data_type: 'text', order_index: 1},
      {label: 'Phone', value: '', data_type: 'phone', order_index: 2}
    ],
    cv_sections: [
      {title: 'Biography', content: '', order_index: 0},
      {title: 'Education', content: '', order_index: 1},
      {title: 'Professional Experience', content: '', order_index: 2}
    ]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    setLoading(true);
    fetch('/api/cv/profile')
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      // If no profile exists, the server might return 404, which is fine.
      // We'll proceed with the default empty state.
      return null;
    })
    .then(data => {
      if (data) {
        setProfile(data);
      }
    })
    .catch(error => {
      console.log(
          'No existing profile found, initializing with default structure.',
          error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/cv/profile', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        alert('저장되었습니다!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // --- State update handlers ---
  const addContactInfo = () => setProfile(p => ({
    ...p,
    contact_info: [...p.contact_info, {
      label: '',
      value: '',
      data_type: 'text',
      order_index: p.contact_info.length
    }]
  }));
  const updateContactInfo = (index, field, value) => setProfile(p => ({
    ...p,
    contact_info: p.contact_info.map(
        (item, i) => i === index ? {...item, [field]: value} : item)
  }));
  const removeContactInfo = (index) => setProfile(p => ({
    ...p,
    contact_info: p.contact_info.filter((_, i) => i !== index)
  }));
  const addCVSection = () => setProfile(p => ({
    ...p,
    cv_sections: [...p.cv_sections,
      {title: '', content: '', order_index: p.cv_sections.length}]
  }));
  const updateCVSection = (index, field, value) => setProfile(p => ({
    ...p,
    cv_sections: p.cv_sections.map(
        (item, i) => i === index ? {...item, [field]: value} : item)
  }));
  const removeCVSection = (index) => setProfile(
      p => ({...p, cv_sections: p.cv_sections.filter((_, i) => i !== index)}));

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/cv/upload-image',
          {method: 'POST', body: formData});
      if (response.ok) {
        const data = await response.json();
        setProfile(prev => ({...prev, profile_image: data.image_url}));
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center py-12">
          <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading CV data...</span>
        </div>
    );
  }

  return (
      <div>
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">CV
            Editor</h2>
          <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>

        {/* Basic Info Section */}
        <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">기본
            정보</h3>
          {/* Name and Title Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">이름</label>
              <input type="text" value={profile.name}
                     onChange={(e) => setProfile(
                         p => ({...p, name: e.target.value}))}
                     className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                     placeholder="이름을 입력하세요"/>
            </div>
            <div>
              <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">직책/타이틀</label>
              <input type="text" value={profile.title || ''}
                     onChange={(e) => setProfile(
                         p => ({...p, title: e.target.value}))}
                     className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                     placeholder="직책이나 타이틀을 입력하세요"/>
            </div>
          </div>
          {/* Profile Image Upload */}
          <div className="mt-6">
            <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">프로필
              사진</label>
            <input type="file" accept="image/*" onChange={handleImageUpload}
                   className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            {profile.profile_image && (
                <div className="mt-4">
                  <img src={profile.profile_image} alt="Profile preview"
                       className="w-32 h-32 object-cover rounded-lg border"/>
                </div>
            )}
          </div>
        </div>

        {/* Contact Info Section */}
        <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">연락처
              정보</h3>
            <button onClick={addContactInfo}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors">+
              연락처 추가
            </button>
          </div>
          <div className="space-y-4">
            {profile.contact_info.map((contact, index) => (
                <div key={index}
                     className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  {/* Label, Type, Value inputs and Delete button */}
                  <div>
                    <label
                        className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">레이블</label>
                    <input type="text" placeholder="E-mail"
                           value={contact.label}
                           onChange={(e) => updateContactInfo(index, 'label',
                               e.target.value)}
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
                  </div>
                  <div>
                    <label
                        className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">타입</label>
                    <select value={contact.data_type}
                            onChange={(e) => updateContactInfo(index,
                                'data_type', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="text">텍스트</option>
                      <option value="email">이메일</option>
                      <option value="phone">전화번호</option>
                      <option value="link">링크</option>
                    </select>
                  </div>
                  <div>
                    <label
                        className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">내용</label>
                    <input type="text" placeholder="값을 입력하세요"
                           value={contact.value}
                           onChange={(e) => updateContactInfo(index, 'value',
                               e.target.value)}
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => removeContactInfo(index)}
                            className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors">삭제
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* CV Sections */}
        <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">CV
              섹션</h3>
            <button
                onClick={addCVSection}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
            >
              + 섹션 추가
            </button>
          </div>
          <div className="space-y-6">
            {profile.cv_sections.map((section, index) => (
                <div key={index}
                     className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 mr-4">
                      <label
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">섹션
                        제목</label>
                      <input
                          type="text"
                          placeholder="Biography"
                          value={section.title}
                          onChange={(e) => updateCVSection(index, 'title',
                              e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <button
                        onClick={() => removeCVSection(index)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium mt-8 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                  <div>
                    <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">내용</label>
                    <textarea
                        placeholder="내용을 입력하세요..."
                        value={section.content}
                        onChange={(e) => updateCVSection(index, 'content',
                            e.target.value)}
                        rows={10}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <b>Tip:</b> 마크다운 문법을 사용할 수 있습니다. (예: `**굵게**`, `*기울임*`, `-
                      목록 항목`)
                    </p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

export default CVEditorTab;