import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const AUTH_KEY = "cms-authenticated";

export function useAuth(redirectIfUnauth = false) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem(AUTH_KEY) === "true";
    setAuthenticated(isAuth);

    if (redirectIfUnauth && !isAuth) {
      router.replace("/login");
    }
  }, [redirectIfUnauth, router]);

  const login = () => {
    localStorage.setItem(AUTH_KEY, "true");
    setAuthenticated(true);
    router.replace("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthenticated(false);
    router.replace("/login");
  };

  return { authenticated, login, logout };
}