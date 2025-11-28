import React, { useEffect, useState } from 'react';
import './QueueOverlay.css';
import { getMyPos, insertQueue } from '../../api/queue';

const POLL_INTERVAL = 500; // 0.5초마다 폴링

const QueueOverlay = ({ initialQueue, onComplete }) => {
  const [queueNumber, setQueueNumber] = useState(initialQueue || 50);

  useEffect(() => {
    let interval;
    const startRealMode = async () => {
      const nickname = localStorage.getItem('nickname');

      if (!nickname) {
        console.error('닉네임이 없어 대기열 진입(insertQueue)을 할 수 없습니다');
        return;
      }

      const pollQueue = async () => {
        try {
          const data = await getMyPos(nickname);
          const currentPosition = data.currentPosition || 0;
          setQueueNumber(currentPosition);
          if (currentPosition === 0) {
            clearInterval(interval);
            await popQueue(nickname);
            setTimeout(() => {
              onComplete();
            }, 500);
          }
        } catch (error) {
          console.error('대기열 조회 오류:', error);
        }
      };
      interval = setInterval(pollQueue, POLL_INTERVAL);
    };

    startRealMode();

    return () => clearInterval(interval);
  }, [onComplete]);

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