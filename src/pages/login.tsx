import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }
    setError("");
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA] text-[#333446]">
      <div className="w-full max-w-md mx-auto px-4 sm:px-0">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 flex flex-col items-center">
          <img src="/logo.png" alt="서비스 로고" className="h-20 w-auto mx-auto mb-4" />
          <div className="text-2xl font-bold mb-2">Admin Dashboard</div>
          <p className="text-sm text-[#7F8CAA] mb-6">관리자 전용 로그인</p>
          <form
            onSubmit={handleSubmit}
            className="w-full"
          >
            <label className="block mb-2 text-sm font-semibold" htmlFor="email">이메일</label>
            <input
              id="email"
              className="w-full mb-4 px-4 py-3 border border-[#B8CFCE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F8CAA] text-base transition placeholder:text-[#B8CFCE]"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
            <label className="block mb-2 text-sm font-semibold" htmlFor="password">비밀번호</label>
            <div className="relative mb-4">
              <input
                id="password"
                className="w-full px-4 py-3 border border-[#B8CFCE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F8CAA] text-base transition placeholder:text-[#B8CFCE] pr-12"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8CFCE] hover:text-[#7F8CAA] focus:outline-none"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8V7a5 5 0 00-10 0v1" />
                    <rect width="15" height="10" x="4.5" y="11" rx="2.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3" />
                    <rect width="15" height="10" x="4.5" y="10.5" rx="2.5" />
                  </svg>
                )}
              </button>
            </div>
            {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
            <button
              type="submit"
              className="w-full bg-[#7F8CAA] text-white py-3 rounded-lg shadow hover:bg-[#333446] transition font-bold text-base border border-[#B8CFCE] cursor-pointer mt-4 mb-2"
            >
              로그인
            </button>
            <div className="flex justify-between items-center mt-2">
              <a href="#" className="text-xs text-[#7F8CAA] hover:underline">비밀번호 찾기</a>
              {/* <a href="#" className="text-xs text-[#7F8CAA] hover:underline">회원가입</a> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}