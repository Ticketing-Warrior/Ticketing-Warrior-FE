import { useState, useEffect } from 'react';
import './StartPage.css';
import { insertQueue } from '../../api/queue';
import { nicknameAtom } from '../../store/nicknameAtom';
import { useAtom } from 'jotai';
import logo from '../../assets/tw-logo.jpg';

const StartPage = ({ onQueueEnter }) => {
  const [nickname, setNickname] = useAtom(nicknameAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      const sec = new Date().getSeconds();
      
      // 60초 카운트다운 (59 -> 0)
      setTimeLeft(sec === 0 ? 0 : 60 - sec);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrentTime = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${month}월 ${date}일 ${hours}시 ${minutes}분 ${seconds}초`;
  };

  // 45~60초(즉, 0초가 되고 15초간만)일 때만 버튼 활성화
  const isButtonActive = timeLeft >= 45 || timeLeft === 0;

  const handleQueueEntry = async () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      alert("닉네임을 입력해 주세요.");
      return;
    }

    if (!isButtonActive) {
      alert("예매는 매 분 0~15초 사이에만 가능합니다!");
      return;
    }

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
        {/* 로고 & 타이틀 */}
        <div className="logo-title-wrapper">
          <img src={logo} alt="Ticketing Warrior Logo" className="logo-image" />
          <h1 className="start-title">Ticketing Warrior</h1>
        </div>        
        <p className="start-subtitle">
          실전같은 티켓팅 예매 연습을 해보세요!<br />
        </p>
        
        {/* 타이머 디스플레이 - 항상 표시 */}
        <div className="timer-display">
          <span className="timer-info">매 분 00초부터 15초 동안 예매가 가능합니다.</span>
          <div className="timer-label">
            {isButtonActive ? '예매 가능 클릭하세요!!' : '예매 대기 중..'}
          </div>
          <div className="current-time-display">
            {formatCurrentTime()}
          </div>
        </div>
        
        {/* 닉네임 입력 */}
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

        {/* 예매하기 버튼 */}
        <button
          className={`booking-button ${isButtonActive ? 'active' : 'disabled'}`}
          onClick={handleQueueEntry}
          disabled={isLoading || nickname.trim() === "" || !isButtonActive}
        >
          {isLoading
            ? "대기열 진입 중..."
            : isButtonActive
            ? "예매하기"
            : `${timeLeft}초 후 예매 가능`}
        </button>
      </div>
    </div>
  );
};

export default StartPage;