import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/userService";
import StatsCard from "./StatsCard";
import StatsChart from "./StatsChart";

const StatsSummarySection: React.FC = () => {
  // 전체 사용자 데이터 fetch
  const { data: users = [] } = useQuery({ queryKey: ["users", "all"], queryFn: () => getUsers("all") });

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

  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatsCard label="전체" value={stats.total} />
        <StatsCard label="승인" value={stats.approved} />
        <StatsCard label="반려" value={stats.rejected} />
        <StatsCard label="대기" value={stats.pending} />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <StatsChart
          data={chartData}
          title="최근 7일 처리 현황"
        />
      </div>
    </section>
  );
};

export default StatsSummarySection;
