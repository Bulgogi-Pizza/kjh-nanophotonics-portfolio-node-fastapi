// AdminPage.jsx
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import CVMarkdownManager from "./admin/CVMarkdownManager.jsx";
import RepresentativeWorksTab from "./admin/RepresentativeWorksTab.jsx";
import GalleryImagesTab from "./admin/GalleryImagesTab.jsx";
import ResearchAreasTab from "./admin/ResearchAreasTab.jsx";
import CVEditorTab from "./admin/CVEditorTab.jsx";
import PublicationsTab from "./admin/PublicationsTab.jsx";

function AdminPage() {
  const [representativeWorks, setRepresentativeWorks] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [researchAreas, setResearchAreas] = useState([]);
  const [cvDocuments, setCvDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('representative-works');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [worksRes, imagesRes, areasRes, cvRes] = await Promise.all([
        fetch('/api/representative-works/?active_only=false'),
        fetch('/api/representative-works/gallery/?active_only=false'),
        fetch('/api/research-areas/?active_only=false'),
        fetch('/api/cv-markdown/documents')
      ]);

      const works = await worksRes.json();
      const images = imagesRes.ok ? await imagesRes.json() : [];
      const areas = areasRes.ok ? await areasRes.json() : [];
      const cvDocs = cvRes.ok ? await cvRes.json() : [];

      setRepresentativeWorks(works);
      setGalleryImages(images);
      setResearchAreas(areas);
      setCvDocuments(cvDocs);
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
              <button
                  onClick={() => setActiveTab('cv-editor')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'cv-editor'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                CV Editor
              </button>
              <button
                  onClick={() => setActiveTab('cv-markdown')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'cv-markdown'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                CV Markdown
              </button>
              {/* 3. Publications 탭을 위한 버튼을 추가합니다. */}
              <button
                  onClick={() => setActiveTab('publications')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'publications'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Publications
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

          {activeTab === 'publications' && <PublicationsTab/>}


          {activeTab === 'research' && (
              <ResearchAreasTab
                  areas={researchAreas}
                  onUpdate={loadData}
              />
          )}

          {activeTab === 'cv-editor' && <CVEditorTab/>}

          {activeTab === 'cv-markdown' && <CVMarkdownManager/>}
        </div>
      </div>
  );
}

export default AdminPage;
