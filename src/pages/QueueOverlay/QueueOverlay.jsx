import React, { useEffect, useState } from 'react';
import './QueueOverlay.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// API 경로 설정 (Path Variable을 사용하므로 {nickname}은 코드 내에서 대체됨)
const API_STATUS_PATH_TEMPLATE = '/api/queue/get-pos/'; 
const POLL_INTERVAL = 500; // 0.5초마다 폴링

const QueueOverlay = ({ initialQueue, onComplete }) => {
  const [queueNumber, setQueueNumber] = useState(initialQueue || 50);

  // -----------------------------------------------------------
  // 설정: 테스트 모드 (true) 또는 실제 연동 모드 (false)
  // true로 설정하면 백엔드 서버 없이 가상 카운트다운 테스트 가능
  const IS_MOCK_TEST_MODE = true;
  // -----------------------------------------------------------


  useEffect(() => {
    let interval; 

    if (IS_MOCK_TEST_MODE) {
      // =======================================================
      // MOCKING (테스트용) 로직: 가상 카운트다운
      // =======================================================
      console.log(`[Mocking] 대기열 ${queueNumber}부터 가상 카운트다운을 시작합니다.`);

      let current = queueNumber; 

      interval = setInterval(() => {
        const decrease = Math.floor(Math.random() * 15) + 5; 
        current = Math.max(0, current - decrease); 
        setQueueNumber(current);

        if (current === 0) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500); 
        }
      }, 800); 

      // =======================================================

    } else {
      // =======================================================
      // REAL API (실제 연동용) 로직: Path Variable을 사용한 대기열 순번 조회
      // =======================================================
      
      if (!API_BASE_URL) {
          console.error("API 연동 오류: 환경 변수 VITE_API_BASE_URL이 설정되지 않았습니다.");
          return; 
      }
      
      const pollQueue = async () => {
        try {
          const nickname = sessionStorage.getItem('nickname'); // 닉네임 가져오기
          
          if (!nickname) {
              console.error('닉네임 정보가 없어 대기열 조회를 중단합니다.');
              return; 
          }
          
          // 전체 API URL 구성: http://localhost:8080/api/queue/get-pos/user123
          const fullApiUrl = `${API_BASE_URL}${API_STATUS_PATH_TEMPLATE}${nickname}`;
          console.log('API 폴링 URL:', fullApiUrl);
          
          const response = await fetch(fullApiUrl, {
            method: 'GET', // GET 요청
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (!response.ok) {
            throw new Error(`대기열 조회 실패: HTTP 상태 ${response.status}`);
          }
          
          const data = await response.json();
          // 백엔드 응답에서 대기열 순번 필드 가져오기 (예: data.currentPosition)
          const currentPosition = data.currentPosition || 0; 
          
          setQueueNumber(currentPosition);
          
          if (currentPosition === 0) {
            clearInterval(interval); 
            setTimeout(() => onComplete(), 500);
          }
        } catch (error) {
          console.error('대기열 조회 오류:', error);
        }
      };
      
      // API 폴링 시작
      interval = setInterval(pollQueue, POLL_INTERVAL); 

      // =======================================================
    }
    
    // 컴포넌트 언마운트 시 인터벌 정리
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