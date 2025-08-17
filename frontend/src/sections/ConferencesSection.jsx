import React, {useEffect, useState} from 'react';

function ConferencesSection() {
  const [conferences, setConferences] = useState([]);

  useEffect(() => {
    setConferences([
      {
        id: 1,
        conference: "International Conference on Nanophotonics 2023",
        title: "Revolutionary Metamaterial Architectures for Next-Generation Solar Harvesting",
        date: "2023-09-15",
        location: "Seoul, South Korea",
        type: "Keynote",
        attendees: "500+"
      },
      {
        id: 2,
        conference: "Photonic Materials and Devices Symposium",
        title: "Quantum Dot Engineering: From Theory to Commercial Applications",
        date: "2023-07-20",
        location: "Tokyo, Japan",
        type: "Invited",
        attendees: "300+"
      },
      {
        id: 3,
        conference: "Advanced Materials Research Conference",
        title: "Light-Matter Interactions in Engineered Nanostructures",
        date: "2023-05-12",
        location: "Berlin, Germany",
        type: "Oral",
        attendees: "250+"
      },
      {
        id: 4,
        conference: "POSTECH Annual Research Symposium",
        title: "Sustainable Energy Solutions through Photonic Crystal Innovation",
        date: "2023-03-08",
        location: "Pohang, South Korea",
        type: "Plenary",
        attendees: "400+"
      },
      {
        id: 5,
        conference: "IEEE Photonics Society Conference",
        title: "AI-Driven Optimization of Nanophotonic Device Performance",
        date: "2022-11-25",
        location: "San Francisco, USA",
        type: "Oral",
        attendees: "600+"
      }
    ]);
  }, []);

  const getTypeStyle = (type) => {
    const styles = {
      'Keynote': 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
      'Plenary': 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
      'Invited': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'Oral': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    };
    return styles[type]
        || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  return (
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          {/* 섹션 헤더 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Conferences & Presentations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              International speaking engagements and research presentations at
              premier scientific conferences.
            </p>
          </div>

          {/* 컨퍼런스 리스트 */}
          <div className="space-y-6">
            {conferences.map((conference, index) => (
                <div
                    key={conference.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-600 hover:shadow-xl transition-all duration-300"
                >
                  <div
                      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* 메인 콘텐츠 */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getTypeStyle(
                            conference.type)}`}>
                      {conference.type}
                    </span>
                        <span
                            className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {new Date(conference.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                        <span
                            className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                      {conference.attendees} attendees
                    </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {conference.title}
                      </h3>

                      <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2">
                        {conference.conference}
                      </p>

                      <div
                          className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none"
                             stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span className="text-sm">{conference.location}</span>
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex-shrink-0">
                      <button
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200">
                        <svg className="w-4 h-4 mr-2" fill="none"
                             stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}

export default ConferencesSection;
