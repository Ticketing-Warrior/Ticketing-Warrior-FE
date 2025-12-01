import { axiosInstance } from './axios';

// 대기열 순번 조회
export const getMyPos = async (nickname) => {
  const { data } = await axiosInstance.get("/api/queue/get-pos", {
    params: { nickname }
  });
  return data;
}

// 대기열에 진입 (예매하기 버튼 클릭 시)
export const insertQueue = async (nickname) => {
  const { data } = await axiosInstance.post("/api/queue/insert", {
    nickname,
  });
  return data;
};

export const popQueue = async (nickname) => {
  const { data } = await axiosInstance.post("/api/queue/pop", {
    nickname
  });
  return data;
};