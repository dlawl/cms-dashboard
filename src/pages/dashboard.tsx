import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getUsers, updateUserStatus, User, UserStatus } from "../services/userService";
import { UserCard } from "../components/UserCard";
import { FilterBar } from "../components/FilterBar";
import { toast } from "react-hot-toast";
export default function DashboardPage() {
  const { authenticated, logout } = useAuth(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<UserStatus | "all">("all");

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleApprove = (id: string) => {
    const updated = updateUserStatus(id, "approved");
    setUsers([...updated]);
    toast.success("승인 완료!");
  };

  const handleReject = (id: string) => {
    const updated = updateUserStatus(id, "rejected");
    setUsers([...updated]);
    toast.error("반려 처리됨");
  };

  const handlePending = (id: string) => {
    const updated = updateUserStatus(id, "pending");
    setUsers([...updated]);
    toast("대기 상태로 변경됨");
  };

  const filteredUsers =
    filter === "all" ? users : users.filter(u => u.status === filter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm rounded-b-lg">
        <img src="/logo.png" alt="서비스 로고" className="h-16 w-auto min-w-[64px] max-h-24 cursor-pointer" />
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-[#7F8CAA] text-white py-2 px-4 rounded-lg shadow hover:bg-[#333446] transition font-semibold text-base border border-[#B8CFCE] cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
          로그아웃
        </button>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <FilterBar filter={filter} setFilter={setFilter} />
        <div className="grid gap-6 sm:grid-cols-2 mt-6">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onApprove={handleApprove}
              onReject={handleReject}
              onPending={handlePending}
            />
          ))}
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center text-secondary mt-12">No users found.</div>
        )}
      </main>
    </div>
  );
}