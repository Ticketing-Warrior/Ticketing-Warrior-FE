import { useEffect, useState } from 'react';
import './ResultPage.css';
import { getResult } from '../services/bookingService';

function ResultPage({ nickname, onRetry }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 결과 가져오는 로직
    async function Result() {
      try {
        const data = await getResult(nickname);
        if (!data) {
          setError('결과를 불러올 수 없습니다.');
        } else {
          setStats({
            totalTime: data.duration,
            percentile: data.rankingPercent,
          });
        }
      } catch (err) {
        console.log('결과를 불러올 수 없습니다. 오류: ', err)
        setError('API 호출 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    Result();
  }, [nickname]);

  if (loading) return <div className="result-page">로딩 중...</div>;
  if (error) return <div className="result-page">{error}</div>;

  return (
    <div className="result-page">
      <div className="result-container">
        <div className="success-badge">
          <h1>예매 성공!</h1>
        </div>

        {/* 소요 시간 및 속도 분석 */}
        <div className="result-details">
          <div className="result-card time-card">
            <div className="card-content1">
              <div className="card-label1">총 소요 시간</div>
              <div className="card-value">{stats.totalTime}초</div>
            </div>
          </div>
          <div className="result-card performance-card">
            <div className="card-content2">
              <div className="card-label2">속도 분석</div>
              <div className="card-value">
                상위 {stats.percentile}%
              </div>
            </div>
          </div>
        </div>

        {/* 재도전하기 버튼 및 하단 문구 */}
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
