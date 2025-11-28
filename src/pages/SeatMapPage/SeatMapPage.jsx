import { useState, useEffect } from "react";
import "./SeatMapPage.css";
import { getAllSeat, lockSeat, getOneSeat } from "../../api/ticket";

function SeatMapPage({ onBookingSuccess }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isReserving, setIsReserving] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [clickInfo, setClickInfo] = useState(null);

  useEffect(() => {
    getSeats();
  }, []);

  // ---------------------------
  // 전체 좌석 조회
  // ---------------------------
  const getSeats = async () => {
    setLoadingSeats(true);
    try {
      const data = await getAllSeat();
      setSeats(data.seats || []);
      setApiError(null);
    } catch (error) {
      console.error("좌석 조회 실패", error);
      setApiError("좌석 정보를 불러올 수 없습니다.");
    } finally {
      setLoadingSeats(false);
    }
  };

  // ---------------------------
  // 단일 좌석 조회
  // ---------------------------
  const handleSeatClick = async (seatId) => {
    try {
      const { seat } = await getOneSeat(seatId);
      if (seat.available) { // 선택된 좌석이 있다면 페이지 하단에 예매하기 버튼 등장
        setSelectedSeat(seatId);
        setClickInfo(Date.now());
      } else {
        alert("이미 선택된 좌석입니다");
      }
    } catch (err) {
      console.error("좌석 선택 오류", err);
    }
  };

  // --------------------------------------
  // 예매하기 버튼 누르면 동작하는 함수
  // --------------------------------------
  const handleReservation = async () => {
    if (!selectedSeat || isReserving) return;
    setIsReserving(true);
    try {
      await lockSeat(selectedSeat); // 서버에 예매 요청
      if (onBookingSuccess) {
        onBookingSuccess({
          seatId: selectedSeat,
          clickTime: clickInfo,
        });
      }
      // 최신 좌석 상태 갱신
      await getSeats();
      setSelectedSeat(null);
    } catch (err) {
      // 누가 이미 LOCK 해둔 좌석이라면
      console.log(`이미 선택된 좌석입니다. 에러명:`, err);
      await getSeats(); // 다시 새로고침, 전체 좌석 다시 가져옴
      setSelectedSeat(null);
    } finally {
      setIsReserving(false);
    }
  };

  const getSeatLabel = (row, col) => {
    return `${String.fromCharCode(65 + row)}${col + 1}`;
  };

  const isDisabled = isReserving || loadingSeats || apiError;

  return (
    <div className="seatmap-page">
      <div className="seatmap-container">
        <div className="seatmap-header">
          <h1>좌석 선택</h1>
        </div>

        {/* 상태 표시 */}
        {loadingSeats && (
          <div className="status-message loading">좌석 정보를 불러오는 중...</div>
        )}
        {apiError && (
          <div className="status-message error">⚠️ {apiError}</div>
        )}

        {/* 새로고침 */}
        <div className="seatmap-controls">
          <button className="refresh-btn" onClick={getSeats} disabled={isDisabled}>
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

        {/* stage */}
        <div className="stage">
          <div className="stage-label">STAGE</div>
        </div>

        {/* 좌석 */}
        <div className="seats-grid">
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={`seat 
                ${seat.status} 
                ${selectedSeat?.id === seat.id ? "selected" : ""} 
                ${isDisabled ? "disabled-seat" : ""}
              `}
              onClick={(e) => handleSeatClick(seat, e)}
              title={getSeatLabel(seat.row, seat.col)}
            >
              {getSeatLabel(seat.row, seat.col)}
            </div>
          ))}
        </div>

        {/* 예매 패널 */}
        {selectedSeat && (
          <div className="reservation-panel">
            <div className="selected-info">
              <span className="info-label">선택한 좌석:</span>
              <span className="info-value">
                {getSeatLabel(selectedSeat.row, selectedSeat.col)}
              </span>
            </div>

            <button
              className={`reserve-btn ${isReserving ? "loading" : ""}`}
              onClick={handleReservation}
              disabled={isDisabled}
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