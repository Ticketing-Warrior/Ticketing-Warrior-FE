import { useState, useEffect } from 'react';
import './CooldownPage.css';

function CooldownPage({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // 매 분 0초에 활성화되도록 하는 로직
  useEffect(() => {
    const updateCooldown = () => {
      const now = new Date();
      const currentSec = now.getSeconds();
      const remaining = 60 - currentSec; // 다음 00초까지 남은 시간(초)

      setTimeLeft(remaining);

      if (remaining === 60) {
        // 이미 정확히 00초 시점이면 바로 활성화
        setIsComplete(true);
      } else {
        // 다음 00초 시점에 실행
        const timeout = setTimeout(() => {
          setIsComplete(true);
        }, remaining * 1000);

        return () => clearTimeout(timeout);
      }
    };

    // 최초 실행
    updateCooldown();

    // 매 초 timeLeft 업데이트
    const interval = setInterval(() => {
      const now = new Date();
      const currentSec = now.getSeconds();
      setTimeLeft(60 - currentSec-1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    if (isComplete && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="cooldown-page">
      <div className="cooldown-container">
        <div className="cooldown-header">
          <h1>쿨다운 시간</h1>
          <p>매 분 0초가 되면 다시 도전할 수 있습니다</p>
        </div>

        <div className="timer-section">
          <div className="timer-circle">
            <div className="timer-content">
              <div className="timer-label">
                {isComplete ? '준비 완료!' : '남은 시간'}
              </div>
              <div className="timer-value">
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        <button
          className={`retry-button ${isComplete ? 'active' : 'disabled'}`}
          onClick={handleRetry}
          disabled={!isComplete}
        >
          재도전하기
        </button>
      </div>
    </div>
  );
}

export default CooldownPage;
