import { useState, useEffect } from 'react';
import './CooldownPage.css';

function CooldownPage({ onComplete }) {
  const COOLDOWN_SECONDS = 30;
  const [timeLeft, setTimeLeft] = useState(COOLDOWN_SECONDS);
  const [isComplete, setIsComplete] = useState(false);

  // 카운트다운 타이머 로직
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsComplete(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);

  // 재도전하기 버튼 누르면 시작 페이지로 라우팅하는 함수
  const handleRetry = () => {
    if (isComplete && onComplete) {
      onComplete();
    }
  };

  // 남은 시간 '분:초' 형식으로 보여주는 함수
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 아래 <circle/> 부분 보시고 확인해주세욥
  // const getProgressPercentage = () => {
  //   return ((COOLDOWN_SECONDS - timeLeft) / COOLDOWN_SECONDS) * 100;
  // };

  return (
    <div className="cooldown-page">
      <div className="cooldown-container">
        <div className="cooldown-header">
          <h1>쿨다운 시간</h1>
          <p>30초 뒤에 다시 도전할 수 있습니다</p>
        </div>

        <div className="timer-section">
          <div className="timer-circle">
            <svg className="timer-svg" viewBox="0 0 200 200">
              <circle
                className="timer-bg"
                cx="100"
                cy="100"
                r="85"
              />
              {/* 진행률 표시 원이 제대로 작동 안 됐던 거 같아서 그냥 지울까 합니닷
              확인 해보시고 삭제해주세요! 삭제하시면 위에 getProgressPercentage도 함께 지워주세요! */}
              {/* <circle
                className="timer-progress"
                cx="100"
                cy="100"
                r="85"
                style={{
                  strokeDasharray: `${2 * Math.PI * 85}`,
                  strokeDashoffset: `${2 * Math.PI * 85 * (1 - getProgressPercentage() / 100)}`,
                }}
              /> */}
            </svg>
            <div className="timer-content">
              <div className="timer-value">
                {formatTime(timeLeft)}
              </div>
              <div className="timer-label">
                {isComplete ? '준비 완료!' : '남은 시간'}
              </div>
            </div>
          </div>
        </div>

        {!isComplete && (
          <div className="waiting-message">
            <p>연속적인 요청 방지를 위한 대기 시간입니다</p>
          </div>
        )}

        <button
          className={`retry-button ${isComplete ? 'active' : 'disabled'}`}
          onClick={handleRetry}
          disabled={!isComplete}
        >
          {isComplete ? '재도전하기' : `${timeLeft}초 후 재도전 가능`}
        </button>
      </div>
    </div>
  );
}

export default CooldownPage;