import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function PublicationsSection() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API 호출 시뮬레이션
    setTimeout(() => {
      setPublications([
        {
          id: 1,
          title: "Enhanced Light-Matter Interactions in Nanophotonic Structures for Solar Energy Applications",
          authors: "J. Kim, S. Lee, H. Park, M. Choi",
          journal: "Nature Photonics",
          year: "2023",
          doi: "10.1038/s41566-023-01234-5",
          impact: "High Impact"
        },
        {
          id: 2,
          title: "Novel Quantum Dot Engineering Approaches for Next-Generation Display Technologies",
          authors: "J. Kim, D. Kim, Y. Shin",
          journal: "Science",
          year: "2023",
          doi: "10.1126/science.abcd1234",
          impact: "High Impact"
        },
        {
          id: 3,
          title: "Metamaterial-Based Optical Devices for Efficient Energy Harvesting Systems",
          authors: "J. Kim, J. Lee, K. Park",
          journal: "Advanced Materials",
          year: "2023",
          doi: "10.1002/adma.202301234",
          impact: "High Impact"
        },
        {
          id: 4,
          title: "Theoretical Framework for Optimizing Plasmonic Nanostructures in Biosensing",
          authors: "J. Kim, R. Smith, L. Chen",
          journal: "ACS Nano",
          year: "2022",
          doi: "10.1021/acsnano.2c01234",
          impact: "Medium Impact"
        },
        {
          id: 5,
          title: "Photonic Crystal Design for Enhanced Light Trapping in Thin-Film Solar Cells",
          authors: "J. Kim, T. Wang, S. Kumar",
          journal: "Optics Express",
          year: "2022",
          doi: "10.1364/OE.451234",
          impact: "Medium Impact"
        },
        {
          id: 6,
          title: "Machine Learning Approaches to Nanophotonic Device Optimization",
          authors: "J. Kim, A. Johnson, P. Martinez",
          journal: "Nature Communications",
          year: "2022",
          doi: "10.1038/s41467-022-01234-5",
          impact: "High Impact"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
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
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Cutting-edge research contributions in nanophotonics, published in
              top-tier international journals.
            </p>
          </div>

          {/* 출판물 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {publications.map((pub, index) => (
                <article
                    key={pub.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* 임팩트 배지 */}
                  <div className="flex justify-between items-start mb-4">
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

                  {/* 제목 */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {pub.title}
                  </h3>

                  {/* 저자 */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {pub.authors}
                  </p>

                  {/* 저널 */}
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-4">
                    {pub.journal}
                  </p>

                  {/* DOI 링크 */}
                  <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm group/link"
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
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </a>
                </article>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
                to="/publications"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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
