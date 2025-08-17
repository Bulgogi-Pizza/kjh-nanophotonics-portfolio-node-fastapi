import React, {useEffect, useState} from 'react';

function PublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: '',
    contribution: '',
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
    if (filters.contribution) {
      queryParams.append('contribution',
          filters.contribution);
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

  const contributionOptions = [
    {value: '', label: 'All Contributions'},
    {value: 'first-author', label: 'First Author'},
    {value: 'corresponding', label: 'Corresponding Author'},
    {value: 'equal-contribution', label: 'Equal Contribution'},
    {value: 'co-author', label: 'Co-author'}
  ];

  const statusOptions = [
    {value: '', label: 'All Status'},
    {value: 'published', label: 'Published'},
    {value: 'under-submission', label: 'Under Submission'},
    {value: 'in-press', label: 'In Press'},
    {value: 'in-review', label: 'In Review'}
  ];

  const getContributionBadge = (pub) => {
    if (pub.is_first_author) {
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    } else if (pub.is_corresponding_author) {
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
    } else if (pub.is_equal_contribution) {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'published': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'under-submission': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      'in-press': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'in-review': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    };
    return badges[status]
        || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  if (loading) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 py-24">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading
                publications...</p>
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
              Publications
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
              Full list of research publications in nanophotonics and
              engineering
            </p>

            {/* 통계 정보 */}
            <div
                className="flex justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <div><span
                  className="font-semibold text-purple-600">{stats.total}</span> Total
                Papers
              </div>
              <div><span
                  className="font-semibold text-purple-600">{stats.first_author}</span> First
                Author
              </div>
              <div><span
                  className="font-semibold text-purple-600">{stats.corresponding}</span> Corresponding
              </div>
              <div><span
                  className="font-semibold text-purple-600">{stats.under_submission}</span> Under
                Review
              </div>
            </div>
          </div>

          {/* 필터 및 검색 */}
          <div className="mb-8 space-y-4">
            {/* 검색바 */}
            <div className="relative max-w-md mx-auto">
              <input
                  type="text"
                  placeholder="Search publications..."
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

            {/* 필터 버튼들 */}
            <div className="flex flex-wrap justify-center gap-4">
              {/* 연도 필터 */}
              <select
                  value={filters.year}
                  onChange={(e) => setFilters(
                      {...filters, year: e.target.value})}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Years</option>
                {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* 기여도 필터 */}
              <select
                  value={filters.contribution}
                  onChange={(e) => setFilters(
                      {...filters, contribution: e.target.value})}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                {contributionOptions.map(option => (
                    <option key={option.value}
                            value={option.value}>{option.label}</option>
                ))}
              </select>

              {/* 상태 필터 */}
              <select
                  value={filters.status}
                  onChange={(e) => setFilters(
                      {...filters, status: e.target.value})}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                {statusOptions.map(option => (
                    <option key={option.value}
                            value={option.value}>{option.label}</option>
                ))}
              </select>

              {/* 필터 리셋 */}
              <button
                  onClick={() => {
                    setFilters({year: '', contribution: '', status: ''});
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* 논문 목록 */}
          <div className="space-y-4">
            {filteredPublications.map((pub) => (
                <article
                    key={pub.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all duration-300"
                >
                  <div
                      className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        {/* 논문 번호 */}
                        <span
                            className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
                      #{pub.number}
                    </span>

                        {/* 기여도 배지 */}
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getContributionBadge(
                                pub)}`}>
                      {pub.contribution_type.replace('-', ' ').replace(/\b\w/g,
                          l => l.toUpperCase())}
                    </span>

                        {/* 상태 배지 */}
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                pub.status)}`}>
                      {pub.status.replace('-', ' ').replace(/\b\w/g,
                          l => l.toUpperCase())}
                    </span>

                        {/* 연도 */}
                        <span
                            className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {pub.year}{pub.month && ` (${pub.month})`}
                    </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors leading-tight">
                        {pub.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        <span
                            className="font-medium">Authors:</span> {pub.authors}
                      </p>

                      <div
                          className="flex flex-wrap items-center gap-4 text-sm mb-3">
                        <p className="text-purple-600 dark:text-purple-400 font-semibold">
                          {pub.journal}
                        </p>
                        {pub.volume && (
                            <p className="text-gray-600 dark:text-gray-400">
                              <span
                                  className="font-medium">Vol.</span> {pub.volume}
                            </p>
                        )}
                        {pub.pages && (
                            <p className="text-gray-600 dark:text-gray-400">
                              <span
                                  className="font-medium">Pages:</span> {pub.pages}
                            </p>
                        )}
                      </div>

                      {pub.featured_info && (
                          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                            🌟 {pub.featured_info}
                          </p>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {pub.doi && (
                            <a
                                href={`https://doi.org/${pub.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none"
                                   stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth={2}
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                              </svg>
                              View DOI
                            </a>
                        )}
                        {pub.arxiv && (
                            <a
                                href={`https://arxiv.org/abs/${pub.arxiv}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none"
                                   stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                              </svg>
                              arXiv
                            </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
            ))}
          </div>

          {filteredPublications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No publications
                  found matching your criteria.</p>
              </div>
          )}

          {/* 결과 카운트 */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredPublications.length} of {publications.length} publications
            </p>
          </div>
        </div>
      </div>
  );
}

export default PublicationsPage;
