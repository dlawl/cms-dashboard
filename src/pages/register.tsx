import { useState } from "react";
import { Listbox } from '@headlessui/react';
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { registerUser } from "../services/userService";

const fieldBase =
  "w-full mb-4 h-12 px-4 border border-[#B8CFCE] rounded-lg " +
  "focus:outline-none focus:ring-2 focus:ring-[#7F8CAA] " +
  "text-base transition placeholder:text-[#B8CFCE] bg-white";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError("이메일, 비밀번호, 이름을 모두 입력해주세요.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await registerUser({ email, password, name, role });
      setSuccess("회원가입이 완료되었습니다. 로그인 해주세요.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
        setError((err.response as { data?: { message?: string } }).data?.message || "회원가입에 실패했습니다.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("회원가입에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>회원가입 | Admin Dashboard</title>
        <meta name="description" content="관리자 회원가입 페이지" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA] text-[#333446]">
        <div className="w-full max-w-md mx-auto px-4 sm:px-0">
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 flex flex-col items-center">
            <Image src="/logo.png" alt="서비스 로고" width={80} height={80} className="h-20 w-auto mx-auto mb-4" priority />
            <div className="text-2xl font-bold mb-2">Admin Dashboard</div>
            <p className="text-sm text-[#7F8CAA] mb-6">관리자 전용 회원가입</p>
            <form onSubmit={handleSubmit} className="w-full">
              <label className="block mb-2 text-sm font-semibold" htmlFor="email">이메일</label>
              <input
                id="email"
                className={fieldBase} 
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
                autoFocus
                required
                disabled={loading}
              />
              <label className="block mb-2 text-sm font-semibold" htmlFor="password">비밀번호</label>
              <input
                id="password"
                className={fieldBase} 
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <label className="block mb-2 text-sm font-semibold" htmlFor="name">이름</label>
              <input
                id="name"
                className={fieldBase} 
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
                disabled={loading}
              />
              <label className="block mb-2 text-sm font-semibold" htmlFor="role">권한</label>
              <Listbox value={role} onChange={setRole} disabled={loading}>
                {({ open }) => (
                    <div className="relative mb-4">
                    <Listbox.Button
                        className={`${fieldBase} pr-14 leading-none flex items-center justify-between cursor-pointer
                                    ${open ? 'rounded-b-none border-b-0' : ''} 
                                    ${loading ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                        <span>{role === 'admin' ? '관리자' : '일반 사용자'}</span>
                        <svg
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#333446]"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                        >
                        <path d="M6 9l6 6 6-6" />
                        </svg>
                    </Listbox.Button>

                    <Listbox.Options
                        className={`absolute left-0 top-full z-10 w-full bg-white text-base text-[#333446]
                                    border border-[#B8CFCE] mt-0 -mt-px   /* ← 1px 겹쳐서 틈 제거 */
                                    ${open ? 'rounded-t-none' : 'rounded-lg'} rounded-b-lg shadow-xl focus:outline-none`}
                    >
                        <Listbox.Option
                        key="user" value="user"
                        className={({ active, selected }) =>
                            `px-4 py-3 cursor-pointer ${active ? 'bg-[#F5F6FA]' : ''} ${selected ? 'font-bold text-[#7F8CAA]' : ''}`
                        }
                        >
                        일반 사용자
                        </Listbox.Option>
                        <Listbox.Option
                        key="admin" value="admin"
                        className={({ active, selected }) =>
                            `px-4 py-3 cursor-pointer ${active ? 'bg-[#F5F6FA]' : ''} ${selected ? 'font-bold text-[#7F8CAA]' : ''}`
                        }
                        >
                        관리자
                        </Listbox.Option>
                    </Listbox.Options>
                    </div>
                )}
            </Listbox>

              {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
              {success && <div className="mb-4 text-sm text-green-600">{success}</div>}
              <button
                type="submit"
                className="w-full bg-[#7F8CAA] text-white py-3 rounded-lg shadow hover:bg-[#333446] transition font-bold text-base border border-[#B8CFCE] cursor-pointer mt-4 mb-2 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "가입 중..." : "회원가입"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">이미 계정이 있으신가요?</span>
              <button
                type="button"
                className="ml-2 text-primary underline text-sm"
                onClick={() => router.push("/login")}
                disabled={loading}
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
