import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getToken, setToken } from "./api";

type AuthCtx = {
  token: string | null;
  isAuthenticated: boolean;
  login: (t: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTok] = useState<string | null>(null);

  useEffect(() => {
    setTok(getToken());
  }, []);

  return (
    <Ctx.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login: (t) => {
          setToken(t);
          setTok(t);
        },
        logout: () => {
          setToken(null);
          setTok(null);
        },
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
