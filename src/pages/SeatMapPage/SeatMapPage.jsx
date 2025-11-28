import { useState, useEffect } from 'react'; 
import './SeatMapPage.css';

// 💡 Mock API 함수
// API 경로와 메서드에 따라 가짜 응답을 반환합니다.
const mockApiCall = (path, options) => {
    return new Promise((resolve, reject) => {
        // 네트워크 지연 시뮬레이션
        setTimeout(() => {
            if (path === '/api/ticketing/start') {
                // 티켓팅 시작 API는 항상 성공한다고 가정
                resolve({ ok: true, json: async () => ({ status: 'started' }) });
            } else if (path === '/api/ticketing/reserve') {
                // 예매 API는 외부 상태 (isMockSuccess)에 따라 성공/실패 결정
                const isSuccess = options.isMockSuccess;
                if (isSuccess) {
                    resolve({ ok: true, json: async () => ({ status: 'success', seatId: options.body.seatId }) });
                } else {
                    // 409 Conflict (이미 선택된 좌석) 시뮬레이션
                    reject({ message: '409 Conflict: Seat already occupied' }); 
                }
            } else {
                reject(new Error('Unknown API path'));
            }
        }, 500 + Math.random() * 500); // 0.5초 ~ 1초 랜덤 지연
    });
};


function SeatMapPage({ onBookingSuccess, nickname = "user1234" }) {
  const ROWS = 10;
  const COLS = 10;
  
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isReserving, setIsReserving] = useState(false);
  const [clickTime, setClickTime] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(true); 
  const [apiError, setApiError] = useState(null);
  
  // 💡 Mock API 성공 여부를 토글하기 위한 상태 추가
  const [isMockSuccess, setIsMockSuccess] = useState(true);

  const [seats, setSeats] = useState(() => {
    const newSeats = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        newSeats.push({
          id: `${row}-${col}`,
          row,
          col,
          status: 'available',
        });
      }
    }
    return newSeats;
  });

  // 티켓팅 시작 API 호출 (Mock 적용)
  useEffect(() => {
    const startTicketing = async () => {
      try {
        setApiError(null);
        // Mock API 호출로 대체
        await mockApiCall('/api/ticketing/start', { 
            method: 'POST', 
            body: { nickname }
        });
        
        console.log(`[Mock] 티켓팅 시작 API 호출 성공: /api/ticketing/start (닉네임: ${nickname})`);

      } catch (error) {
        console.error('[Mock] API Error:', error.message);
        setApiError('티켓팅 시스템에 접속할 수 없습니다.');
      } finally {
        setIsApiLoading(false);
      }
    };

    startTicketing();
  }, [nickname]);


  // 좌석 새로고침 (서버에서 최신 상태 가져오기 시뮬레이션)
  const handleRefresh = () => {
    // ... (기존 로직 유지)
    setSeats(prevSeats => 
      prevSeats.map(seat => {
        if (seat.status === 'selected') {
          return { ...seat, status: 'available' };
        }
        // 20% 확률로 선점됨
        if (Math.random() < 0.2 && seat.status === 'available') {
          return { ...seat, status: 'occupied' };
        }
        return seat;
      })
    );
    setSelectedSeat(null);
  };

  // 좌석 선택 (기존 로직 유지)
  const handleSeatClick = (seat, event) => {
    if (seat.status !== 'available' || isReserving || isApiLoading || apiError) return;

    const clickData = {
      seatId: seat.id,
      timestamp: new Date().getTime(),
      x: event.clientX,
      y: event.clientY,
    };
    
    setClickTime(clickData);
    
    setSeats(prevSeats => 
      prevSeats.map(s => ({
        ...s,
        status: s.id === seat.id ? 'selected' : 
                s.status === 'selected' ? 'available' : s.status
      }))
    );
    setSelectedSeat(seat);
  };

  // 좌석 예매 (Mock 적용)
  const handleReservation = async () => {
    if (!selectedSeat || isReserving || isApiLoading || apiError) return;

    setIsReserving(true);

    try {
        // Mock API 호출로 대체
        await mockApiCall('/api/ticketing/reserve', { 
            method: 'POST',
            body: { seatId: selectedSeat.id },
            isMockSuccess: isMockSuccess // Mock 성공 여부 전달
        });
        
        console.log(`[Mock] 예매 성공: ${selectedSeat.id}`);

        if (onBookingSuccess) {
            onBookingSuccess({
                seatId: selectedSeat.id,
                clickTime: clickTime,
            });
        }

    } catch (error) {
        console.error('[Mock] 예매 실패:', error.message);
        // 이선좌 (409 Conflict) 실패 시
        alert('이미 선택된 좌석입니다. 다시 시도해주세요.');
        handleRefresh(); // 좌석 상태 새로고침
    } finally {
        setIsReserving(false);
    }
  };

  const getSeatLabel = (row, col) => {
    return `${String.fromCharCode(65 + row)}${col + 1}`;
  };

  const isInteractionDisabled = isReserving || isApiLoading || apiError;

  return (
    <div className="seatmap-page">
      <div className="seatmap-container">
        <div className="seatmap-header">
          <h1>좌석 선택</h1>
        </div>

        {/* Mock API 토글 버튼 */}
        <div className="mock-controls">
            <button
                onClick={() => setIsMockSuccess(prev => !prev)}
                className={isMockSuccess ? 'success-toggle' : 'fail-toggle'}
            >
                Mock 예매: **{isMockSuccess ? '🟢 성공' : '🔴 실패'}**
            </button>
            <span className="mock-info">
                *클릭 시 다음 예매 API 호출 성공/실패 토글
            </span>
        </div>
        
        {/* 로딩/에러 메시지 표시 */}
        {isApiLoading && <div className="status-message loading">티켓팅 시스템 접속 중...</div>}
        {apiError && <div className="status-message error">⚠️ 오류: {apiError}</div>}

        <div className="seatmap-controls">
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={isInteractionDisabled} 
          >
            🔄 새로고침
          </button>
          
          <div className="seat-legend">
            <div className="legend-item"><div className="legend-color available"></div><span>선택 가능</span></div>
            <div className="legend-item"><div className="legend-color selected"></div><span>선택됨</span></div>
            <div className="legend-item"><div className="legend-color occupied"></div><span>선점됨</span></div>
          </div>
        </div>

        <div className="stage">
          <div className="stage-label">STAGE</div>
        </div>

        <div className="seats-grid">
          {seats.map(seat => (
            <div
              key={seat.id}
              className={`seat ${seat.status} ${isInteractionDisabled ? 'disabled-seat' : ''}`} 
              onClick={(e) => handleSeatClick(seat, e)}
              title={getSeatLabel(seat.row, seat.col)}
            >
              {getSeatLabel(seat.row, seat.col)}
            </div>
          ))}
        </div>

        {selectedSeat && (
          <div className="reservation-panel">
            <div className="selected-info">
              <span className="info-label">선택한 좌석:</span>
              <span className="info-value">
                {getSeatLabel(selectedSeat.row, selectedSeat.col)}
              </span>
            </div>
            <button
              className={`reserve-btn ${isReserving ? 'loading' : ''}`}
              onClick={handleReservation}
              disabled={isInteractionDisabled || !selectedSeat}
            >
              {isReserving ? '예매 중...' : '좌석 예매하기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatMapPage;