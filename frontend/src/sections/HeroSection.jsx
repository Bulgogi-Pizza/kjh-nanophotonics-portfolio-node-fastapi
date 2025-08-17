// src/components/HeroSection.jsx
import React from 'react';
import {Link} from 'react-router-dom';
import TripleSliderGallery from '../components/TripleSliderGallery';

function HeroSection() {
  return (
      <>
        {/* 기존 Hero 섹션 */}
        <section className="relative min-h-screen flex items-center pt-16">
          <div
              className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20"></div>

          <div className="relative container mx-auto px-6 lg:px-8 py-20">
            <div className="text-center">
              {/* 배지 */}
              <div
                  className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-8">
                <div
                    className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                <span
                    className="text-sm font-medium">Nanophotonics Researcher</span>
              </div>

              {/* 제목 */}
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-8">
                Welcome to{' '}
                <span
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                JoohoonKim's
              </span>{' '}
                Research
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto mb-12">
                Pioneering breakthrough research in nanophotonics and
                metamaterials.
                Exploring light-matter interactions at the nanoscale to develop
                next-generation optical technologies and sustainable energy
                solutions.
              </p>

              {/* CTA 버튼 */}
              <div
                  className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                    to="/publications"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                >
                  View Publications
                </Link>
                <Link
                    to="/cv"
                    className="px-8 py-4 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-center"
                >
                  Download CV
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 새로운 3개 슬라이더 갤러리 */}
        <TripleSliderGallery/>
      </>
  );
}

export default HeroSection;
