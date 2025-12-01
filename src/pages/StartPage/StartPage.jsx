import { useState, useEffect } from 'react';
import './StartPage.css';
import { insertQueue } from '../../api/queue';
import { nicknameAtom } from '../../store/nicknameAtom';
import { useAtom } from 'jotai';
import logo from '../../assets/tw-logo.jpg';

const StartPage = ({ onQueueEnter }) => {
  const [nickname, setNickname] = useAtom(nicknameAtom);
  const [isLoading, setIsLoading] = useState(false);

  const [firstZeroPassed, setFirstZeroPassed] = useState(false); // 첫 0초가 지나갔는지 확인 용도
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      const sec = new Date().getSeconds();

      // 남은 초수 갱신
      setTimeLeft(60 - sec-1);

      // 첫 0초를 만나면 플래그 true
      if (sec === 0 && !firstZeroPassed) {
        setFirstZeroPassed(true);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [firstZeroPassed]);

  const isButtonActive = firstZeroPassed; // 버튼 활성화 조건 : 첫 0초가 안 지났을 때

  const handleQueueEntry = async () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      alert("닉네임을 입력해 주세요.");
      return;
    }

    if (!isButtonActive) {
      alert("예매는 페이지 입장 후 첫 0초가 지난 뒤에 가능합니다!");
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
        <div className="logo-title-wrapper">
          <img src={logo} alt="Ticketing Warrior Logo" className="logo-image" />
          <h1 className="start-title">Ticketing Warrior</h1>
        </div>        
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
          className={`booking-button ${isButtonActive ? 'active' : 'disabled'}`}
          onClick={handleQueueEntry}
          disabled={isLoading || nickname.trim() === "" || !isButtonActive}
        >
          {isLoading
            ? "대기열 진입 중..."
            : isButtonActive
            ? "예매하기"
            : `0초까지 ${timeLeft}초`}
        </button>
      </div>
    </div>
  );
};

export default StartPage;
