import React, { useState, useEffect } from 'react';
import './StartPage.css';

// 환경 변수 가져오기 (Vite 환경 가정)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_PATH = '/api/queue/insert'; // 대기열 진입 API 경로

const StartPage = ({ onQueueEnter }) => {
  // 1. 상태 정의
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // **수정**: 로컬 스토리지에서 초기 닉네임 유무를 확인하여 초기 상태 설정
  const [isNicknameSaved, setIsNicknameSaved] = useState(!!localStorage.getItem('nickname')); 

  // -----------------------------------------------------------
  // 설정: 테스트 모드 (true) 또는 실제 연동 모드 (false)
  const IS_MOCK_TEST_MODE = false; 
  // -----------------------------------------------------------

  // **추가**: 컴포넌트 마운트 시 localStorage의 닉네임을 불러와 input에 표시
  useEffect(() => {
    const savedNickname = localStorage.getItem('nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []); // 빈 배열: 최초 1회만 실행

  // 1. 닉네임 저장 및 즉시 반영 처리 함수
  const handleNicknameSave = () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      alert("닉네임을 입력해 주세요.");
      return;
    }
    
    // 1. localStorage에 닉네임 저장
    localStorage.setItem('nickname', trimmedNickname);
    
    // 2. 다른 컴포넌트(NicknameDisplay)가 localStorage 변경을 즉시 감지하도록 이벤트 발생
    window.dispatchEvent(new Event('storage')); 
    
    // **수정**: 닉네임이 저장되었으므로 상태를 true로 설정
    setIsNicknameSaved(true); 
    alert(`닉네임 "${trimmedNickname}"이 저장되었습니다.`);
  };

  // 2. 대기열 진입 처리 함수 (기존 handleStart 로직)
  const handleQueueEntry = async () => {
    const trimmedNickname = localStorage.getItem('nickname'); // 저장된 닉네임 사용
    
    if (!trimmedNickname) {
      alert("먼저 닉네임을 입력하고 저장해 주세요."); // isNicknameSaved가 false면 사실상 이 경로는 실행되지 않음
      return;
    }

    setIsLoading(true);

    try {
      if (IS_MOCK_TEST_MODE) {
        // ... (MOCKING 로직 유지)
        console.log(`[Mocking] 닉네임 "${trimmedNickname}"으로 대기열 진입 시뮬레이션 성공.`);

        const MOCK_API_DELAY = 1000;
        const initialQueue = Math.floor(Math.random() * 50) + 30;
        const mockSessionToken = `mock-token-${Date.now()}`;
        
        sessionStorage.setItem('sessionToken', mockSessionToken); 
        
        await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
        
        onQueueEnter(initialQueue);
        
      } else {
        // ... (REAL API 로직 유지)
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
        
        sessionStorage.setItem('sessionToken', data.sessionToken); 
        
        onQueueEnter(data.queuePosition); 
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
        <h1 className="start-title">Ticketing Warrior</h1>
        <p className="start-subtitle">실전같은 티켓팅 예매 연습을 해보세요!</p>
        
        {/* 닉네임 입력 및 저장 버튼 그룹 */}
        <div className="nickname-input-group">
          <input
            type="text"
            className="nickname-input"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            // **수정**: isLoading 상태를 활용
            disabled={isLoading} 
            maxLength={20}
          />
          <button
            className="save-nickname-button"
            onClick={handleNicknameSave}
            // **수정**: isLoading 상태를 활용
            disabled={!nickname.trim() || isLoading} 
          >
            입력
          </button>
        </div>

        <button
          className="booking-button"
          onClick={handleQueueEntry}
          // **수정**: isNicknameSaved 상태에 따라 버튼 활성화
          disabled={isLoading || !isNicknameSaved} 
        >
          {isLoading ? '대기열 진입 중...' : '예매하기'}
        </button>
      </div>
    </div>
  );
};

export default StartPage;