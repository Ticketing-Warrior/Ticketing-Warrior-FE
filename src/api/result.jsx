import { axiosInstance } from './axios';

export async function getResult(nickname) {
  try { // 엔드포인트 수정 필요
    const response = await axiosInstance.get('/api/booking/result', {
      params: { nickname },
    });
    return response.data; // { recordId, duration, rankingPercent, createdAt }
  } catch (err) {
    console.error('API 호출 실패:', err);
    return null;
  }
}

// {
//   "recordId": 123,
//   "duration": 5.23,
//   "rankingPercent": 12,
//   "createdAt": "2025-11-28T04:12:34.567Z"
// }
