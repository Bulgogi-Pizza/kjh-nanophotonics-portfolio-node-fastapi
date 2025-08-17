import React from 'react';
// 1. react-icons 라이브러리에서 아이콘을 가져옵니다. (https://react-icons.github.io/react-icons/)
import {FaAtom, FaFlask, FaHeartbeat, FaMicrochip} from 'react-icons/fa';

const researchTopics = [
  {name: 'Nanoparticle Synthesis', icon: <FaFlask size={40}/>},
  {name: 'Biomedical Applications', icon: <FaHeartbeat size={40}/>},
  {name: 'Energy & Catalyst Applications', icon: <FaAtom size={40}/>},
  {name: 'Soft Electronics Applications', icon: <FaMicrochip size={40}/>},
];

function ResearchSection() {
  return (
      <div id="research" className="py-24 bg-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Research</h2>
          <div
              className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchTopics.map((topic) => (
                <div key={topic.name}
                     className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
                  <div className="text-blue-600 mb-4">{topic.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800">{topic.name}</h3>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

export default ResearchSection;