import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";

// 이 컴포넌트는 이전에 만든 PublicationsPage의 로직을 그대로 가져옵니다.
function PublicationsSection() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/publications')
    .then((res) => res.json())
    .then((data) => {
      setPublications(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Loading publications...</p>;
  }

  return (
      <div id="publications" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Publications</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              My recent academic contributions.
            </p>
          </div>
          <div
              className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {publications.slice(0, 3).map((pub) => ( // 예시로 3개만 보여주기
                <article key={pub.id}
                         className="flex max-w-xl flex-col items-start justify-between">
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <a href={`https://doi.org/${pub.doi}`} target="_blank"
                         rel="noopener noreferrer">
                        <span className="absolute inset-0"/>
                        {pub.title}
                      </a>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{pub.authors}</p>
                    <p className="text-sm text-gray-500">{pub.journal}</p>
                  </div>
                </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/publications"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
              View All Publications
            </Link>
          </div>

        </div>
      </div>
  );
}

export default PublicationsSection;