import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import StartPage from './pages/StartPage/StartPage';
import QueueOverlay from './pages/QueueOverlay/QueueOverlay';
import CaptchaPage from './pages/CaptchaPage/CaptchaPage';
import SeatMapPage from './pages/SeatMapPage/SeatMapPage';
import ResultPage from './pages/ResultPage/ResultPage';
// import CooldownPage from './pages/CooldownPage/CooldownPage';
import NicknameDisplay from './components/NicknameDisplay';

const App = () => {
  const [queueData, setQueueData] = useState(null);

  return (
    <Router>
      <NicknameDisplay />
      <Routes>
        <Route path="/" element={<StartPage onQueueEnter={(data) => {
          setQueueData(data);
        }} />} />
        <Route path="/queue" element={<QueueOverlay initialQueue={queueData} />} />
        <Route path="/captcha" element={<CaptchaPage />} />
        <Route path="/seats" element={<SeatMapPage />} />
        <Route path="/result" element={<ResultPage />} />
        {/* <Route path="/cooldown" element={<CooldownPage />} /> */}

        {/* 잘못된 경로 접근 시 루트로 이동 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;