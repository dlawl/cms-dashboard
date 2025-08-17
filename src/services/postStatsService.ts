// 게시글 통계 mock 데이터 및 서비스
export interface PostStats {
  total: number;
  published: number;
  draft: number;
  deleted: number;
}

export interface DailyPostStats {
  date: string;
  published: number;
  draft: number;
  deleted: number;
}

export const fetchPostStats = async (): Promise<PostStats> => {
  return {
    total: 45,
    published: 30,
    draft: 10,
    deleted: 5,
  };
};

export const fetchDailyPostStats = async (): Promise<DailyPostStats[]> => {
  return [
    { date: '2025-08-01', published: 2, draft: 1, deleted: 0 },
    { date: '2025-08-02', published: 3, draft: 0, deleted: 1 },
    { date: '2025-08-03', published: 1, draft: 2, deleted: 0 },
    { date: '2025-08-04', published: 4, draft: 1, deleted: 0 },
    { date: '2025-08-05', published: 2, draft: 1, deleted: 1 },
  ];
};
