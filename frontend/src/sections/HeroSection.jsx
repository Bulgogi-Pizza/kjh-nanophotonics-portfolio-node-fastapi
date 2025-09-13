import React, {useCallback, useEffect, useState} from 'react';

function HeroSection() {
  const [representativeWorks, setRepresentativeWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  // API에서 데이터 로드
  useEffect(() => {
    fetch('/api/representative-works/')
    .then(res => res.json())
    .then(data => {
      setRepresentativeWorks(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching representative works:', error);
      setLoading(false);
    });
  }, []);

  // 자동 슬라이드 기능
  useEffect(() => {
    if (!isPlaying || representativeWorks.length === 0) {
      return;
    }

    const id = setInterval(() => {
      setCurrentIndex(
          prevIndex => (prevIndex + 1) % representativeWorks.length);
    }, 4000);

    setIntervalId(id);
    return () => clearInterval(id);
  }, [isPlaying, representativeWorks.length]);

  // 수동 슬라이드 제어
  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % representativeWorks.length);
  }, [representativeWorks.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prevIndex =>
        prevIndex === 0 ? representativeWorks.length - 1 : prevIndex - 1
    );
  }, [representativeWorks.length]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const currentWork = representativeWorks[currentIndex];

  if (loading) {
    return (
        <section className="relative min-h-screen flex items-center pt-16">
          <div
              className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20"></div>
          <div className="relative container mx-auto px-6 lg:px-8 py-20">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section
          className="relative min-h-[70vh] md:min-h-screen flex items-center pt-16">
        <div
            className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-9 gap-8 md:gap-16 items-center">

            {/* 좌측: 인삿말 섹션 */}
            <div className="space-y-5 md:space-y-8 lg:col-span-4">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                Welcome to <span
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Joohoon Kim's</span> Research
              </h1>
              <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                I am Ph.D. student at Pohang University of Science and
                Technology (POSTECH), working under the supervision of Prof.
                Junsuk Rho at the Nanoscale photonics & integrated
                manufacturing lab. My research focuses on innovating
                nanofabrication techniques for the scalable manufacturing of
                metasurfaces, with particular interest in their practical
                applications such as VR/AR, light-field displays, and optical
                computing.
              </p>
            </div>

            {/* 우측: 갤러리 및 논문 인용구 섹션 */}
            <div className="relative lg:col-span-5">
              {representativeWorks.length > 0 && currentWork && (
                  <div
                      className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800">
                    {/* 이미지 슬라이더 */}
                    {representativeWorks.map((work, index) => (
                        <div
                            key={work.id}
                            className={`absolute inset-0 transition-all duration-1000 ${
                                index === currentIndex
                                    ? 'opacity-100 scale-100'
                                    : 'opacity-0 scale-110'
                            }`}
                        >
                          <img
                              src={work.image_path}
                              alt={work.title}
                              className="w-full h-full object-cover"
                          />
                          <div
                              className="absolute inset-0"></div>
                        </div>
                    ))}

                    {/* 좌우 네비게이션 버튼 */}
                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-20"
                        aria-label="Previous slide"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor"
                           viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth={2} d="M15 19l-7-7 7-7"/>
                      </svg>
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-20"
                        aria-label="Next slide"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor"
                           viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>

                    {/* 재생/정지 버튼 */}
                    <button
                        onClick={togglePlayPause}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110 z-20"
                        aria-label={isPlaying ? "Pause slideshow"
                            : "Play slideshow"}
                    >
                      {isPlaying ? (
                          <svg className="w-6 h-6" fill="none"
                               stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth={2} d="M10 9v6m4-6v6"/>
                          </svg>
                      ) : (
                          <svg className="w-6 h-6" fill="none"
                               stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                          </svg>
                      )}
                    </button>

                    {/* 논문 인용구 오버레이 */}
                    <div
                        className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                      <div
                          className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <h3 className="text-lg font-bold mb-2">
                          {currentWork.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-blue-200">
                            <span
                                className="font-bold italic">{currentWork.journal}</span>
                            {currentWork.volume ? (
                                <span> {currentWork.volume}</span>
                            ) : (
                                <span></span>
                            )}
                            <span>, </span>
                            {currentWork.is_in_revision ? (
                                <span>In Revision</span>
                            ) : (
                                <span>{currentWork.pages} ({currentWork.year})</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* 갤러리 인디케이터 */}
              {representativeWorks.length > 0 && (
                  <div
                      className="flex justify-center space-x-2 md:space-x-3 mt-4 md:mt-6">
                    {representativeWorks.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'bg-blue-600 scale-125'
                                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                  </div>
              )}

            </div>
          </div>
        </div>
      </section>
  );
}

export default HeroSection;
