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

  // 년도별 그룹핑
  const awardsByYear = awards.reduce((acc, award) => {
    const year = award.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(award);
    return acc;
  }, {});

  const years = Object.keys(awardsByYear).sort((a, b) => b - a);

  // 필터링된 데이터
  const filteredAwards = awards.filter(award => {
    const matchesYear = !filterYear || award.year === filterYear;
    const matchesSearch = !searchTerm ||
        award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.organization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const filteredAwardsByYear = filteredAwards.reduce((acc, award) => {
    const year = award.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(award);
    return acc;
  }, {});

  const filteredYears = Object.keys(filteredAwardsByYear).sort((a, b) => b - a);

  // 랭크별 아이콘 및 스타일
  const getRankInfo = (rank) => {
    if (rank && rank.toLowerCase().includes('1st') || rank
        && rank.toLowerCase().includes('grand')) {
      return {
        icon: '🏆',
        class: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
        textClass: 'text-yellow-600 dark:text-yellow-400'
      };
    } else if (rank && rank.toLowerCase().includes('2nd')) {
      return {
        icon: '🥈',
        class: 'bg-gradient-to-r from-gray-300 to-gray-400 text-white',
        textClass: 'text-gray-600 dark:text-gray-400'
      };
    } else if (rank && rank.toLowerCase().includes('3rd')) {
      return {
        icon: '🥉',
        class: 'bg-gradient-to-r from-orange-400 to-red-400 text-white',
        textClass: 'text-orange-600 dark:text-orange-400'
      };
    }
    return {
      icon: '🏅',
      class: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
      textClass: 'text-purple-600 dark:text-purple-400'
    };
  };

  if (loading) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 py-24">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading
                awards...</p>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 py-24">
            <div className="text-center">
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 py-12">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Awards & Recognition
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
              International recognition and prestigious awards for contributions
              to nanophotonics research
            </p>

            {/* 통계 정보 */}
            <div
                className="flex justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <div><span
                  className="font-semibold text-purple-600">{awards.length}</span> Total
                Awards
              </div>
              <div><span
                  className="font-semibold text-yellow-600">{awards.filter(
                  a => a.rank && (a.rank.includes('1st') || a.rank.includes(
                      'Grand'))).length}</span> First Place
              </div>
              <div><span
                  className="font-semibold text-purple-600">{years.length}</span> Years
                Active
              </div>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-8 space-y-4">
            <div
                className="flex flex-col md:flex-row gap-4 justify-center items-center">
              {/* 검색바 */}
              <div className="relative">
                <input
                    type="text"
                    placeholder="Search awards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>

              {/* 연도 필터 */}
              <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Years</option>
                {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* 리셋 버튼 */}
              <button
                  onClick={() => {
                    setFilterYear('');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Awards 목록 (연도별 그룹) */}
          <div className="space-y-12">
            {filteredYears.map(year => (
                <div key={year} className="relative">
                  {/* 연도 헤더 */}
                  <div
                      className="sticky top-20 z-10 bg-white dark:bg-gray-900 py-4 mb-6 border-b-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-center">
                      <div
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full font-bold text-xl shadow-lg">
                        {year}
                      </div>
                    </div>
                  </div>

                  {/* 해당 연도의 Awards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredAwardsByYear[year].map((award, index) => {
                      const rankInfo = getRankInfo(award.rank);

                      return (
                          <div
                              key={award.id}
                              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                          >
                            {/* Award 카드 헤더 */}
                            <div
                                className={`${rankInfo.class} p-4 text-center relative overflow-hidden`}>
                              <div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                              <div
                                  className="text-3xl mb-2">{rankInfo.icon}</div>
                              <p className="font-bold text-lg">
                                {award.rank || 'Award'}
                              </p>
                            </div>

                            {/* Award 카드 바디 */}
                            <div className="p-6">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {award.title}
                              </h3>

                              <div className="space-y-2 mb-4">
                                <div
                                    className="flex items-center text-gray-600 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 flex-shrink-0"
                                       fill="none" stroke="currentColor"
                                       viewBox="0 0 24 24">
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth={2}
                                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"/>
                                  </svg>
                                  <span
                                      className="font-medium text-purple-600 dark:text-purple-400">
                              {award.organization}
                            </span>
                                </div>

                                <div
                                    className="flex items-center text-gray-600 dark:text-gray-400">
                                  <svg className="w-4 h-4 mr-2 flex-shrink-0"
                                       fill="none" stroke="currentColor"
                                       viewBox="0 0 24 24">
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth={2}
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth={2}
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                  </svg>
                                  <span>{award.location}</span>
                                </div>
                              </div>

                              {award.description && (
                                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                    {award.description}
                                  </p>
                              )}

                              {/* Achievement 배지 */}
                              <div
                                  className="flex items-center justify-between">
                          <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${rankInfo.textClass.includes(
                                  'yellow')
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                  : rankInfo.textClass.includes('gray')
                                      ? 'bg-gray-100 dark:bg-gray-700'
                                      : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                            Achievement
                          </span>
                                <div className="text-right">
                                  <div
                                      className="text-2xl">{rankInfo.icon}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>
            ))}
          </div>

          {/* 검색 결과 없음 */}
          {filteredAwards.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No awards found matching your criteria.
                </p>
              </div>
          )}

          {/* 하단 통계 */}
          <div className="mt-16 text-center">
            <div
                className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Awards Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {awards.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Awards
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {awards.filter(a => a.rank && (a.rank.includes('1st')
                        || a.rank.includes('Grand'))).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Gold/1st Place
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600 mb-2">
                    {awards.filter(
                        a => a.rank && a.rank.includes('2nd')).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Silver/2nd Place
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {years.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Years Active
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Showing {filteredAwards.length} of {awards.length} awards
            </p>
          </div>
        </div>
      </div>
  );
}

export default AwardsPage;
