import React, { useState } from 'react';
import StartPage from './pages/StartPage/StartPage';
import QueueOverlay from './pages/QueueOverlay/QueueOverlay';
import CaptchaPage from './pages/CaptchaPage/CaptchaPage';
import SeatMapPage from './pages/SeatMapPage/SeatMapPage';
import ResultPage from './pages/ResultPage/ResultPage';
import CooldownPage from './pages/CooldownPage/CooldownPage';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('start');
  const [queueData, setQueueData] = useState(null);

  return (
    <>
      {currentPage === 'start' && (
        <StartPage 
          onQueueEnter={(data) => {
            setQueueData(data);
            setCurrentPage('queue');
          }} 
        />
      )}
      
      {currentPage === 'queue' && (
        <QueueOverlay 
          initialQueue={queueData}
          onComplete={() => setCurrentPage('captcha')} 
        />
      )}
      
      {currentPage === 'captcha' && (
        <CaptchaPage 
          onVerifySuccess={() => setCurrentPage('seats')} 
        />
      )}
      
      {currentPage === 'seats' && (
        <SeatMapPage 
          onBookingSuccess={() => setCurrentPage('result')} 
        />
      )}
      
      {currentPage === 'result' && (
        <ResultPage 
          onRetry={() => setCurrentPage('cooldown')}
          onConfirm={() => setCurrentPage('start')}
        />
      )}
      
      {currentPage === 'cooldown' && (
        <CooldownPage 
          onComplete={() => setCurrentPage('start')} 
        />
      )}
    </>
  );
};

export default App;