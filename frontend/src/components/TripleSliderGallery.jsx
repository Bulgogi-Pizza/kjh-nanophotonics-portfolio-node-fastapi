import React, {useEffect, useState} from 'react';

function useSlideShow(images, interval = 4000) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  return currentIndex;
}

function TripleSliderGallery() {
  const sections = [
    {
      title: "Manufacturing",
      images: [
        {
          id: 1,
          src: "/images/manufacturing/nanoimprint-1.jpg",
          alt: "Nanoimprint Lithography Process"
        },
        {
          id: 2,
          src: "/images/manufacturing/photolithography-1.jpg",
          alt: "Photolithography Equipment"
        },
        {
          id: 3,
          src: "/images/manufacturing/imprinting-1.jpg",
          alt: "Photolithography + Imprinting"
        }
      ]
    },
    {
      title: "Design",
      images: [
        {
          id: 4,
          src: "/images/design/inverse-design-1.jpg",
          alt: "Inverse Design Methodology"
        },
        {
          id: 5,
          src: "/images/design/computational-imaging-1.jpg",
          alt: "Computational Imaging"
        },
        {
          id: 6,
          src: "/images/design/topology-optimization-1.jpg",
          alt: "Topology Optimization"
        }
      ]
    },
    {
      title: "Applications",
      images: [
        {
          id: 7,
          src: "/images/applications/vr-ar-device-1.jpg",
          alt: "VR/AR Device Applications"
        },
        {
          id: 8,
          src: "/images/applications/holography-1.jpg",
          alt: "Holographic Applications"
        },
        {
          id: 9,
          src: "/images/applications/quantum-optics-1.jpg",
          alt: "Lasing & Quantum Optics"
        }
      ]
    }
  ];

  return (
      <section
          className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
        <div className="container mx-auto px-6 lg:px-8">
          {/* 섹션 제목 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Research
            </h2>
          </div>

          {/* 3개 슬라이더 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {sections.map(({title, images}) => {
              const currentIndex = useSlideShow(images, 4000);

              return (
                  <div key={title} className="group">
                    {/* 섹션 타이틀 */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                      {title}
                    </h3>

                    {/* 이미지 슬라이더 */}
                    <div
                        className="relative h-60 rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800 group-hover:shadow-2xl transition-shadow duration-300">
                      {images.map((img, idx) => (
                          <div
                              key={img.id}
                              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                  idx === currentIndex
                                      ? 'opacity-100 scale-100 z-10'
                                      : 'opacity-0 scale-110 z-0'
                              }`}
                          >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                          </div>
                      ))}

                      {/* 이미지 위 텍스트 오버레이 */}
                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <p className="text-white text-sm font-medium bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                          {images[currentIndex]?.alt}
                        </p>
                      </div>
                    </div>

                    {/* 인디케이터 */}
                    <div className="flex justify-center space-x-3 mt-6">
                      {images.map((_, idx) => (
                          <button
                              key={idx}
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  idx === currentIndex
                                      ? 'bg-blue-600 scale-125'
                                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400'
                              }`}
                              aria-label={`${title} slide ${idx + 1}`}
                          />
                      ))}
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      </section>
  );
}

export default TripleSliderGallery;
