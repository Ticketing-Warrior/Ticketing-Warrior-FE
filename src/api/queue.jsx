import { axiosInstance } from './axios';

export const getMyPos = async (nickname) => {
    try{
        const { data } = await axiosInstance.get(`/api/queue/get-pos/${nickname}`);
        return data;

    }catch(err){
        console.log(`순번 조회 오류: `,err);
        throw err;
    }
}

export const insertQueue = async (nickname) => {
  const { data } = await axiosInstance.post("/api/queue/insert", {
    nickname,
  });
  return data;
};

export const popQueue = async (nickname) => {
    try {
        const { data } = await axiosInstance.post("/api/queue/pop", { nickname });
        return data;
    }catch(err){
        alert(err.response?.data?.message || "알 수 없는 오류");

        return {
            success: false,
            message: err.response?.data?.message || "오류 발생",
            data: null
        };
    }
}