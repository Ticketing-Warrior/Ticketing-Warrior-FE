import { axiosInstance } from './axios';

export const getOneSeat = async (seatId) => {
    try{
        const { data } = await axiosInstance.get(`/api/seat/${seatId}/`);
        return data;
    }catch(err){
        console.log(`단일 좌석 상태 조회 오류: `, err);
        throw err;
    }
}

export const getAllSeat = async () => {
    try{
        const { data } = await axiosInstance.get(`/api/seat/all/`);
        return data;
    }catch(err){
        console.log(`전체 좌석 상태 조회 오류: `, err);
        throw err;
    }
}

export const lockSeat = async (seatId) => {
    try{
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