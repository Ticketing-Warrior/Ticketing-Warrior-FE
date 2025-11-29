import { useState, useEffect } from 'react';
import './StartPage.css';
import { insertQueue } from '../../api/queue';

const StartPage = ({ onQueueEnter }) => {
  // 상태 정의
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNicknameSaved, setIsNicknameSaved] = useState(!!localStorage.getItem('nickname')); 

  useEffect(() => {
    const savedNickname = localStorage.getItem('nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);


  const handleQueueEntry = async () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      alert("닉네임을 입력해 주세요.");
      return;
    }
    
    localStorage.setItem('nickname', trimmedNickname);
    window.dispatchEvent(new Event('storage')); 
    setIsNicknameSaved(true); 

    const savedNickname = localStorage.getItem('nickname');
    if (!savedNickname) {
      alert("먼저 닉네임을 입력하고 저장해 주세요.");
      return;
    }

    setIsLoading(true);
    
    try {
      const data = await insertQueue(savedNickname);

      if (!data.success) {
        alert(data.message);
        setIsLoading(false);
        return;
      }

      onQueueEnter(data.curPos);

    } catch (err) {
      alert(err.response?.data?.message || "서버 오류 발생");
      setIsLoading(false);
    }

 }; 

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