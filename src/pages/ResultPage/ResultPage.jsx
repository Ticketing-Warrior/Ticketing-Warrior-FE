import './ResultPage.css';

function ResultPage({ data, onRetry }) {

  console.log(data);

  const duration = data?.duration ?? 0;
  const percentile = data?.rankingP ?? 100;

  // 성능 분석 (percentile 기반)
  const performance = getPerformance(percentile);

  return (
    <div className="result-page">
      <div className="result-container">
        <div className="success-badge">
          <h1>예매 성공!</h1>
        </div>

        <div className="seat-info-box">
          <h2>선택한 좌석 : <strong>{data.seatId}</strong></h2>
          <p>예매자 : {data.nickname}</p>
        </div>

        <div className="result-details">
          <div className="result-card time-card">
            <div className="card-content1">
              <div className="card-label1">총 소요 시간</div>
              <div className="card-value">{duration}초</div>
            </div>
          </div>

          <div className="result-card performance-card">
            <div className="card-content2">
              <div className="card-label2">속도 분석</div>
              <div 
                className="card-value" 
                style={{ color: performance.color }}
              >
                상위 {percentile}%
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



function getPerformance(percentile) {
  if (percentile <= 5) {
    return { color: "#FF3B30", label: "초고수" };
  } else if (percentile <= 10) {
    return { color: "#FF9500", label: "고수" };
  } else if (percentile <= 30) {
    return { color: "#FFCC00", label: "상위권" };
  } else if (percentile <= 60) {
    return { color: "#34C759", label: "평균" };
  } else {
    return { color: "#5856D6", label: "연습 필요" };
  }
}
