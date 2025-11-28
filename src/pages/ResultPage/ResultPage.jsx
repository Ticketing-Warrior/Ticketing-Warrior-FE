import { useState } from 'react';
import './ResultPage.css';

// 통계 생성 함수
const generateStats = () => {
  const totalTime = (Math.random() * 10 + 2).toFixed(3); // 2~12초 사이
  const percentile = Math.floor(Math.random() * 20) + 1; // 상위 1~20%
  
  return {
    totalTime,
    percentile,
  };
};

function ResultPage({ onRetry }) {
  // reservationData는 나중에 API 연동 시 사용
  const [stats] = useState(generateStats);

  return (
    <div className="result-page">
      <div className="result-container">
        <div className="success-badge">
          <h1>예매 성공!</h1>
        </div>

        <div className="result-details">
          <div className="result-card time-card">
            <div className="card-content1">
              <div className="card-label1">총 소요 시간</div>
              <div className="card-value">{stats.totalTime}초</div>
            </div>
          </div>

          <div className="result-card performance-card">
            <div className="card-icon" style={{ fontSize: '2.5rem' }}>
              {performance.emoji}
            </div>
            <div className="card-content2">
              <div className="card-label2">속도 분석</div>
              <div 
                className="card-value" 
                style={{ color: performance.color }}
              >
                상위 {stats.percentile}%
              </div>
            </div>
          </div>
        </div>

        <div className="result-actions">
          <button 
            className="retry-button"
            onClick={onRetry}
          >
            재도전하기
          </button>
        </div>

        <div className="result-footer">
          <p>더 빠른 예매를 위해 다시 도전해보세요!</p>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;