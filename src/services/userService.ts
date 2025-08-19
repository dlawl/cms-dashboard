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

// 401(Unauthorized) 응답 시 자동 로그아웃 및 로그인 페이지 이동
if (typeof window !== "undefined") {
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("cms-authenticated");
        // 로그인 페이지로 이동
        window.location.href = "/login?expired=1";
      }
      return Promise.reject(error);
    }
  );
}

export async function getUsers(filter: UserStatus | "all" = "all"): Promise<User[]> {
  const res = await api.get(`/users${filter && filter !== "all" ? `?status=${filter}` : ""}`);
  return res.data;
}

export async function updateUserStatus(id: string, status: UserStatus): Promise<void> {
  await api.patch(`/users/${id}/status`, { status });
}