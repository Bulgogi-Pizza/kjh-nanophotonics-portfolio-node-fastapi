import React, {useEffect, useState} from 'react';

function ConferencesPage() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    year: '',
    type: '',
    award: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/conferences/')
    .then(res => res.json())
    .then(data => {
      setConferences(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching conferences:', error);
      setError('Failed to load conferences data');
      setLoading(false);
    });
  }, []);

  // 연도별 그룹핑
  const conferencesByYear = conferences.reduce((acc, conf) => {
    const year = conf.date.split('-')[0]; // YYYY-MM에서 YYYY 추출
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(conf);
    return acc;
  }, {});

  const years = Object.keys(conferencesByYear).sort((a, b) => b - a);

  // 필터링된 데이터
  const filteredConferences = conferences.filter(conf => {
    const confYear = conf.date.split('-');
    const matchesYear = !filters.year || confYear === filters.year;
    const matchesType = !filters.type
        || conf.presentation_type.toLowerCase().includes(
            filters.type.toLowerCase());
    const matchesAward = !filters.award || (conf.award
        && conf.award.toLowerCase().includes(filters.award.toLowerCase()));
    const matchesSearch = !searchTerm ||
        conf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conf.conference_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conf.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesYear && matchesType && matchesAward && matchesSearch;
  });

  const filteredConferencesByYear = filteredConferences.reduce((acc, conf) => {
    const year = conf.date.split('-')[0];
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(conf);
    return acc;
  }, {});

  const filteredYears = Object.keys(filteredConferencesByYear).sort(
      (a, b) => b - a);

  // 발표 타입별 스타일
  const getTypeStyle = (type) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('keynote') || lowerType.includes('plenary')) {
      return {
        class: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
        icon: '🎤',
        priority: 1
      };
    } else if (lowerType.includes('invited')) {
      return {
        class: 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white',
        icon: '🌟',
        priority: 2
      };
    } else if (lowerType.includes('oral')) {
      return {
        class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        icon: '🗣️',
        priority: 3
      };
    } else if (lowerType.includes('poster')) {
      return {
        class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        icon: '📋',
        priority: 4
      };
    }
    return {
      class: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      icon: '📄',
      priority: 5
    };
  };

  // 월 파싱
  const formatDate = (dateStr) => {
    const [year, month] = dateStr.split('-');
    if (month) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return year;
  };

  if (loading) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 py-24">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading
                conferences...</p>
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
              Conference Presentations
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
              International speaking engagements and research presentations at
              premier scientific conferences
            </p>

            {/* 통계 정보 */}
            <div
                className="flex justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <div><span
                  className="font-semibold text-purple-600">{conferences.length}</span> Total
                Presentations
              </div>
              <div><span
                  className="font-semibold text-purple-600">{conferences.filter(
                  c => c.presentation_type.toLowerCase().includes('keynote')
                      || c.presentation_type.toLowerCase().includes(
                          'plenary')).length}</span> Keynote/Plenary
              </div>
              <div><span
                  className="font-semibold text-purple-600">{conferences.filter(
                  c => c.award).length}</span> Award Winning
              </div>
              <div><span
                  className="font-semibold text-purple-600">{years.length}</span> Years
                Active
              </div>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <input
                  type="text"
                  placeholder="Search conferences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {/* 연도 필터 */}
              <select
                  value={filters.year}
                  onChange={(e) => setFilters(
                      {...filters, year: e.target.value})}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Years</option>
                {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* 발표 타입 필터 */}
              <select
                  value={filters.type}
                  onChange={(e) => setFilters(
                      {...filters, type: e.target.value})}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Types</option>
                <option value="keynote">Keynote</option>
                <option value="plenary">Plenary</option>
                <option value="invited">Invited</option>
                <option value="oral">Oral</option>
                <option value="poster">Poster</option>
              </select>

              {/* 수상 필터 */}
              <select
                  value={filters.award}
                  onChange={(e) => setFilters(
                      {...filters, award: e.target.value})}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Presentations</option>
                <option value="award">Award Winners Only</option>
              </select>

              {/* 리셋 버튼 */}
              <button
                  onClick={() => {
                    setFilters({year: '', type: '', award: ''});
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Conferences 목록 (연도별 그룹) */}
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

                  {/* 해당 연도의 Conferences */}
                  <div className="space-y-6">
                    {filteredConferencesByYear[year]
                    .sort((a, b) => getTypeStyle(a.presentation_type).priority
                        - getTypeStyle(b.presentation_type).priority)
                    .map((conf, index) => {
                      const typeInfo = getTypeStyle(conf.presentation_type);

                      return (
                          <div
                              key={conf.id}
                              className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                          >
                            <div
                                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                              <div className="flex-1">
                                <div
                                    className="flex items-center gap-3 mb-4 flex-wrap">
                                  {/* 발표 타입 배지 */}
                                  <span
                                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${typeInfo.class}`}>
                              <span className="mr-2">{typeInfo.icon}</span>
                                    {conf.presentation_type}
                            </span>

                                  {/* 수상 배지 */}
                                  {conf.award && (
                                      <span
                                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                                🏆 {conf.award}
                              </span>
                                  )}

                                  {/* 날짜 */}
                                  <span
                                      className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {formatDate(conf.date)}
                            </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                                  {conf.title}
                                </h3>

                                <p className="text-purple-600 dark:text-purple-400 font-semibold text-lg mb-2">
                                  {conf.conference_name}
                                </p>

                                <div
                                    className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
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
                                  <span>{conf.location}</span>
                                </div>

                                {conf.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                      {conf.description}
                                    </p>
                                )}
                              </div>

                              {/* 오른쪽 액션 영역 */}
                              <div
                                  className="flex-shrink-0 flex flex-col items-end space-y-2">
                                <div className="text-right">
                                  <div
                                      className="text-3xl mb-2">{typeInfo.icon}</div>
                                  {conf.award && (
                                      <div className="text-2xl">🏆</div>
                                  )}
                                </div>
                                <button
                                    className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/30 transition-colors text-sm font-medium">
                                  <svg className="w-4 h-4 mr-2" fill="none"
                                       stroke="currentColor"
                                       viewBox="0 0 24 24">
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth={2}
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth={2}
                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                  </svg>
                                  Details
                                </button>
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
          {filteredConferences.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎤</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No conferences found matching your criteria.
                </p>
              </div>
          )}

          {/* 하단 통계 요약 */}
          <div className="mt-16 text-center">
            <div
                className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Conference Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {conferences.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Presentations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {conferences.filter(
                        c => c.presentation_type.toLowerCase().includes(
                                'keynote')
                            || c.presentation_type.toLowerCase().includes(
                                'plenary')).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Keynote/Plenary
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {conferences.filter(c => c.award).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Award Winners
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {new Set(conferences.map(
                        c => c.location.split(',').pop().trim())).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Countries
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Showing {filteredConferences.length} of {conferences.length} presentations
            </p>
          </div>
        </div>
      </div>
  );
}

export default ConferencesPage;
