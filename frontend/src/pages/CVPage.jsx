import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

function CVPage() {
  const [activeDocument, setActiveDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadActiveCV();
  }, []);

  const loadActiveCV = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/cv-markdown/documents/active');
      if (!response.ok) {
        if (response.status === 404) {
          setActiveDocument(null);
          setLoading(false);
          return;
        }
        throw new Error('Failed to load active CV');
      }

      const activeDoc = await response.json();
      setActiveDocument(activeDoc);

    } catch (error) {
      console.error('Error loading CV:', error);
      setError('Failed to load CV document');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-8 py-24">
            <div className="text-center">
              <div
                  className="animate-spin h-8 w-8 border-2 border-t-transparent border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-8 py-24">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Error Loading CV
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <button
                  onClick={loadActiveCV}
                  className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
    );
  }

  if (!activeDocument) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-8 py-24">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-8">
                CV
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                No CV document is currently available.
              </p>
              <button
                  onClick={loadActiveCV}
                  className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                Check Again
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-8 py-16 max-w-7xl">

          {/* 페이지 헤더 */}
          <div className="mb-12 text-center">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-8">
              CV
            </h1>
          </div>

          {/* CV 콘텐츠 */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 shadow-sm">
              <div className="px-12 py-16">
                <div
                    className="prose prose-lg dark:prose-invert max-w-none cv-content">
                  <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        h1: ({node, ...props}) => (
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 pb-4 border-b border-gray-200 dark:border-gray-700" {...props} />
                        ),
                        h2: ({node, ...props}) => (
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6" {...props} />
                        ),
                        h3: ({node, ...props}) => (
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4" {...props} />
                        ),
                        p: ({node, ...props}) => (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props} />
                        ),
                        ul: ({node, ...props}) => (
                            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300 mb-6" {...props} />
                        ),
                        ol: ({node, ...props}) => (
                            <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300 mb-6" {...props} />
                        ),
                        li: ({node, ...props}) => (
                            <li className="text-gray-700 dark:text-gray-300" {...props} />
                        ),
                        strong: ({node, ...props}) => (
                            <strong
                                className="font-semibold text-gray-900 dark:text-white" {...props} />
                        ),
                        a: ({node, ...props}) => (
                            <a className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium" {...props} />
                        ),
                        blockquote: ({node, ...props}) => (
                            <blockquote
                                className="border-l-4 border-blue-600 pl-6 italic text-gray-600 dark:text-gray-400 my-6" {...props} />
                        ),
                        hr: ({node, ...props}) => (
                            <hr className="my-8 border-gray-200 dark:border-gray-700" {...props} />
                        ),
                        table: ({node, ...props}) => (
                            <div className="overflow-x-auto my-6">
                              <table
                                  className="min-w-full border border-gray-300 dark:border-gray-600" {...props} />
                            </div>
                        ),
                        th: ({node, ...props}) => (
                            <th className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 font-semibold text-left" {...props} />
                        ),
                        td: ({node, ...props}) => (
                            <td className="px-4 py-2 border border-gray-300 dark:border-gray-600" {...props} />
                        ),
                        code: ({node, inline, ...props}) => (
                            inline ?
                                <code
                                    className="bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm font-mono" {...props} />
                                :
                                <code
                                    className="block bg-gray-100 dark:bg-gray-700 p-4 text-sm font-mono overflow-x-auto mb-6" {...props} />
                        )
                      }}
                  >
                    {activeDocument.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated 정보 */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date(
                activeDocument.updated_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            </p>
          </div>
        </div>
      </div>
  );
}

export default CVPage;
