import React, { useState } from 'react';
import './StartPage.css';

// 환경 변수 가져오기 (Vite 환경 가정)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_PATH = '/api/queue/insert'; // 대기열 진입 API 경로

const StartPage = ({ onQueueEnter }) => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // -----------------------------------------------------------
  // 설정: 테스트 모드 (true) 또는 실제 연동 모드 (false)
  const IS_MOCK_TEST_MODE = true; 
  // -----------------------------------------------------------

  const handleStart = async () => {
    if (!nickname.trim()) return;

    setIsLoading(true);
    const trimmedNickname = nickname.trim();

    try {
      if (IS_MOCK_TEST_MODE) {
        // =======================================================
        // MOCKING (테스트용) 로직: 백엔드 서버 없이 프론트엔드 기능 테스트
        // =======================================================
        
        console.log(`[Mocking] 닉네임 "${trimmedNickname}"으로 대기열 진입 시뮬레이션 성공.`);

        const MOCK_API_DELAY = 1000; // 1초 지연 시뮬레이션
        const initialQueue = Math.floor(Math.random() * 50) + 30; // 30~79 임의 대기열 위치
        const mockSessionToken = `mock-token-${Date.now()}`;
        
        // 1. 임시 데이터 저장
        sessionStorage.setItem('sessionToken', mockSessionToken); 
        sessionStorage.setItem('nickname', trimmedNickname);
        
        // 2. 가상 지연
        await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
        
        // 3. 대기열 진입 상태로 전환
        onQueueEnter(initialQueue);
        
        // =======================================================
      
      } else {
        // =======================================================
        // REAL API (실제 연동용) 로직
        // =======================================================
        
        if (!API_BASE_URL) {
          throw new Error("환경 변수 VITE_API_BASE_URL이 설정되지 않았습니다.");
        }
        
        const fullApiUrl = `${API_BASE_URL}${API_PATH}`; 
        console.log('API 호출 URL:', fullApiUrl);

        const response = await fetch(fullApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: trimmedNickname })
        });
        
        if (!response.ok) {
          throw new Error(`대기열 진입 실패: HTTP 상태 ${response.status}`);
        }
        
        const data = await response.json();
        
        // 서버 응답 기반 데이터 저장
        sessionStorage.setItem('sessionToken', data.sessionToken); 
        sessionStorage.setItem('nickname', trimmedNickname);
        
        onQueueEnter(data.queuePosition); 
        
        // =======================================================
      }

    } catch (error) {
      console.error('처리 오류:', error);
      let errorMessage = '서버 연결에 실패했습니다. (주소: ' + API_BASE_URL + ')';
      
      if (IS_MOCK_TEST_MODE) {
          errorMessage = 'Mocking 테스트 중 오류가 발생했습니다.';
      } else if (error.message.includes("VITE_API_BASE_URL")) {
          errorMessage = 'API 설정 오류: 환경 변수가 누락되었습니다.';
      }
      
      alert(errorMessage);
      setIsLoading(false); 
    }
  };

  return (
    <div className="start-page">
      <div className="start-container">
        <h1 className="start-title">🎫 티켓 예매 훈련</h1>
        <p className="start-subtitle">실전같은 예매 연습으로 빠른 손가락을 만들어보세요!</p>
        <input
          type="text"
          className="nickname-input"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          disabled={isLoading}
          maxLength={20}
        />
        <button
          className="booking-button"
          onClick={handleStart}
          disabled={!nickname.trim() || isLoading}
        >
          {isLoading ? '대기열 진입 중...' : '예매하기'}
        </button>
      </div>
    </div>
  );
};

export default StartPage;