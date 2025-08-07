// 통계 데이터 타입 정의
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
