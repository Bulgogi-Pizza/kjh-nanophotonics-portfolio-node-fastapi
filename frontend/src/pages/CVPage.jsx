import React from 'react';

function CVPage() {
  const education = [
    {
      degree: "Ph.D. in Electrical Engineering",
      institution: "POSTECH (Pohang University of Science and Technology)",
      year: "2021 - Present",
      description: "Specializing in nanophotonics and quantum optics under the supervision of Prof. [Advisor Name]"
    },
    {
      degree: "M.S. in Electrical Engineering",
      institution: "POSTECH",
      year: "2019 - 2021",
      description: "Thesis: Advanced Metamaterial Structures for Optical Applications"
    },
    {
      degree: "B.S. in Electrical Engineering",
      institution: "POSTECH",
      year: "2015 - 2019",
      description: "Summa Cum Laude, Department Honors"
    }
  ];

  const experience = [
    {
      position: "Research Assistant",
      organization: "POSTECH Nanophotonics Laboratory",
      year: "2019 - Present",
      description: "Leading research projects on metamaterial design and quantum dot engineering"
    },
    {
      position: "Teaching Assistant",
      organization: "POSTECH Department of Electrical Engineering",
      year: "2020 - 2022",
      description: "TA for Advanced Optics and Electromagnetic Theory courses"
    },
    {
      position: "Research Intern",
      organization: "Samsung Advanced Institute of Technology",
      year: "2018 Summer",
      description: "Internship focusing on next-generation display technologies"
    }
  ];

  const skills = [
    {
      category: "Research Areas",
      items: ["Nanophotonics", "Quantum Optics", "Metamaterials",
        "Photonic Crystals", "Plasmonics"]
    },
    {
      category: "Simulation Tools",
      items: ["COMSOL Multiphysics", "Lumerical FDTD", "CST Studio", "MATLAB",
        "Python"]
    },
    {
      category: "Fabrication",
      items: ["Electron Beam Lithography", "Reactive Ion Etching",
        "Thin Film Deposition", "Clean Room Operations"]
    },
    {
      category: "Characterization",
      items: ["SEM/TEM", "AFM", "Optical Spectroscopy", "Photoluminescence",
        "Ellipsometry"]
    }
  ];

  return (
      <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 py-12">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Curriculum Vitae
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Academic and professional background in nanophotonics research
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 교육 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-purple-600" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  Education
                </h2>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                      <div key={index}
                           className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                          <span
                              className="text-sm text-purple-600 dark:text-purple-400 font-medium">{edu.year}</span>
                        </div>
                        <p className="text-purple-600 dark:text-purple-400 font-medium mb-2">{edu.institution}</p>
                        <p className="text-gray-600 dark:text-gray-400">{edu.description}</p>
                      </div>
                  ))}
                </div>
              </section>

              {/* 경험 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-purple-600" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                  </svg>
                  Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                      <div key={index}
                           className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                          <span
                              className="text-sm text-purple-600 dark:text-purple-400 font-medium">{exp.year}</span>
                        </div>
                        <p className="text-purple-600 dark:text-purple-400 font-medium mb-2">{exp.organization}</p>
                        <p className="text-gray-600 dark:text-gray-400">{exp.description}</p>
                      </div>
                  ))}
                </div>
              </section>
            </div>

            {/* 사이드바 */}
            <div className="lg:col-span-1">
              {/* 스킬 */}
              <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
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
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{skillGroup.category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {skillGroup.items.map((skill, skillIndex) => (
                              <span
                                  key={skillIndex}
                                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                              >
                          {skill}
                        </span>
                          ))}
                        </div>
                      </div>
                  ))}
                </div>
              </section>

              {/* 다운로드 버튼 */}
              <div className="mt-8">
                <button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <svg className="w-5 h-5 inline mr-2" fill="none"
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Download PDF CV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default CVPage;
