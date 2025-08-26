import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

function ResearchPage() {
  const {slug} = useParams();
  const [researchAreas, setResearchAreas] = useState([]);
  const [activeArea, setActiveArea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/research-areas/')
    .then(res => res.json())
    .then(data => {
      setResearchAreas(data);
      // URL slug에 해당하는 area가 있으면 해당 area를 active로 설정
      if (slug) {
        const foundArea = data.find(area => area.slug === slug);
        if (foundArea) {
          setActiveArea(foundArea);
        }
      } else {
        // slug가 없으면 첫 번째 area를 active로 설정
        setActiveArea(data[0]);
      }
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching research areas:', error);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 py-24">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading research
                areas...</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-12">

          {/* 페이지 헤더 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Research
            </h1>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex justify-center mb-12">
            <div
                className="flex bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
              {researchAreas.map((area) => (
                  <button
                      key={area.slug}
                      onClick={() => setActiveArea(area)}
                      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                          activeArea?.id === area.id
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                  >
                    {area.title}
                  </button>
              ))}
            </div>
          </div>

          {/* 활성화된 연구 분야 내용 */}
          {activeArea && (
              <div className="max-w-4xl mx-auto">
                <div
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">

                  {/* 제목과 아이콘 */}
                  <div className="flex items-center mb-6">

                    <h2 className="place-items-center text-3xl font-bold text-gray-900 dark:text-white">
                      {activeArea.title}
                    </h2>
                  </div>

                  {/* 설명 */}
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {activeArea.description}
                    </p>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

export default ResearchPage;
