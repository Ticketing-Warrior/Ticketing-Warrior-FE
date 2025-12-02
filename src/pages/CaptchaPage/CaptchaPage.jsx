import { useState } from 'react';
import './CaptchaPage.css';
import refreshIcon from '../../assets/refresh.png';

// CAPTCHA 데이터 생성 함수
const createCaptchaData = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const answer = num1 + num2;
  return { num1, num2, answer };
};

function CaptchaPage({ onVerifySuccess }) {
  const [captchaData, setCaptchaData] = useState(createCaptchaData);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // CAPTCHA 새로고침 함수
  const generateCaptcha = () => {
    setCaptchaData(createCaptchaData());
    setUserInput('');
    setError('');
  };

  // 인증 처리
  const handleVerify = () => {
    setIsLoading(true);
    setError('');

    // 답변 검증
    setTimeout(() => {
      if (parseInt(userInput) === captchaData.answer) {
        // 성공하면 좌석 예매 페이지로 라우팅
        if (onVerifySuccess) {
          onVerifySuccess();
        }
      } else {
        // 실패하면 새로운 CAPTCHA 생성
        setError('인증에 실패했습니다. 다시 시도해주세요.');
        generateCaptcha();
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="captcha-page">
      <div className="captcha-container">
        <div className="captcha-header">
          <h1>보안 검증</h1>
          <p>사람인지 확인하기 위한 간단한 계산을 해주세요</p>
        </div>

        <div className="captcha-content">
          <div className="captcha-display">
            <div className="captcha-text">
              {captchaData.num1} + {captchaData.num2} = ?
            </div>
            <button 
              className="refresh-button"
              onClick={generateCaptcha}
              title="새로운 문제"
            >
              <img src={refreshIcon} alt="새로고침" className="refresh-icon" />
            </button>
          </div>

          <div className="captcha-input-section">
            <input
              type="number"
              className="captcha-input"
              placeholder="답을 입력하세요"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
            />
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>

          <button
            className={`verify-button ${isLoading ? 'loading' : ''}`}
            onClick={handleVerify}
            disabled={isLoading || !userInput}
          >
            {isLoading ? '확인 중...' : '인증하기'}
          </button>
        </div>

        <div className="captcha-footer">
          <p>💡 보안을 위한 절차입니다</p>
        </div>
      </div>
    </div>
  );
}

export default CaptchaPage;