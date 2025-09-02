import React, {useEffect, useState} from 'react';

function AwardsPage() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterYear, setFilterYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/awards/')
    .then(res => res.json())
    .then(data => {
      setAwards(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching awards:', error);
      setError('Failed to load awards data');
      setLoading(false);
    });
  }, []);

  // 필터링된 데이터
  const filteredAwards = awards.filter(award => {
    const matchesYear = !filterYear || award.year === filterYear;
    const matchesSearch = !searchTerm ||
        award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.organization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesYear && matchesSearch;
  });

  // 년도별로 정렬 (최신순)
  const sortedAwards = [...filteredAwards].sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year;
    }
    return b.id - a.id;
  });

  const availableYears = [...new Set(awards.map(award => award.year))].sort(
      (a, b) => b - a);

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

  if (error) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-8 py-24">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-8 py-12 max-w-7xl">

          {/* 페이지 헤더 */}
          <div className="mb-8 text-center">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Awards
            </h1>
          </div>

          {/* 총 수상 수 표시 */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Total {filteredAwards.length} awards
            </p>
          </div>

          {/* Awards 목록 */}
          <div className="space-y-4">
            {sortedAwards.map((award, index) => (
                <article
                    key={award.id}
                    className="flex gap-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* 왼쪽 넘버링 */}
                  <div
                      className="w-16 flex-shrink-0 flex items-start justify-center pt-3">
                    <span
                        className="text-xl font-bold text-gray-900 dark:text-white">
                      {index + 1}
                    </span>
                  </div>

                  {/* 오른쪽 수상 정보 영역 */}
                  <div className="flex-1 py-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                      {award.title}
                    </h3>

                    <div
                        className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-300">

                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {award.organization}
                        {award.location && `, ${award.location}`}
                      </p>

                      {award.year && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span
                                className="font-semibold text-blue-600 dark:text-blue-400">
                              {award.year}
                            </span>
                          </>
                      )}

                      {award.description && (
                          <div className="text-gray-600 dark:text-gray-400">
                            <p className="leading-relaxed text-sm">
                              {award.description}
                            </p>
                          </div>
                      )}
                    </div>
                  </div>
                </article>
            ))}
          </div>

          {/* 검색 결과 없음 */}
          {sortedAwards.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No awards found matching your criteria.
                </p>
              </div>
          )}
        </div>
      </div>
  );
}

export default AwardsPage;
