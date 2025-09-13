import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {useNavigate, useParams} from 'react-router-dom';

function ResearchPage() {
  const {slug} = useParams();
  const navigate = useNavigate();
  const [researchAreas, setResearchAreas] = useState([]);
  const [activeArea, setActiveArea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/research-areas/')
    .then(res => res.json())
    .then(data => {
      setResearchAreas(data);

      if (!data?.length) {
        setActiveArea(null);
        setLoading(false);
        return;
      }

      if (slug) {
        const found = data.find(a => a.slug === slug);
        if (found) {
          setActiveArea(found);
        } else {
          setActiveArea(data[0]);
          navigate(`/research/${data[0].slug}`, {replace: true});
        }
      } else {
        setActiveArea(data[0]);
        navigate(`/research/${data[0].slug}`, {replace: true});
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching research areas:', err);
      setLoading(false);
    });
  }, [slug, navigate]);

  if (loading) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-8 py-24">
            <div className="text-center">
              <div
                  className="animate-spin h-8 w-8 border-2 border-t-transparent border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-8 py-16 max-w-7xl">

          {/* 페이지 헤더 */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Research
            </h1>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mb-12">
            <nav className="flex justify-center">
              <div
                  className="flex md:flex-row flex-col w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {researchAreas.map((area) => (
                    <button
                        key={area.slug}
                        onClick={() => navigate(`/research/${area.slug}`)}
                        className={`flex-1 px-4 py-4 text-sm font-medium transition-all duration-200 
                        md:border-r md:border-b-0 border-b border-gray-200 dark:border-gray-700 
                        md:last:border-r-0 last:border-b-0 break-words ${
                            activeArea?.id === area.id
                                ? 'text-white bg-blue-600'
                                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        style={{
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal'
                        }}
                    >
                      {area.title}
                    </button>
                ))}
              </div>
            </nav>
          </div>

          {activeArea && (
              <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-sm">
                  <div className="px-5 sm:px-12 py-10 sm:py-16">
                    <div className="text-center mb-8 sm:mb-12">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">{activeArea.title}</h2>
                      <div className="w-12 sm:w-16 h-1 bg-blue-600 mx-auto"/>
                    </div>

                    <div
                        className="prose prose-base sm:prose-lg md:prose-xl dark:prose-invert max-w-none text-left">
                      <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            img: ({node, ...props}) => (
                                <img {...props}
                                     className="mx-auto my-4 sm:my-6 rounded shadow max-h-64 sm:max-h-96"
                                     loading="lazy"/>
                            ),
                            a: ({node, ...props}) => (
                                <a {...props}
                                   className="text-blue-600 underline break-words"
                                   target="_blank" rel="noopener noreferrer"/>
                            )
                          }}
                      >
                        {activeArea.description || ""}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

export default ResearchPage;
