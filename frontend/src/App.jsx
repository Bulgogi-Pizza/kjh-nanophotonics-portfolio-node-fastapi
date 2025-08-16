import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Layout from './components/Layout'; // Layout 컴포넌트 사용
import HomePage from './pages/HomePage';
import PublicationsPage from './pages/PublicationsPage';

// import CVPage from './pages/CVPage'; // 나중에 추가할 페이지

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<HomePage/>}/>
            <Route path="publications" element={<PublicationsPage/>}/>
            {/* <Route path="cv" element={<CVPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;