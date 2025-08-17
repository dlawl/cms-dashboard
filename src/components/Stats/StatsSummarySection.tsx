import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/userService";
import StatsCard from "./StatsCard";
import StatsChart from "./StatsChart";
import { fetchPostStats, fetchDailyPostStats } from "../../services/postStatsService";

const StatsSummarySection: React.FC = () => {
  // 전체 사용자 데이터 fetch
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { data: users = [] } = useQuery({
    queryKey: ["users", "all", token],
    queryFn: () => getUsers("all"),
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });
  // 게시글 통계 fetch
  const { data: postStats } = useQuery({ queryKey: ["posts", "stats"], queryFn: fetchPostStats });
  const { data: dailyPostStats = [] } = useQuery({ queryKey: ["posts", "dailyStats"], queryFn: fetchDailyPostStats });

  // 요약 통계 계산
  const stats = useMemo(() => {
    return {
      total: users.length,
      approved: users.filter(u => u.status === "approved").length,
      rejected: users.filter(u => u.status === "rejected").length,
      pending: users.filter(u => u.status === "pending").length,
    };
  }, [users]);

  // 최근 7일 날짜 배열 생성
  const getRecentDates = (days: number) => {
    const arr: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(d.toISOString().slice(0, 10));
    }
    return arr;
  };
  const recentDates = getRecentDates(7);

  // 실제 statusChangeDate 기반 날짜별 집계
  const chartData = useMemo(() => {
    return recentDates.map(date => {
      const approved = users.filter(u => u.status === "approved" && u.statusChangeDate === date).length;
      const rejected = users.filter(u => u.status === "rejected" && u.statusChangeDate === date).length;
      const pending = users.filter(u => u.status === "pending" && u.statusChangeDate === date).length;
      return {
        name: date.slice(5),
        승인: approved,
        반려: rejected,
        대기: pending,
        value: approved + rejected + pending,
      };
    });
  }, [users, recentDates]);

  // 게시글 차트 데이터
  const postChartData = useMemo(() => {
    return dailyPostStats.map(item => ({
      name: item.date.slice(5),
      발행: item.published,
      임시: item.draft,
      삭제: item.deleted,
      value: item.published + item.draft + item.deleted,
    }));
  }, [dailyPostStats]);

  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatsCard label="전체" value={stats.total} />
        <StatsCard label="승인" value={stats.approved} />
        <StatsCard label="반려" value={stats.rejected} />
        <StatsCard label="대기" value={stats.pending} />
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <StatsChart
          data={chartData}
          title="최근 7일 사용자 처리 현황"
        />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <StatsChart
          data={postChartData}
          title="최근 7일 게시글 처리 현황"
        />
      </div>
    </section>
  );
};

export default StatsSummarySection;
