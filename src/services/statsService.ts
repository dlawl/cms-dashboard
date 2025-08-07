// Mock 통계 데이터 및 서비스
export interface UserStats {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}

export interface DailyStats {
  date: string;
  approved: number;
  rejected: number;
  pending: number;
}

// 대시보드용 요약 통계
export const fetchUserStats = async (): Promise<UserStats> => {
  // 실제로는 API 요청, 여기선 mock
  return {
    total: 120,
    approved: 80,
    rejected: 25,
    pending: 15,
  };
};

// 일별 통계
export const fetchDailyStats = async (): Promise<DailyStats[]> => {
  return [
    { date: '2025-08-01', approved: 10, rejected: 2, pending: 1 },
    { date: '2025-08-02', approved: 12, rejected: 1, pending: 2 },
    { date: '2025-08-03', approved: 8, rejected: 3, pending: 0 },
    { date: '2025-08-04', approved: 15, rejected: 4, pending: 2 },
    { date: '2025-08-05', approved: 13, rejected: 2, pending: 1 },
  ];
};
