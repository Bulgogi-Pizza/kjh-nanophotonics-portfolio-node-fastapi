import React, {useEffect, useState} from 'react';

function ResearchSection() {
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/researches')
    .then((res) => res.json())
    .then((data) => {
      setResearches(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Loading Researches...</p>;
  }

  return (
      <div id="researches" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Researches</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              My recent researches.
            </p>
          </div>
          <div
              className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {researches.slice(0, 3).map((research) => ( // 예시로 3개만 보여주기
                <article key={research.id}
                         className="flex max-w-xl flex-col items-start justify-between">
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      {research.title}
                    </h3>
                  </div>
                </article>
            ))}
          </div>
        </div>
      </div>
  );
}

export default ResearchSection;