import React, { useEffect, useState } from 'react';
import './QueueOverlay.css';
import { getMyPos, popQueue } from '../../api/queue';

const POLL_INTERVAL = 500;

const QueueOverlay = ({ initialQueue, onComplete }) => {
  const [queueNumber, setQueueNumber] = useState(initialQueue ?? 0);

  useEffect(() => {
    const nickname = localStorage.getItem('nickname');

    if (!nickname) {
      alert('닉네임이 존재하지 않습니다. 예매 후 다시 진행해주세요.');
      return;
    }

    let intervalId;

    const pollQueue = async () => {
      let data;

      try {
        data = await getMyPos(nickname);

        if (!data.success) {
          alert(data.message); 
          return;
        }

      } catch (error) {
        console.error('대기열 조회 오류:', error);
        return; 
      }

      const currentPosition = data.data.curPos ?? 1;
      setQueueNumber(currentPosition);

      if (currentPosition === 1) {
        clearInterval(intervalId);

        try {
          const data = await popQueue(nickname); 
          if (!data.success) {
            alert(data.message); 
            return;
          }

          setTimeout(() => {
            onComplete();
          }, 500);
        } catch (error) {
          console.error('popQueue 오류:', error);
          alert('대기열에서 빠지는 과정에서 오류가 발생했습니다. 자동으로 다시 시도합니다.');
          intervalId = setInterval(pollQueue, POLL_INTERVAL);
        }
      }
    };

    intervalId = setInterval(pollQueue, POLL_INTERVAL);
    pollQueue(); 

    return () => clearInterval(intervalId);
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