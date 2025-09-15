import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function PublicationsSection() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/publications/?status=published')
    .then(res => res.json())
    .then(data => {
      setPublications(data.slice(0, 4)); // 최신 4개
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching publications:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-8">
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
      <section className="py-24 bg-white dark:bg-gray-900">
        <div
            className="relative container mx-auto px-4 sm:px-8 md:px-12 lg:px-40 max-w-[2000px]">
          {/* 섹션 헤더 */}
          <div className="relative mb-16">
            <div className="text-center">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Publications</h2>

            </div>

            {/* 우측 햄버거 버튼 */}
            <Link
                to="/publications"
                className="absolute top-0 right-0 p-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="View all publications"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </Link>
          </div>

          {/* 출판물 그리드 */}
          <div className="grid md:grid-cols-2 gap-8">
            {publications.map((pub) => (
                <article
                    key={pub.id}
                    className="p-4 flex gap-6 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >

                  {/* 오른쪽 논문 정보 */}
                  <div className="flex-1 py-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug">
                      {pub.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">{pub.authors}</p>
                    <div
                        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">

                      <span
                          className="font-medium italic text-blue-600 dark:text-blue-400">
                        {pub.journal}
                      </span>
                      {pub.volume && <span
                          className="font-bold">• {pub.volume}</span>}
                      {pub.pages && <span>• {pub.pages}</span>}
                      <span>• {pub.year}</span>
                    </div>

                    {pub.doi && (
                        <div className="flex justify-end">
                          <a
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            🔗 LINK
                          </a>
                        </div>
                    )}
                  </div>
                </article>
            ))}
          </div>
        </div>
      </section>
  );
}

export default PublicationsSection;
