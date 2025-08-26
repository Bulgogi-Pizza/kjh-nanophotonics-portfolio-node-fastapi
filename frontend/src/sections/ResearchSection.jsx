import React from 'react';

function ResearchSection() {
  const researchItems = [
    {
      id: 1,
      title: "Design",
      icon: "/icons/Design.png",
    },
    {
      id: 2,
      title: "Manufacturing",
      icon: "/icons/Manufacturing.png",
    },
    {
      id: 3,
      title: "Applications",
      icon: "/icons/Applications.png",
    },
  ];

  return (
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 lg:px-8">
          {/* 섹션 제목 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Research
            </h2>
          </div>

          {/* 연구 주제 카드들 */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {researchItems.map(({id, title, icon}) => (
                <div
                    key={id}
                    className="group bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  {/* 아이콘 */}
                  <div className="mb-6 flex justify-center">
                    <div
                        className="w-30 h-30 rounded-xl flex items-center justify-center transition-colors duration-300">
                      <img
                          src={icon}
                          alt={`${title} icon`}
                          className="w-28 h-28 filter group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            // 아이콘 로드 실패 시 처리
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                      />
                      {/* 폴백 아이콘 (이모지) */}
                      <span
                          className="text-2xl hidden"
                          style={{display: 'none'}}
                      >
                    {title === 'Applications' && '🚀'}
                        {title === 'Design' && '⚡'}
                        {title === 'Manufacturing' && '🔬'}
                  </span>
                    </div>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                  </h3>

                  {/* 데코레이션 요소 */}
                  <div
                      className="mt-6 w-12 h-1 bg-blue-600 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}

export default ResearchSection;
