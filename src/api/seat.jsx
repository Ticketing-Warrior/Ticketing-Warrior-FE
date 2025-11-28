import { axiosInstance } from './axios';

// 단일 좌석 상태 조회 api
export const getOneSeat = async (seatId) => {
  try {
    const { data } = await axiosInstance.get('/api/seat/single', {
      params: { seatId },
    });
    return data;
  } catch (err) {
    console.log(`단일 좌석 상태 조회 오류: `, err);
    throw err;
  }
};

// 전체 좌석 상태 조회 api
export const getAllSeat = async () => {
    try{ // 엔드포인트 수정 필요
        const { data } = await axiosInstance.get(`/api/seat/all/`);
        return data;
    }catch(err){
        console.log(`전체 좌석 상태 조회 오류: `, err);
        throw err;
    }
}

// 좌석 예매 대기 (LOCK)
export const lockSeat = async (seatId) => {
    try{ // 엔드포인트 수정 필요
        const { data } = await axiosInstance.post(`/api/seat/sold/${seatId}`);
        return data;
    }catch(err){
        if (err.response) {
            const message = err.response.data?.message || "구매 중 오류가 발생했습니다.";
            alert(message);
        } else {
            alert("서버와 연결할 수 없습니다.");
        }
        throw err;
    }
}