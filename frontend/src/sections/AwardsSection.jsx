import React, {useEffect, useState} from 'react';

function AwardsSection() {
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    setAwards([
      {
        id: 1,
        title: "Outstanding Research Achievement Award",
        organization: "Korean Physical Society",
        year: "2023",
        description: "Recognition for groundbreaking contributions to nanophotonics research and innovative optical device development.",
        image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=250&fit=crop&crop=center"
      },
      {
        id: 2,
        title: "Young Scientist Excellence Award",
        organization: "POSTECH",
        year: "2022",
        description: "Excellence in engineering applications of advanced photonic materials and quantum optical systems.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center"
      },
      {
        id: 3,
        title: "Best Paper Award",
        organization: "International Conference on Nanophotonics",
        year: "2022",
        description: "Outstanding research contribution in metamaterial design for sustainable energy applications.",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop&crop=center"
      },
      {
        id: 4,
        title: "Research Excellence Grant",
        organization: "National Research Foundation of Korea",
        year: "2021",
        description: "Competitive funding awarded for pioneering nanophotonic device development and commercialization.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop&crop=center"
      }
    ]);
  }, []);

  return (
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 lg:px-8">
          {/* 섹션 헤더 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Awards & Recognition
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              International recognition and prestigious awards for contributions
              to nanophotonics research.
            </p>
          </div>

          {/* 어워드 그리드 */}
          <div className="grid md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
                <div
                    key={award.id}
                    className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="md:flex">
                    {/* 이미지 */}
                    <div className="md:w-2/5 relative overflow-hidden">
                      <img
                          src={award.image}
                          alt={award.title}
                          className="w-full h-48 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div
                          className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20"></div>
                    </div>

                    {/* 콘텐츠 */}
                    <div className="md:w-3/5 p-6 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-3">
                    <span
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                      {award.year}
                    </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {award.title}
                      </h3>

                      <p className="text-purple-600 dark:text-purple-400 font-semibold mb-3">
                        {award.organization}
                      </p>

                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {award.description}
                      </p>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}

export default AwardsSection;
