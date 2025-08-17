import axios from "axios";

export type UserStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  statusChangeDate?: string;
}

const API_URL = "http://localhost:4000/api";

// axios 인스턴스 생성: 매 요청마다 토큰 자동 주입
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export async function getUsers(filter: UserStatus | "all" = "all"): Promise<User[]> {
  const res = await api.get(`/users${filter && filter !== "all" ? `?status=${filter}` : ""}`);
  return res.data;
}

export async function updateUserStatus(id: string, status: UserStatus): Promise<void> {
  await api.patch(`/users/${id}/status`, { status });
}