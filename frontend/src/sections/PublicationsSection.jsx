import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function PublicationsSection() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    Promise.all([
      fetch('/api/publications/'),
      fetch('/api/publications/stats')
    ])
    .then(([pubRes, statsRes]) => Promise.all(
        [pubRes.json(), statsRes.json()])) // 괄호 추가
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
          {/* 섹션 헤더 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Latest Publications
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
              Recent breakthrough research in nanophotonics, published in
              top-tier international journals.
            </p>

            {/* 통계 정보 */}
            <div
                className="flex justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <div><span className="font-semibold text-blue-600">{stats.total
                  || 0}</span> Total Papers
              </div>
              <div><span
                  className="font-semibold text-blue-600">{stats.first_author
                  || 0}</span> First Author
              </div>
              <div><span
                  className="font-semibold text-blue-600">{stats.corresponding
                  || 0}</span> Corresponding
              </div>
            </div>
          </div>

          {/* 출판물 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {publications.map((pub, index) => (
                <article
                    key={pub.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* 논문 번호 및 기여도 */}
                  <div className="flex justify-between items-start mb-4">
                <span
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                  #{pub.number}
                </span>
                    {pub.is_first_author && (
                        <span
                            className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-semibold">
                    First Author
                  </span>
                    )}
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {pub.title}
                  </h3>

                  {/* 저자 및 저널 */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                    {pub.authors}
                  </p>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                    {pub.journal} ({pub.year})
                  </p>

                  {/* 특별 정보 */}
                  {pub.featured_info && (
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                        🌟 {pub.featured_info}
                      </p>
                  )}

                  {/* DOI 링크 */}
                  <div
                      className="pt-4 border-t border-gray-100 dark:border-gray-700">
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
                        <span
                            className="text-gray-400 text-sm">Coming Soon</span>
                    )}
                  </div>
                </article>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
                to="/publications"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All Publications
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
  );
}

export default PublicationsSection;
