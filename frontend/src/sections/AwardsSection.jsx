import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function AwardsSection() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/awards/')
    .then(res => res.json())
    .then(data => {
      // 최신 4개만 가져오기
      setAwards(data.slice(0, 4));
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching awards:', error);
      setLoading(false);
    });
  }, []);

  const getRankInfo = (rank) => {
    if (rank && (rank.toLowerCase().includes('1st')
        || rank.toLowerCase().includes('grand'))) {
      return {
        icon: '🏆',
        class: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      };
    } else if (rank && rank.toLowerCase().includes('2nd')) {
      return {
        icon: '🥈',
        class: 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
      };
    }
    return {
      icon: '🏅',
      class: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
    };
  };

  if (loading) {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading
                awards...</p>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 lg:px-8">
          {/* 섹션 헤더 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Awards & Recognition
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              International recognition and prestigious awards for contributions
              to nanophotonics research.
            </p>
          </div>

          {/* 어워드 그리드 */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {awards.map((award, index) => {
              const rankInfo = getRankInfo(award.rank);

              return (
                  <div
                      key={award.id}
                      className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Award 카드 헤더 */}
                    <div
                        className={`${rankInfo.class} p-4 text-center relative overflow-hidden`}>
                      <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="text-3xl mb-2">{rankInfo.icon}</div>
                      <p className="font-bold text-lg">
                        {award.rank || 'Award'} • {award.year}
                      </p>
                    </div>

                    {/* Award 카드 바디 */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {award.title}
                      </h3>

                      <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2">
                        {award.organization}
                      </p>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {award.location}
                      </p>

                      {award.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                            {award.description}
                          </p>
                      )}
                    </div>
                  </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
                to="/awards"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All Awards
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

export default AwardsSection;
