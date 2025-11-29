import { useState, useEffect } from 'react';
import './SeatMapPage.css';
import { getAllSeats, getASeat, reserveSeat } from '../../api/seat';
import { nicknameAtom } from '../../store/nicknameAtom';
import { useAtomValue } from 'jotai';

function SeatMapPage({ onBookingSuccess }) {

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isReserving, setIsReserving] = useState(false);
  const [clickTime, setClickTime] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [seats, setSeats] = useState([]);
  const nickname = useAtomValue(nicknameAtom);

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
        row,
        col,
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
      console.log("좌석 선택 실패:", err);
    }
  };

  const handleReservation = async () => {
    if (!selectedSeat) return;

    try {
      setIsReserving(true);
      
      console.log(nickname)
      const data = await reserveSeat(nickname, selectedSeat.id);

      if (!data.success) {
        alert(data.message);
        setIsReserving(false);
        return;
      }

      alert("예매 성공 !");

      onBookingSuccess({
        seatId: selectedSeat.id,
        nickname,
        duration: data.data.duration,
        rankingP: data.data.rankingPercent
      });
    

    } catch (err) {
      console.log("좌석 예매 실패:", err);
    } finally {
      setIsReserving(false);
    }
  };

  const isInteractionDisabled = isReserving || isApiLoading || apiError;

  return (
    <div className="seatmap-page">
      <div className="seatmap-container">
        <div className="seatmap-header">
          <h1>좌석 선택</h1>
        </div>

        {isApiLoading && <div className="status-message loading">티켓팅 시스템 접속 중...</div>}
        {apiError && <div className="status-message error">⚠️ 오류: {apiError}</div>}

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
            <div className="legend-item"><div className="legend-color occupied"></div>판매됨</div>
          </div>
        </div>

        <div className="stage">
          <div className="stage-label">STAGE</div>
        </div>

        <div className="seats-grid">
          {seats.flat().map(seat => (
            <div
              key={seat.id}
              className={`seat ${seat.status}`}
              onClick={(e) => handleSeatClick(seat, e)}
              title={seat.id}
            >
              {seat.id}
            </div>
          ))}
        </div>

        {selectedSeat && (
          <div className="reservation-panel">
            <div className="selected-info">
              <span className="info-label">선택한 좌석:</span>
              <span className="info-value">{selectedSeat.id}</span>
            </div>

            <button
              className={`reserve-btn ${isReserving ? "loading" : ""}`}
              onClick={handleReservation}
              disabled={isInteractionDisabled}
            >
              {isReserving ? "예매 중..." : "좌석 예매하기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatMapPage;
