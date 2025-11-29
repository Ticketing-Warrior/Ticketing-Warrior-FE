import { useState } from 'react';
import './StartPage.css';
import { insertQueue } from '../../api/queue';
import { nicknameAtom } from '../../store/nicknameAtom';
import { useAtom } from 'jotai';

const StartPage = ({ onQueueEnter }) => {
  const [nickname, setNickname] = useAtom(nicknameAtom);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueueEntry = async () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      alert("닉네임을 입력해 주세요.");
      return;
    }

    // Jotai → localStorage 자동 업데이트
    setNickname(trimmedNickname);

    setIsLoading(true);

    try {
      const data = await insertQueue(trimmedNickname);

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
          disabled={isLoading || nickname.trim() === ""} 
        >
          {isLoading ? '대기열 진입 중...' : '예매하기'}
        </button>
      </div>
    </div>
  );
}

export default StartPage;
