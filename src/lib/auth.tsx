import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getToken, setToken, api, type User } from "./api";

type AuthCtx = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (t: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTok] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      api.get("/auth/me").then(setUser).catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <Ctx.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login: (t) => { setToken(t); setTok(t); },
        logout: () => { setToken(null); setTok(null); setUser(null); },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
