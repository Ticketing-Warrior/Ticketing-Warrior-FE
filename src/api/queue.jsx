import { axiosInstance } from './axios';

export const getMyPos = async (nickname) => {
    try{
        const { data } = await axiosInstance.get(`/api/queue/${nickname}`);
        return data;

    }catch(err){
        console.log(`순번 조회 오류: `,err);
        throw err;
    }
}

export const insertQueue = async (nickname) => {
  try {
    const { data } = await axiosInstance.post("/api/queue/insert", { nickname });
    return data;
  } catch (err) {
    if (err.response) {
      alert(err.response.data.message || "서버 오류가 발생했습니다.");
    } else {
      alert(err.message || "알 수 없는 오류가 발생했습니다.");
    }
    throw err;
  }
};