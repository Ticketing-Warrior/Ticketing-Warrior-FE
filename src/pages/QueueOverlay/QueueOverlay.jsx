import React, { useEffect, useState } from 'react';
import './QueueOverlay.css';

const QueueOverlay = ({ initialQueue, onComplete }) => {
  const [queueNumber, setQueueNumber] = useState(initialQueue || 50);

  useEffect(() => {
    // API: 실시간 대기열 순번 조회
    // const pollQueue = async () => {
    //   try {
    //     const sessionToken = sessionStorage.getItem('sessionToken');
    //     const response = await fetch(`/api/queue/status?token=${sessionToken}`, {
    //       method: 'GET',
    //       headers: { 'Content-Type': 'application/json' }
    //     });
    //     
    //     if (!response.ok) {
    //       throw new Error('대기열 조회 실패');
    //     }
    //     
    //     const data = await response.json();
    //     setQueueNumber(data.currentPosition);
    //     
    //     if (data.currentPosition === 0) {
    //       setTimeout(() => onComplete(), 500);
    //     }
    //   } catch (error) {
    //     console.error('대기열 조회 오류:', error);
    //   }
    // };
    // 
    // const interval = setInterval(pollQueue, 500); // 0.5초마다 폴링
    // return () => clearInterval(interval);

    // 임시 로직 - 카운트다운
    let current = queueNumber;

  const interval = setInterval(() => {
    // 감소폭: 1~15 사이 랜덤
    const decrease = Math.floor(Math.random() * 15) + 5;

    current = Math.max(0, current - decrease); 
    setQueueNumber(current);

    if (current === 0) {
      clearInterval(interval);
      setTimeout(() => onComplete(), 500);
    }
  }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="queue-overlay">
      <div className="queue-overlay-content">
        <div className="queue-overlay-title">대기 중입니다</div>
        <div className="queue-overlay-circle">
          <div className="queue-overlay-number">{queueNumber}</div>
        </div>
        <div className="queue-overlay-subtitle">현재 순번</div>
        <div className="queue-overlay-message">
          잠시만 기다려주세요...
        </div>
      </div>
    </div>
  );
};

export default QueueOverlay;
