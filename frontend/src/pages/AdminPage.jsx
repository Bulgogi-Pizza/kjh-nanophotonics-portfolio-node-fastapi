// AdminPage.jsx
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import RepresentativeWorksTab from "./admin/RepresentativeWorksTab.jsx";
import ResearchAreasTab from "./admin/ResearchAreasTab.jsx";
import PublicationsTab from "./admin/PublicationsTab.jsx";
import CoverArtsTab from "./admin/CoverArtsTab.jsx";
import ResearchHighlightsTab from "./admin/ResearchHighlightsTab.jsx";

function AdminPage() {
  const [representativeWorks, setRepresentativeWorks] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [researchAreas, setResearchAreas] = useState([]);
  const [cvDocuments, setCvDocuments] = useState([]);
  const [researchHighlights, setResearchHighlights] = useState([]);
  const [coverArts, setCoverArts] = useState([]);
  const [activeTab, setActiveTab] = useState('representative-works');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [worksRes, imagesRes, areasRes, cvRes, highlightsRes, coversRes] = await Promise.all(
          [
            fetch('/api/representative-works/?active_only=false'),
            fetch('/api/representative-works/gallery/?active_only=false'),
            fetch('/api/research-areas/?active_only=false'),
            fetch('/api/cv-markdown/documents'),
            fetch('/api/research-highlights/?active_only=false'),
            fetch('/api/cover-arts/?active_only=false'),
          ]);

      const works = await worksRes.json();
      const images = imagesRes.ok ? await imagesRes.json() : [];
      const areas = areasRes.ok ? await areasRes.json() : [];
      const cvDocs = cvRes.ok ? await cvRes.json() : [];
      const highlights = highlightsRes.ok ? await highlightsRes.json() : [];
      const covers = coversRes.ok ? await coversRes.json() : [];

      setRepresentativeWorks(works);
      setGalleryImages(images);
      setResearchAreas(areas);
      setCvDocuments(cvDocs);
      setResearchHighlights(highlights);
      setCoverArts(covers);
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
                  onClick={() => setActiveTab('publications')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'publications'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Publications
              </button>

              <button onClick={() => setActiveTab('research-highlights')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab
                      === 'research-highlights'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                Research Highlights
              </button>

              <button onClick={() => setActiveTab('cover-arts')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab
                      === 'cover-arts' ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                Cover Arts
              </button>
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'representative-works' && (
              <RepresentativeWorksTab works={representativeWorks}
                                      onUpdate={loadData}/>
          )}

          {activeTab === 'publications' && <PublicationsTab/>}

          {activeTab === 'research' && (
              <ResearchAreasTab areas={researchAreas} onUpdate={loadData}/>
          )}

          {activeTab === 'research-highlights' && (
              <ResearchHighlightsTab items={researchHighlights}
                                     onUpdate={loadData}/>
          )}

          {activeTab === 'cover-arts' && (
              <CoverArtsTab items={coverArts} onUpdate={loadData}/>
          )}

        </div>
      </div>
  );
}

export default AdminPage;
