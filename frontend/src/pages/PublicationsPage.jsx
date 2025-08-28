import React, {useEffect, useState} from 'react';

function PublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: '',
    category: '',
    status: ''
  });
  const [availableYears, setAvailableYears] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // API에서 데이터 로드
  useEffect(() => {
    Promise.all([
      fetch('/api/publications/'),
      fetch('/api/publications/years'),
      fetch('/api/publications/stats')
    ])
    .then(([pubRes, yearsRes, statsRes]) =>
        Promise.all([pubRes.json(), yearsRes.json(), statsRes.json()])
    )
    .then(([pubData, yearsData, statsData]) => {
      setPublications(pubData);
      setAvailableYears(yearsData.years);
      setStats(statsData);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching ', error);
      setLoading(false);
    });
  }, []);

  // 필터링된 데이터 로드
  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (filters.year) {
      queryParams.append('year', filters.year);
    }
    if (filters.category) {
      queryParams.append('category', filters.category);
    }
    if (filters.status) {
      queryParams.append('status', filters.status);
    }

    fetch(`/api/publications/?${queryParams.toString()}`)
    .then(res => res.json())
    .then(data => setPublications(data))
    .catch(console.error);
  }, [filters]);

  // 검색 필터링
  const filteredPublications = publications.filter(pub => {
    if (!searchTerm) {
      return true;
    }
    const searchLower = searchTerm.toLowerCase();
    return pub.title.toLowerCase().includes(searchLower) ||
        pub.authors.toLowerCase().includes(searchLower) ||
        pub.journal.toLowerCase().includes(searchLower);
  });

  if (loading) {
    return (
        <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
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
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Publications
            </h1>
          </div>

          {/* 연도 필터 */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-start">
              <button
                  onClick={() => setFilters({...filters, year: ''})}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      filters.year === ''
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                ALL
              </button>
              {availableYears.map(year => (
                  <button
                      key={year}
                      onClick={() => setFilters(
                          {...filters, year: year.toString()})}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          filters.year === year.toString()
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {year}
                  </button>
              ))}
            </div>
          </div>

          {/* 총 논문 수 표시 */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              Total {filteredPublications.length} 페이지
            </p>
          </div>

          {/* 연도별 섹션 */}
          {availableYears.filter(year =>
              filteredPublications.some(pub => pub.year === year)
          ).map(year => (
              <div key={year} className="mb-16">
                {/* 연도 헤더 */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {year}
                  </h2>
                  <div
                      className="w-full h-px bg-gray-300 dark:bg-gray-600"></div>
                </div>

                {/* 해당 연도의 논문들 */}
                <div className="space-y-8">
                  {filteredPublications
                  .filter(pub => pub.year === year)
                  .map((pub) => (
                      <article
                          key={pub.id}
                          className="flex gap-8 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                      >


                        {/* 오른쪽 논문 정보 영역 */}
                        <div className="flex-1 py-4">
                          <div
                              className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                  <span
                                      className="text-lg font-bold text-gray-900 dark:text-white">
                                    {pub.number}
                                  </span>
                            </div>
                            {(pub.doi || pub.arxiv) && (
                                <button
                                    className="px-4 py-1 border border-blue-600 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                  🔗 LINK
                                </button>
                            )}
                          </div>

                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                            {pub.title}
                          </h3>

                          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            {pub.authors}
                          </p>

                          <div
                              className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <span
                                    className="font-medium italic text-blue-600 dark:text-blue-400">
                                  {pub.journal}
                                </span>
                            <span>, {pub.year}</span>
                            {pub.status && (
                                <>
                                  <span>, </span>
                                  <span className="italic">{pub.status}</span>
                                </>
                            )}
                          </div>

                          {pub.featured_info && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {pub.featured_info}
                              </p>
                          )}
                        </div>
                      </article>
                  ))}
                </div>
              </div>
          ))}

          {filteredPublications.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400">
                  No publications found matching your criteria.
                </p>
              </div>
          )}
        </div>
      </div>
  );
}

export default PublicationsPage;
