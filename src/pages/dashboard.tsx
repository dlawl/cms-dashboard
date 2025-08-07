import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Head from "next/head";
import { FixedSizeList as List } from "react-window";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { getUsers, updateUserStatus, User, UserStatus } from "../services/userService";
import { UserCard } from "../components/UserCard";
import StatsSummarySection from "../components/Stats/StatsSummarySection";
import { FilterBar } from "../components/FilterBar";
import { toast } from "react-hot-toast";
export default function DashboardPage() {
  const { authenticated, logout } = useAuth(true);
  const [filter, setFilter] = useState<UserStatus | "all">("all");
  const [actionLoading, setActionLoading] = useState<{ [id: string]: boolean }>({});
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    isError,
    error
  } = useQuery<User[], Error>({
    queryKey: ["users", filter],
    queryFn: () => getUsers(filter),
    staleTime: 1000 * 60
  });
  const users = data ?? [];

  // optimistic mutation
  type MutateVars = { id: string; status: UserStatus };
  type MutateContext = { previousUsers?: User[] };

  const mutation = useMutation<User[], Error, MutateVars, MutateContext>({
    mutationFn: async ({ id, status }) => {
      // 실제 환경에서는 서버 요청 실패를 시뮬레이션 할 수 있음
      return updateUserStatus(id, status);
    },
    onMutate: async ({ id, status }) => {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<User[]>(["users", filter]);
      // 낙관적으로 UI 업데이트
      if (previousUsers) {
        queryClient.setQueryData<User[]>(["users", filter],
          previousUsers.map(u => u.id === id ? { ...u, status } : u)
        );
      }
      return { previousUsers };
    },
    onError: (err, variables, context) => {
      // 실패 시 롤백
      if (context?.previousUsers) {
        queryClient.setQueryData(["users", filter], context.previousUsers);
      }
      toast.error("상태 변경 실패! (롤백됨)");
    },
    onSettled: () => {
      // 항상 최신 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onSuccess: (_, { status }) => {
      if (status === "approved") toast.success("승인 완료!");
      else if (status === "rejected") toast.error("반려 처리됨");
      else toast("대기 상태로 변경됨");
    }
  });

  const handleApprove = (id: string) => {
    if (actionLoading[id]) return; // 중복 요청 방지
    mutation.mutate({ id, status: "approved" }, {
      onSettled: () => setActionLoading(prev => ({ ...prev, [id]: false }))
    });
  };

  const handleReject = (id: string) => {
    if (actionLoading[id]) return; // 중복 요청 방지
    mutation.mutate({ id, status: "rejected" }, {
      onSettled: () => setActionLoading(prev => ({ ...prev, [id]: false }))
    });
  };

  const handlePending = (id: string) => {
    if (actionLoading[id]) return; // 중복 요청 방지
    mutation.mutate({ id, status: "pending" }, {
      onSettled: () => setActionLoading(prev => ({ ...prev, [id]: false }))
    });
  };

  return (
    <>
      <Head>
        <title>대시보드 | Admin Dashboard</title>
        <meta name="description" content="관리자 대시보드 - 사용자 목록 및 상태 관리" />
      </Head>
      <div className="min-h-screen bg-background text-foreground ">
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
          <Image src="/logo.png" alt="서비스 로고" width={64} height={64} className="h-16 w-auto min-w-[64px] max-h-24 cursor-pointer" priority />
          <button
          onClick={logout}
          className="flex items-center gap-2 bg-[#7F8CAA] text-white py-2 px-4 rounded-lg shadow hover:bg-[#333446] transition font-semibold text-base border border-[#B8CFCE] cursor-pointer "
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
          로그아웃
        </button>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
  {/* 통계 요약 카드 */}
  <StatsSummarySection />

        <FilterBar filter={filter} setFilter={setFilter} />
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <div className="text-secondary">데이터를 불러오는 중...</div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <svg className="h-10 w-10 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-red-500 font-semibold">{error instanceof Error ? error.message : String(error)}</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {users.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onPending={handlePending}
                  actionLoading={!!actionLoading[user.id]}
                />
              ))}
            </div>
            {users.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-16 gap-3">
                <svg className="h-14 w-14 text-gray-300 mb-2" fill="none" viewBox="0 0 48 48" stroke="currentColor">
                  <circle cx="24" cy="24" r="22" strokeWidth="2" className="text-gray-200" fill="white" />
                  <path d="M32 20a8 8 0 11-16 0 8 8 0 0116 0z" strokeWidth="2" className="text-gray-300" />
                  <path d="M12 38c0-4 8-6 12-6s12 2 12 6" strokeWidth="2" className="text-gray-200" />
                </svg>
                <div className="font-bold text-lg text-gray-500">No users found.</div>
                <div className="text-sm text-gray-400">조건에 맞는 사용자가 없습니다.</div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
    </>
  );
}