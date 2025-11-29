import { useState, useEffect } from 'react';
import './SeatMapPage.css';
import { getAllSeats, getASeat } from '../../api/seat';

function SeatMapPage({ onBookingSuccess, nickname = "user1234" }) {

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isReserving, setIsReserving] = useState(false);
  const [clickTime, setClickTime] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [seats, setSeats] = useState([]);

const formatSeats = (seatData) => {
  const seatIds = Object.keys(seatData).sort();
  const grid = [];
  let rowArr = [];

  seatIds.forEach((seatId, index) => {
    const row = Math.floor(index / 10); 
    const col = index % 10;            

    rowArr.push({
      id: seatId,
      status: seatData[seatId],
      row: row,
      col: col,
    });

    if ((index + 1) % 10 === 0) {
      grid.push(rowArr);
      rowArr = [];
    }
  });

  if (rowArr.length) grid.push(rowArr);

  return grid;
};

  const refreshSeats = async () => {
    try {
      const data = await getAllSeats();

      if (!data.success) {
        alert(data.message);
        return;
      }

      const seatGrid = formatSeats(data.data);
      setSeats(seatGrid);
      setSelectedSeat(null);
    } catch (err) {
      console.error("좌석 새로고침 실패:", err);
    }
  };

  useEffect(() => {
    const startAndLoadSeats = async () => {
      try {
        setApiError(null);
        const data = await getAllSeats();

        if (!data.success) {
          alert(data.message);
          setIsApiLoading(false);
          return;
        }

        const seatGrid = formatSeats(data.data);
        setSeats(seatGrid);
      } catch (err) {
        console.error("API 에러:", err);
        setApiError("티켓팅 서버에 연결할 수 없습니다.");
      } finally {
        setIsApiLoading(false);
      }
    };

    startAndLoadSeats();
  }, [nickname]);

  const handleSeatClick = async (seat, event) => {
    if (seat.status !== 'available' || isReserving || isApiLoading || apiError) return;

    setSelectedSeat(seat);
    setClickTime({
      seatId: seat.id,
      timestamp: new Date().getTime(),
      x: event.clientX,
      y: event.clientY,
    });

    try {
      const data = await getASeat(seat.id);
      if (!data.success) {
        alert(data.message);
        return;
      }

      setSeats(prev =>
        prev.map(row =>
          row.map(s =>
            s.id === seat.id
              ? { ...s, status: 'selected' }
              : s.status === 'selected'
              ? { ...s, status: 'available' }
              : s
          )
        )
      );
    } catch (err) {
      console.error("좌석 선택 실패:", err);
      refreshSeats();
    }
  };

  const isInteractionDisabled = isReserving || isApiLoading || apiError;

  const getSeatLabel = (row, col) => `${String.fromCharCode(row+65)}${col + 1}`;

  return (
    <div className="seatmap-page">
      <div className="seatmap-container">
        <div className="seatmap-header">
          <h1>좌석 선택</h1>
        </div>

        {/* 상태 메시지 */}
        {isApiLoading && <div className="status-message loading">티켓팅 시스템 접속 중...</div>}
        {apiError && <div className="status-message error">⚠️ 오류: {apiError}</div>}

        {/* 컨트롤 패널 */}
        <div className="seatmap-controls">
          <button
            className="refresh-btn"
            onClick={refreshSeats}
            disabled={isInteractionDisabled}
          >
            🔄 새로고침
          </button>

          <div className="seat-legend">
            <div className="legend-item"><div className="legend-color available"></div>선택 가능</div>
            <div className="legend-item"><div className="legend-color selected"></div>선택됨</div>
            <div className="legend-item"><div className="legend-color occupied"></div>선점됨</div>
          </div>
        </div>

        {/* 무대 */}
        <div className="stage">
          <div className="stage-label">STAGE</div>
        </div>

        {/* 좌석 그리드 */}
        <div className="seats-grid">
          {seats.flat().map(seat => (
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

        {/* 선택 좌석 정보 */}
        {selectedSeat && (
          <div className="reservation-panel">
            <div className="selected-info">
              <span className="info-label">선택한 좌석:</span>
              <span className="info-value">
                {getSeatLabel(selectedSeat.row, selectedSeat.col)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatMapPage;