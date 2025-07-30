import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getUsers, updateUserStatus, User, UserStatus } from "../services/userService";
import { UserCard } from "../components/UserCard";
import { FilterBar } from "../components/FilterBar";

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
  };

  const handleReject = (id: string) => {
    const updated = updateUserStatus(id, "rejected");
    setUsers([...updated]);
  };

  const filteredUsers =
    filter === "all" ? users : users.filter(u => u.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300 transition"
        >
          Logout
        </button>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <FilterBar filter={filter} setFilter={setFilter} />
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 mt-12">No users found.</div>
        )}
      </main>
    </div>
  );
}