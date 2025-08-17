import React, {useEffect, useState} from 'react';

function MediaSection() {
  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    setMediaItems([
      {
        id: 1,
        title: "Revolutionary Nanophotonics Breakthrough Promises Clean Energy Future",
        source: "Nature Research",
        date: "2023-08-15",
        category: "Research Highlight",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop&crop=center",
        excerpt: "POSTECH researcher develops groundbreaking metamaterial technology that could revolutionize solar energy harvesting with unprecedented efficiency rates.",
        link: "#"
      },
      {
        id: 2,
        title: "Young Scientist Receives International Recognition for Quantum Optics Innovation",
        source: "Science Magazine",
        date: "2023-06-20",
        category: "Award News",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=300&fit=crop&crop=center",
        excerpt: "JoohoonKim's pioneering work in quantum dot engineering earns prestigious international scientific award.",
        link: "#"
      },
      {
        id: 3,
        title: "Next-Generation Optical Devices: From Lab to Commercial Reality",
        source: "IEEE Spectrum",
        date: "2023-04-10",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop&crop=center",
        excerpt: "Breakthrough research in nanophotonics paves the way for commercial applications in telecommunications and computing.",
        link: "#"
      },
      {
        id: 4,
        title: "Korean Researcher's Work Featured in Top-Tier Scientific Journal",
        source: "Research Korea",
        date: "2023-02-28",
        category: "Publication",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop&crop=center",
        excerpt: "Latest publication in Nature Photonics showcases innovative approaches to light-matter interaction control.",
        link: "#"
      },
      {
        id: 5,
        title: "Industry Partnership Accelerates Nanophotonics Commercialization",
        source: "TechCrunch Korea",
        date: "2022-12-15",
        category: "Industry",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop&crop=center",
        excerpt: "Strategic collaboration with leading technology companies brings cutting-edge research closer to market applications.",
        link: "#"
      },
      {
        id: 6,
        title: "Future of Sustainable Technology: Insights from Leading Researcher",
        source: "Green Tech Media",
        date: "2022-10-05",
        category: "Interview",
        image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=500&h=300&fit=crop&crop=center",
        excerpt: "Exclusive interview discussing the role of nanophotonics in addressing global environmental challenges.",
        link: "#"
      }
    ]);
  }, []);

  const getCategoryStyle = (category) => {
    const styles = {
      'Research Highlight': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      'Award News': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      'Technology': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'Publication': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'Industry': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
      'Interview': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
    };
    return styles[category]
        || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  return (
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 lg:px-8">
          {/* 섹션 헤더 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Media & Press Coverage
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Featured stories and media coverage highlighting breakthrough
              research and scientific achievements.
            </p>
          </div>

          {/* 미디어 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaItems.map((item, index) => (
                <article
                    key={item.id}
                    className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* 이미지 */}
                  <div className="aspect-video overflow-hidden relative">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                  <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryStyle(
                          item.category)}`}>
                    {item.category}
                  </span>
                    </div>
                  </div>

                  {/* 콘텐츠 */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                  <span
                      className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {item.source}
                  </span>
                      <time
                          className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                      {item.excerpt}
                    </p>

                    <a
                        href={item.link}
                        className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-sm group/link"
                    >
                      Read Full Article
                      <svg
                          className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  </div>
                </article>
            ))}
          </div>

          {/* 더 보기 버튼 */}
          <div className="text-center mt-12">
            <button
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              View All Media Coverage
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
  );
}

export default MediaSection;
