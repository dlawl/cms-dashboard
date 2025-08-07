export type UserStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  statusChangeDate: string;
}

const USERS_KEY = "cms-users";

const defaultUsers: User[] = [
  { id: "1", name: "Alice Kim", email: "alice@example.com", status: "pending", statusChangeDate: "2025-08-07" },
  { id: "2", name: "Bob Lee", email: "bob@example.com", status: "pending", statusChangeDate: "2025-08-07" },
  { id: "3", name: "Charlie Park", email: "charlie@example.com", status: "approved", statusChangeDate: "2025-08-07" },
  { id: "4", name: "Dana Choi", email: "dana@example.com", status: "rejected", statusChangeDate: "2025-08-07" },
];

function getUsersFromStorage(): User[] {
  if (typeof window === "undefined") return defaultUsers;
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : defaultUsers;
}

function saveUsersToStorage(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUsers(filter: UserStatus | "all" = "all"): User[] {
  const users = getUsersFromStorage();
  if (filter === "all") return users;
  return users.filter(u => u.status === filter);
}

export function updateUserStatus(id: string, status: UserStatus) {
  const today = new Date().toISOString().slice(0, 10);
  const users = getUsersFromStorage();
  const updated = users.map(u =>
    u.id === id
      ? { ...u, status, statusChangeDate: today }
      : u
  );
  saveUsersToStorage(updated);
  return updated;
}

export function resetUsers() {
  saveUsersToStorage(defaultUsers);
}