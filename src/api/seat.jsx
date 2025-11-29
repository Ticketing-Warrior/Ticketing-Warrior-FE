import { axiosInstance } from './axios';

export const getAllSeats = async () => {
  const { data } = await axiosInstance.get("/api/seat/all",);
  return data;
};

export const getASeat = async (seatId) => {
    const { data } = await axiosInstance.get("/api/seat/single", {
        params: {seatId}
    });
    return data;
}