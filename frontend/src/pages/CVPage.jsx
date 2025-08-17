import React, {useEffect, useState} from 'react';

function CVPage() {
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/education/'),
      fetch('/api/experience/')
    ])
    .then(([eduRes, expRes]) => Promise.all([eduRes.json(), expRes.json()]))
    .then(([eduData, expData]) => {
      setEducation(eduData);
      setExperience(expData);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching CV ', error);
      setError('Failed to load CV data');
      setLoading(false);
    });
  }, []);

  // 정적 스킬 데이터 (나중에 API로 대체 가능)
  const skills = [
    {
      category: "Research Areas",
      items: [
        "Nanophotonics", "Metamaterials", "Metasurfaces", "Photonic Crystals",
        "Plasmonics", "Holography", "Optical Devices", "Quantum Optics"
      ]
    },
    {
      category: "Simulation & Design",
      items: [
        "COMSOL Multiphysics", "Lumerical FDTD", "CST Studio Suite",
        "MATLAB", "Python", "Inverse Design"
      ]
    },
    {
      category: "Fabrication & Processing",
      items: [
        "Nanoimprint Lithography", "Electron Beam Lithography",
        "Atomic Layer Deposition", "Sol-gel Processing", "Clean Room Operations"
      ]
    },
    {
      category: "Characterization",
      items: [
        "SEM/TEM", "AFM", "Optical Spectroscopy", "Ellipsometry",
        "Photoluminescence", "UV-Vis Spectroscopy"
      ]
    }
  ];

  const professionalServices = [
    {
      category: "Proposal Review",
      items: [
        "Israeli Ministry of Innovation, Science and Technology"
      ]
    },
    {
      category: "Journal Reviewer",
      items: [
        "Nature Communications", "Light: Science & Applications", "Optica",
        "ACS Photonics", "Nanophotonics", "Communications Physics",
        "Scientific Reports", "Optics Express", "Optics Letters",
        "Optics and Laser Technology", "Nanomaterials", "Displays"
      ]
    }
  ];

  if (loading) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 py-24">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading CV...</p>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 py-24">
            <div className="text-center">
              <p className="text-red-500">{error}</p>
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
              Curriculum Vitae
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Academic and professional background in nanophotonics and
              metamaterials research
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 메인 콘텐츠 (2/3) */}
            <div className="lg:col-span-2 space-y-12">

              {/* 교육 섹션 */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                  <div
                      className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                  Education
                </h2>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                      <div key={edu.id || index}
                           className="relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300">
                        {/* 연결선 (마지막 아이템 제외) */}
                        {index < education.length - 1 && (
                            <div
                                className="absolute left-8 top-full w-0.5 h-6 bg-gradient-to-b from-purple-600 to-indigo-600"></div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {edu.degree}
                            </h3>
                            <p className="text-purple-600 dark:text-purple-400 font-semibold text-lg mb-1">
                              {edu.institution}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 mb-2">
                              {edu.location}
                            </p>
                            {edu.advisor && (
                                <p className="text-gray-600 dark:text-gray-400">
                                  <span
                                      className="font-medium">Advisor:</span> {edu.advisor}
                                </p>
                            )}
                            {edu.description && (
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                  {edu.description}
                                </p>
                            )}
                          </div>
                          <div className="ml-4">
                        <span
                            className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
                          {edu.start_year} - {edu.end_year}
                        </span>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </section>

              {/* 경험 섹션 */}
              <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                  <div
                      className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                    </svg>
                  </div>
                  Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                      <div key={exp.id || index}
                           className="relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300">
                        {/* 연결선 (마지막 아이템 제외) */}
                        {index < experience.length - 1 && (
                            <div
                                className="absolute left-8 top-full w-0.5 h-6 bg-gradient-to-b from-indigo-600 to-purple-600"></div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {exp.position}
                            </h3>
                            <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg mb-1">
                              {exp.organization}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 mb-2">
                              {exp.location}
                            </p>
                            {exp.host_advisor && (
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                  <span
                                      className="font-medium">Host:</span> {exp.host_advisor}
                                </p>
                            )}
                            {exp.description && (
                                <p className="text-gray-600 dark:text-gray-400">
                                  {exp.description}
                                </p>
                            )}
                          </div>
                          <div className="ml-4">
                        <span
                            className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
                          {exp.start_year} - {exp.end_year}
                        </span>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </section>
            </div>

            {/* 사이드바 (1/3) */}
            <div className="lg:col-span-1 space-y-8">

              {/* Skills & Expertise */}
              <div
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-purple-600" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  Skills & Expertise
                </h2>
                <div className="space-y-6">
                  {skills.map((skillGroup, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          {skillGroup.category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skillGroup.items.map((skill, skillIndex) => (
                              <span
                                  key={skillIndex}
                                  className="px-3 py-1.5 bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-600 rounded-full text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                              >
                          {skill}
                        </span>
                          ))}
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Professional Services */}
              <div
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-indigo-600" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  Professional Services
                </h2>
                <div className="space-y-4">
                  {professionalServices.map((service, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {service.category}
                        </h3>
                        <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                          {service.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start">
                                <span
                                    className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {item}
                              </li>
                          ))}
                        </ul>
                      </div>
                  ))}
                </div>
              </div>

              {/* Download CV Button */}
              <div className="text-center">
                <button
                    onClick={() => window.open('/cv/JoohoonKim_CV.pdf',
                        '_blank')}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Download Full CV (PDF)
                </button>
              </div>

              {/* Contact Info */}
              <div
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Contact
                </h3>
                <div
                    className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    joohoonkim@postech.ac.kr
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    POSTECH, Pohang, South Korea
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default CVPage;
