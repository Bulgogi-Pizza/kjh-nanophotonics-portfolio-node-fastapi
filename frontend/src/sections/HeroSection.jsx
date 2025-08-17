import React, {useEffect, useState} from 'react';

function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);

  const dummyImages = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&crop=center'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % dummyImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
      <section className="relative min-h-screen flex items-center pt-16">
        {/* 배경 그라디언트 */}
        <div
            className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20"></div>

        <div className="relative container mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* 좌측 콘텐츠 */}
            <div className="space-y-8">
              {/* 배지 */}
              <div
                  className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                <div
                    className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                <span
                    className="text-sm font-medium">Nanophotonics Researcher</span>
              </div>

              {/* 제목 */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Welcome to{' '}
                  <span
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  JoohoonKim's
                </span>{' '}
                  Research
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Pioneering breakthrough research in nanophotonics and
                  engineering.
                  Exploring light-matter interactions at the nanoscale to
                  develop
                  next-generation optical technologies and sustainable energy
                  solutions.
                </p>
              </div>

              {/* CTA 버튼 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Explore Research
                </button>
                <button
                    className="px-8 py-4 border-2 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 font-semibold rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200">
                  View Publications
                </button>
              </div>

              {/* 연구 키워드 */}
              <div className="flex flex-wrap gap-3">
                {['Nanophotonics', 'Engineering', 'Optical Devices',
                  'Energy Solutions'].map((tag) => (
                    <span
                        key={tag}
                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                    >
                  {tag}
                </span>
                ))}
              </div>
            </div>

            {/* 우측 갤러리 */}
            <div className="relative">
              <div
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800">
                {dummyImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ${
                            index === currentImage
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-110'
                        }`}
                    >
                      <img
                          src={image}
                          alt={`Research ${index + 1}`}
                          className="w-full h-full object-cover"
                      />
                    </div>
                ))}

                {/* 오버레이 그라디언트 */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
              </div>

              {/* 갤러리 인디케이터 */}
              <div className="flex justify-center space-x-2 mt-6">
                {dummyImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentImage
                                ? 'bg-purple-600 dark:bg-purple-400 scale-125'
                                : 'bg-gray-300 dark:bg-gray-600 hover:bg-purple-400'
                        }`}
                    />
                ))}
              </div>

              {/* 장식 요소 */}
              <div
                  className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-xl"></div>
              <div
                  className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>
  );
}

export default HeroSection;
