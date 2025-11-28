import React, { useState, useEffect } from 'react';
import './StartPage.css';
import { insertQueue } from '../../api/queue';

const VITE_SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL; // 실제 서버 URL

const StartPage = ({ onQueueEnter }) => {
  // 상태 정의
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNicknameSaved, setIsNicknameSaved] = useState(!!localStorage.getItem('nickname')); 

  // 컴포넌트 마운트 시 localStorage에서 닉네임 불러오기
  useEffect(() => {
    const savedNickname = localStorage.getItem('nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  // 닉네임 저장 처리
  const handleNicknameSave = () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      alert("닉네임을 입력해 주세요.");
      return;
    }
    
    localStorage.setItem('nickname', trimmedNickname);
    window.dispatchEvent(new Event('storage')); 
    setIsNicknameSaved(true); 
    alert(`닉네임 "${trimmedNickname}"이 저장되었습니다.`);
  };

  // 대기열 진입 처리
  const handleQueueEntry = async () => {
    const savedNickname = localStorage.getItem('nickname');
    if (!savedNickname) {
      alert("먼저 닉네임을 입력하고 저장해 주세요.");
      return;
    }

    setIsLoading(true);

    const data = await insertQueue(savedNickname);

    if (!data.success) {
      alert(data.message);
    } else {
      onQueueEnter(data.queuePosition); 
    }

 ;} 

  return (
    <div className="start-page">
      <div className="start-container">
        <h1 className="start-title">Ticketing Warrior</h1>
        <p className="start-subtitle">실전같은 티켓팅 예매 연습을 해보세요!</p>
        
        {/* 닉네임 입력 및 저장 버튼 */}
        <div className="nickname-input-group">
          <input
            type="text"
            className="nickname-input"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={isLoading} 
            maxLength={20}
          />
          <button
            className="save-nickname-button"
            onClick={handleNicknameSave}
            disabled={!nickname.trim() || isLoading} 
          >
            입력
          </button>
        </div>

        <button
          className="booking-button"
          onClick={handleQueueEntry}
          disabled={isLoading || !isNicknameSaved} 
        >
          {isLoading ? '대기열 진입 중...' : '예매하기'}
        </button>
      </div>
    </div>
  );
}

export default StartPage;