import { axiosInstance } from './axios';

export const getMyPos = async (nickname) => {
  const { data } = await axiosInstance.get("/api/queue/get-pos", {
    params: { nickname }
  });
  return data;
}

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

