import axios from "axios";

export type UserStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  statusChangeDate?: string;
}

// axios 인스턴스 생성: 매 요청마다 토큰 자동 주입
const api = axios.create({ baseURL: '/api' });
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

// 회원가입 API
export async function registerUser({ email, password, name, role }: { email: string; password: string; name: string; role?: string; }) {
  return api.post("/auth/register", { email, password, name, role });
}

export async function getUsers(filter: UserStatus | "all" = "all"): Promise<User[]> {
  const res = await api.get(`/users${filter && filter !== "all" ? `?status=${filter}` : ""}`);
  return res.data;
}

export async function updateUserStatus(id: string, status: UserStatus): Promise<void> {
  await api.patch(`/users/${id}/status`, { status });
}