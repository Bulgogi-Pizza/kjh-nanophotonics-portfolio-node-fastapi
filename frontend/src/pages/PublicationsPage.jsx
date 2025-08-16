import React, {useEffect, useState} from 'react';

function PublicationsPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/publications')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      setPublications(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching publications:', error);
      setError(error.message);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading
      publications...</div>;
  }
  if (error) {
    return <div
        className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">All
          Publications</h1>
        <div className="mt-10 space-y-8">
          {publications.map((pub) => (
              <article key={pub.id} className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{pub.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{pub.authors}</p>
                <p className="text-sm text-gray-500">{pub.journal}</p>
                <a href={`https://doi.org/${pub.doi}`} target="_blank"
                   rel="noopener noreferrer"
                   className="text-indigo-600 hover:underline">
                  View DOI
                </a>
              </article>
          ))}
        </div>
      </div>
  );
}

export default PublicationsPage;