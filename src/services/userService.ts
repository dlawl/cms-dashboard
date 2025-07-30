export type UserStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
}

const USERS_KEY = "cms-users";

const defaultUsers: User[] = [
  { id: "1", name: "Alice Kim", email: "alice@example.com", status: "pending" },
  { id: "2", name: "Bob Lee", email: "bob@example.com", status: "pending" },
  { id: "3", name: "Charlie Park", email: "charlie@example.com", status: "approved" },
  { id: "4", name: "Dana Choi", email: "dana@example.com", status: "rejected" },
];

function getUsersFromStorage(): User[] {
  if (typeof window === "undefined") return defaultUsers;
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : defaultUsers;
}

function saveUsersToStorage(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUsers(): User[] {
  return getUsersFromStorage();
}

export function updateUserStatus(id: string, status: UserStatus) {
  const users = getUsersFromStorage();
  const updated = users.map(u => (u.id === id ? { ...u, status } : u));
  saveUsersToStorage(updated);
  return updated;
}

export function resetUsers() {
  saveUsersToStorage(defaultUsers);
}