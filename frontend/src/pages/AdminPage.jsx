// AdminPage.jsx
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import RepresentativeWorksTab from "./admin/RepresentativeWorksTab.jsx";
import ResearchAreasTab from "./admin/ResearchAreasTab.jsx";
import PublicationsTab from "./admin/PublicationsTab.jsx";
import CoverArtsTab from "./admin/CoverArtsTab.jsx";
import ResearchHighlightsTab from "./admin/ResearchHighlightsTab.jsx";

function AdminPage() {
  const [representativeWorks, setRepresentativeWorks] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [researchAreas, setResearchAreas] = useState([]);
  const [researchHighlights, setResearchHighlights] = useState([]);
  const [coverArts, setCoverArts] = useState([]);
  const [activeTab, setActiveTab] = useState('representative-works');
  const [loading, setLoading] = useState(true);

  // 인증 상태
  const [authed, setAuthed] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loginForm, setLoginForm] = useState({username: "", password: ""});

  // 공통 fetch 헬퍼 (쿠키 포함 + 401 처리)
  const fetchJSON = async (url, opts = {}) => {
    const res = await fetch(url, {credentials: 'include', ...opts});
    if (res.status === 401) {
      setAuthed(false);
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  };

  // 데이터를 전부 다시 불러오는 함수
  const loadData = async () => {
    setLoading(true);
    try {
      const [works, images, areas, highlights, covers] = await Promise.all(
          [
            fetchJSON('/api/representative-works/?active_only=false'),
            fetchJSON('/api/representative-works/gallery/?active_only=false'),
            fetchJSON('/api/research-areas/?active_only=false'),
            fetchJSON('/api/research-highlights/?active_only=false'),
            fetchJSON('/api/cover-arts/?active_only=false'),
          ]);
      setRepresentativeWorks(works);
      setGalleryImages(images);
      setResearchAreas(areas);
      setResearchHighlights(highlights);
      setCoverArts(covers);
    } catch (e) {
      console.error('Error loading', e);
    } finally {
      setLoading(false);
    }
  };

  // 세션 확인
  useEffect(() => {
    fetch("/api/auth/me", {credentials: "include"})
    .then(r => r.json())
    .then(d => setAuthed(!!d.admin))
    .finally(() => setLoadingAuth(false));
  }, []);

  // 로그인되면 데이터 로드
  useEffect(() => {
    if (!authed) {
      return;
    }
    loadData();
  }, [authed]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(loginForm),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {method: "POST", credentials: "include"});
    setAuthed(false);
  };

  if (loadingAuth) {
    return null;
  }

  if (!authed) {
    return (
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <form onSubmit={handleLogin}
                className="w-80 space-y-3 border p-6 rounded bg-white">
            <h2 className="text-xl font-bold mb-2">Admin Login</h2>
            <input className="border p-2 w-full" placeholder="Username"
                   value={loginForm.username}
                   onChange={e => setLoginForm(
                       {...loginForm, username: e.target.value})}/>
            <input className="border p-2 w-full" placeholder="Password"
                   type="password"
                   value={loginForm.password}
                   onChange={e => setLoginForm(
                       {...loginForm, password: e.target.value})}/>
            <button
                className="w-full bg-blue-600 text-white py-2 rounded">Login
            </button>
          </form>
        </div>
    );
  }

  if (loading) {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6 py-24">
            <div className="text-center">
              <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading admin
                panel...</p>
            </div>
          </div>
        </div>
    );
  }
  return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-12">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin
              Panel</h1>
            <div className="flex gap-2">
              <Link to="/"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Back
                to Site</Link>
              <button onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Logout
              </button>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="flex space-x-8">
              <button
                  onClick={() => setActiveTab('representative-works')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'representative-works'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Representative Works
              </button>
              <button
                  onClick={() => setActiveTab('research')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'research'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Research Areas
              </button>

              <button
                  onClick={() => setActiveTab('publications')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'publications'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Publications
              </button>

              <button onClick={() => setActiveTab('research-highlights')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab
                      === 'research-highlights'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                Research Highlights
              </button>

              <button onClick={() => setActiveTab('cover-arts')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab
                      === 'cover-arts' ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                Cover Arts
              </button>
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'representative-works' && (
              <RepresentativeWorksTab
                  works={representativeWorks}
                  onUpdate={loadData}
              />
          )}

          {activeTab === 'publications' &&
              <PublicationsTab
              />
          }

          {activeTab === 'research' && (
              <ResearchAreasTab
                  areas={researchAreas}
                  onUpdate={loadData}
              />
          )}

          {activeTab === 'research-highlights' && (
              <ResearchHighlightsTab
                  items={researchHighlights}
                  onUpdate={loadData}
              />
          )}

          {activeTab === 'cover-arts' && (
              <CoverArtsTab
                  items={coverArts}
                  onUpdate={loadData}
              />
          )}

        </div>
      </div>
  );
}

export default AdminPage;
