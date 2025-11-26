import { useState } from 'react';
import './SeatMapPage.css';

function SeatMapPage({ onBookingSuccess }) {
  const ROWS = 10;
  const COLS = 10;
  
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isReserving, setIsReserving] = useState(false);
  const [clickTime, setClickTime] = useState(null);

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


  // 좌석 새로고침 (서버에서 최신 상태 가져오기 시뮬레이션)
  const handleRefresh = () => {
    // 랜덤하게 일부 좌석을 선점된 상태로 변경
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

  // 좌석 선택
  const handleSeatClick = (seat, event) => {
    if (seat.status !== 'available' || isReserving) return;

    // 클릭 시간과 좌표 기록
    const clickData = {
      seatId: seat.id,
      timestamp: new Date().getTime(),
      x: event.clientX,
      y: event.clientY,
    };
    
    setClickTime(clickData);
    
    // 이전 선택 해제 및 새로운 좌석 선택
    setSeats(prevSeats => 
      prevSeats.map(s => ({
        ...s,
        status: s.id === seat.id ? 'selected' : 
                s.status === 'selected' ? 'available' : s.status
      }))
    );
    setSelectedSeat(seat);
  };

  // 좌석 예매
  const handleReservation = () => {
    if (!selectedSeat || isReserving) return;

    setIsReserving(true);

    // API 호출 시뮬레이션
    setTimeout(() => {
      // 80% 성공, 20% 이선좌 (실패)
      const isSuccess = Math.random() < 0.8;

      if (isSuccess) {
        if (onBookingSuccess) {
          onBookingSuccess({
            seatId: selectedSeat.id,
            clickTime: clickTime,
          });
        }
      } else {
        alert('이미 선택된 좌석입니다.');
        handleRefresh();
      }
      
      setIsReserving(false);
    }, 1000);
  };

  const getSeatLabel = (row, col) => {
    return `${String.fromCharCode(65 + row)}${col + 1}`;
  };

  return (
    <div className="seatmap-page">
      <div className="seatmap-container">
        <div className="seatmap-header">
          <h1>좌석 선택</h1>
        </div>

        <div className="seatmap-controls">
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={isReserving}
          >
            🔄 새로고침
          </button>
          
          <div className="seat-legend">
            <div className="legend-item">
              <div className="legend-color available"></div>
              <span>선택 가능</span>
            </div>
            <div className="legend-item">
              <div className="legend-color selected"></div>
              <span>선택됨</span>
            </div>
            <div className="legend-item">
              <div className="legend-color occupied"></div>
              <span>선점됨</span>
            </div>
          </div>
        </div>

        <div className="stage">
          <div className="stage-label">STAGE</div>
        </div>

        <div className="seats-grid">
          {seats.map(seat => (
            <div
              key={seat.id}
              className={`seat ${seat.status}`}
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
              disabled={isReserving}
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