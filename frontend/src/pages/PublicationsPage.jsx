import React, {useEffect, useState} from 'react';

function PublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/publications')
    .then(res => res.json())
    .then(data => {
      setPublications(data);
      setLoading(false);
    })
    .catch(() => {
      // 더미 데이터
      setPublications([
        {
          id: 1,
          title: "Enhanced Light-Matter Interactions in Nanophotonic Structures for Solar Energy Applications",
          authors: "J. Kim, S. Lee, H. Park, M. Choi",
          journal: "Nature Photonics",
          year: "2023",
          doi: "10.1038/s41566-023-01234-5",
          category: "journal",
          impact: "High Impact",
          abstract: "We demonstrate novel nanophotonic structures that enhance light-matter interactions for improved solar energy harvesting efficiency."
        },
        {
          id: 2,
          title: "Quantum Dot Engineering for Next-Generation Display Technologies",
          authors: "J. Kim, D. Kim, Y. Shin",
          journal: "Science",
          year: "2023",
          doi: "10.1126/science.abcd1234",
          category: "journal",
          impact: "High Impact",
          abstract: "Revolutionary quantum dot engineering approaches enabling unprecedented display performance and color accuracy."
        },
        {
          id: 3,
          title: "Metamaterial-Based Optical Devices for Energy Harvesting",
          authors: "J. Kim, J. Lee, K. Park",
          journal: "Advanced Materials",
          year: "2023",
          doi: "10.1002/adma.202301234",
          category: "journal",
          impact: "High Impact",
          abstract: "Novel metamaterial architectures designed for efficient energy harvesting applications."
        },
        {
          id: 4,
          title: "Machine Learning Approaches to Nanophotonic Device Optimization",
          authors: "J. Kim, A. Johnson, P. Martinez",
          journal: "Nature Communications",
          year: "2022",
          doi: "10.1038/s41467-022-01234-5",
          category: "journal",
          impact: "High Impact",
          abstract: "AI-driven optimization techniques for advanced nanophotonic device design and performance enhancement."
        },
        {
          id: 5,
          title: "Theoretical Framework for Plasmonic Nanostructures",
          authors: "J. Kim, R. Smith, L. Chen",
          journal: "ACS Nano",
          year: "2022",
          doi: "10.1021/acsnano.2c01234",
          category: "journal",
          impact: "Medium Impact",
          abstract: "Comprehensive theoretical analysis of plasmonic nanostructures for biosensing applications."
        }
      ]);
      setLoading(false);
    });
  }, []);

  const filteredPublications = publications.filter(pub => {
    const matchesFilter = filter === 'all' || pub.category === filter;
    const matchesSearch = pub.title.toLowerCase().includes(
            searchTerm.toLowerCase()) ||
        pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive list of research publications in nanophotonics and
              engineering
            </p>
          </div>

          {/* 필터 및 검색 */}
          <div
              className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2">
              {['all', 'journal', 'conference', 'preprint'].map(
                  (filterType) => (
                      <button
                          key={filterType}
                          onClick={() => setFilter(filterType)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              filter === filterType
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                          }`}
                      >
                        {filterType === 'all' ? 'All' : filterType.charAt(
                            0).toUpperCase() + filterType.slice(1)}
                      </button>
                  ))}
            </div>

            <div className="relative">
              <input
                  type="text"
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          {/* 출판물 목록 */}
          <div className="space-y-6">
            {filteredPublications.map((pub) => (
                <article
                    key={pub.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all duration-300"
                >
                  <div
                      className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            pub.impact === 'High Impact'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                      {pub.impact}
                    </span>
                        <span
                            className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {pub.year}
                    </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        {pub.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        <span
                            className="font-medium">Authors:</span> {pub.authors}
                      </p>

                      <p className="text-purple-600 dark:text-purple-400 font-semibold mb-3">
                        {pub.journal}
                      </p>

                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                        {pub.abstract}
                      </p>

                      <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none"
                             stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        View Publication
                      </a>
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
        </div>
      </div>
  );
}

export default PublicationsPage;
