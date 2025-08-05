import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import DashboardPage from "./dashboard";

export default function Home() {
  const { authenticated } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
    if (!authenticated) {
      router.replace("/login");
    }
  }, [authenticated, router]);

  // 인증 체크 중엔 아무것도 안 보여줌
  if (!checked) return null;

  // 인증 O: 대시보드 바로 렌더 (주소창은 /)
  if (authenticated) {
    return <DashboardPage />;
  }

  // 인증 X: /login으로 이동 중이므로 아무것도 렌더링하지 않음
  return null;
}