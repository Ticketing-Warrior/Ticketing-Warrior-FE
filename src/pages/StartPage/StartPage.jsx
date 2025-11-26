import React, { useState } from 'react';
import './StartPage.css';

const StartPage = ({ onQueueEnter }) => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!nickname.trim()) return;

    setIsLoading(true);

    try {
      // API: 대기열 진입
      // const response = await fetch('/api/queue/enter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ nickname: nickname.trim() })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('대기열 진입 실패');
      // }
      // 
      // const data = await response.json();
      // // data 예시: { queuePosition: 45, sessionToken: 'abc123' }
      // sessionStorage.setItem('sessionToken', data.sessionToken);
      // sessionStorage.setItem('nickname', nickname.trim());
      // onQueueEnter(data.queuePosition);

      // 임시 로직
      const initialQueue = Math.floor(Math.random() * 50 + 30);
      sessionStorage.setItem('nickname', nickname.trim());
      
      setTimeout(() => {
        onQueueEnter(initialQueue);
      }, 500);

    } catch (error) {
      console.error('대기열 진입 오류:', error);
      alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
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
