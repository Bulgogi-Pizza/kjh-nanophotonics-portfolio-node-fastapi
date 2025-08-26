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

  const handleExportMarkdown = () => {
    if (!activeDocument) {
      return;
    }

    window.open(`/api/cv-markdown/documents/${activeDocument.id}/export`,
        '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 py-24">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error
                Loading CV</h2>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                  onClick={loadActiveCV}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          <div className="container mx-auto px-6 py-24">
            <div className="text-center">
              <div className="text-gray-400 mb-8">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Curriculum Vitae
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                No CV document is currently available.
              </p>
              <button
                  onClick={loadActiveCV}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="container mx-auto px-6 py-12">

          {/* 헤더 (프린트 시 숨김) */}
          <div className="text-center mb-12 no-print">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Curriculum Vitae
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {activeDocument.title}
            </p>
            {activeDocument.description && (
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {activeDocument.description}
                </p>
            )}

            <div
                className="flex justify-center items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
              <span>Version {activeDocument.version}</span>
              <span>•</span>
              <span>Last updated: {formatDate(activeDocument.updated_at)}</span>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                  onClick={handleExportMarkdown}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Download Markdown
              </button>

              <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Print CV
              </button>
            </div>
          </div>

          {/* 마크다운 콘텐츠 */}
          <div className="max-w-4xl mx-auto">
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 print:shadow-none print:border-none print:rounded-none">

              <div className="p-8 print:p-0">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      // 커스텀 렌더링 컴포넌트
                      h1: ({node, ...props}) => (
                          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-blue-600" {...props} />
                      ),
                      h2: ({node, ...props}) => (
                          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4 text-blue-600" {...props} />
                      ),
                      h3: ({node, ...props}) => (
                          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mt-6 mb-3" {...props} />
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
                      blockquote: ({node, ...props}) => (
                          <blockquote
                              className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4" {...props} />
                      ),
                      code: ({node, inline, ...props}) => (
                          inline ?
                              <code
                                  className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm" {...props} />
                              :
                              <code
                                  className="block bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto" {...props} />
                      ),
                      a: ({node, ...props}) => (
                          <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />
                      ),
                      ul: ({node, ...props}) => (
                          <ul className="list-disc list-inside space-y-1 ml-4" {...props} />
                      ),
                      ol: ({node, ...props}) => (
                          <ol className="list-decimal list-inside space-y-1 ml-4" {...props} />
                      ),
                      li: ({node, ...props}) => (
                          <li className="text-gray-700 dark:text-gray-300" {...props} />
                      ),
                      hr: ({node, ...props}) => (
                          <hr className="my-8 border-gray-300 dark:border-gray-600" {...props} />
                      )
                    }}
                >
                  {activeDocument.content}
                </ReactMarkdown>
              </div>

              {/* 푸터 (프린트 시 숨김) */}
              <div
                  className="px-8 pb-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center no-print">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {formatDate(activeDocument.updated_at)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Generated from Markdown • Version {activeDocument.version}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 프린트 스타일 */}
        <style jsx>{`
          @media print {
            .no-print {
              display: none !important;
            }

            .cv-markdown {
              font-size: 12pt;
              line-height: 1.4;
            }

            .cv-markdown h1 {
              font-size: 18pt;
              margin-bottom: 12pt;
            }

            .cv-markdown h2 {
              font-size: 14pt;
              margin-top: 16pt;
              margin-bottom: 8pt;
            }

            .cv-markdown h3 {
              font-size: 12pt;
              margin-top: 12pt;
              margin-bottom: 6pt;
            }

            .cv-markdown p {
              margin-bottom: 8pt;
            }

            .cv-markdown ul, .cv-markdown ol {
              margin-bottom: 8pt;
            }
          }
        `}</style>
      </div>
  );
}

export default CVPage;
