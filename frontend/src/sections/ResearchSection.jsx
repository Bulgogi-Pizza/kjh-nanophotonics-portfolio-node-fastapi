import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom"

function ResearchSection() {
  const [researchAreas, setResearchAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/research-areas/')
    .then(res => res.json())
    .then(data => {
      setResearchAreas(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching research areas:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center">
              <div
                  className="animate-spin h-8 w-8 border-2 border-t-transparent border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section className="py-24 bg-gray-white dark:bg-gray-900">
        <div
            className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-40 max-w-[2000px]">
          {/* 섹션 제목 */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Research</h2>
          </div>

          {/* 연구 주제 카드들 */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {researchAreas.map((area) => (
                <div
                    key={area.id}
                    role="link"
                    tabIndex={0}
                    aria-label={`${area.title} 자세히 보기`}
                    onClick={() => navigate(`/research/${area.slug}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate(
                            `/research/${area.slug}`);
                      }
                    }}
                    className="group bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {/* 아이콘 */}
                  {area.icon_path && (
                      <div className="mb-6 flex justify-center">
                        <div
                            className="w-30 h-30 flex items-center justify-center">
                          <img
                              src={area.icon_path}
                              alt={`${area.title} icon`}
                              className="w-28 h-28 filter group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                  )}

                  {/* 제목 */}
                  <h3 className="text-md sm:text-xl font-bold break-normal text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {area.title}
                  </h3>

                  {/* 데코레이션 요소 */}
                  <div
                      className="mt-6 w-12 h-1 bg-blue-600 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}

export default ResearchSection;
