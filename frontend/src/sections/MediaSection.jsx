import React, {useEffect, useState} from 'react';

// 이 컴포넌트는 이전에 만든 PublicationsPage의 로직을 그대로 가져옵니다.
function MediaSection() {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/medias')
    .then((res) => res.json())
    .then((data) => {
      setMedias(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Loading medias...</p>;
  }

  return (
      <div id="medias" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Medias</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              My recent medias.
            </p>
          </div>
          <div
              className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {medias.slice(0, 3).map((media) => ( // 예시로 3개만 보여주기
                <article key={media.id}
                         className="flex max-w-xl flex-col items-start justify-between">
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      {media.title}
                    </h3>
                  </div>
                </article>
            ))}
          </div>
        </div>
      </div>
  );
}

export default MediaSection;