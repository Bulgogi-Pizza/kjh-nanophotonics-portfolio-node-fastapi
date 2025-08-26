import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function PublicationsSection() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    Promise.all([
      fetch('/api/publications/?status=published'),
      fetch('/api/publications/stats')
    ])
    .then(([pubRes, statsRes]) => Promise.all(
        [pubRes.json(), statsRes.json()]))
    .then(([pubData, statsData]) => {
      // 최신 3개만 가져오기
      setPublications(pubData.slice(0, 3));
      setStats(statsData);
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
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading
                publications...</p>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          {/* 섹션 헤더 - 제목 가운데, 햄버거 버튼 우측 */}
          <div className="relative mb-16">
            {/* 가운데 제목 */}
            <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Publications
              </h2>
            </div>

            {/* 우측 고정 햄버거 버튼 */}
            <Link
                to="/publications"
                className="absolute top-0 right-0 p-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400  rounded-xl transition-all duration-200 group border border-transparent  "
                aria-label="View all publications"
            >
              {/* 햄버거 아이콘 */}
              <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Link>
          </div>

          {/* 출판물 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((pub, index) => (
                <article
                    key={pub.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                >
                  {/* 상단: 제목과 저자 */}
                  <div className="flex-1">
                    {/* 기여도 배지 */}
                    <div className="flex justify-start mb-4">
                      {pub.is_first_author && (
                          <span
                              className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold">
                            First Author
                          </span>
                      )}
                    </div>

                    {/* 제목 */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                      {pub.title}
                    </h3>

                    {/* 저자 */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                      {pub.authors}
                    </p>
                  </div>

                  {/* 특별 정보 */}
                  {pub.featured_info && (
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                        {pub.featured_info}
                      </p>
                  )}

                  {/* 하단: 저널 정보와 링크 */}
                  <div
                      className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                    {/* 저널과 연도 */}
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                      <span
                          className="font-bold italic">{pub.journal} {pub.volume}</span>, {pub.pages} ({pub.year})
                    </p>


                    {/* View Publication 링크 */}
                    <div>
                      {pub.doi ? (
                          <a
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm group/link"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none"
                                 stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                            View Publication
                            <svg
                                className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform"
                                fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>
                          </a>
                      ) : (
                          <span className="text-gray-400 text-sm italic">Publication coming soon</span>
                      )}
                    </div>
                  </div>
                </article>
            ))}
          </div>
        </div>
      </section>
  );
}

export default PublicationsSection;
