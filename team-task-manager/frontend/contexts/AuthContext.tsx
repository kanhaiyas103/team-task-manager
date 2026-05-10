import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { api, getErrorMessage } from "../lib/api";
import { storage } from "../lib/storage";
import { AuthResponse, User } from "../types";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Member";
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginInput) => Promise<void>;
  signup: (payload: SignupInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const existingToken = storage.getToken();
    const existingUser = storage.getUser();
    if (existingToken && existingUser) {
      setToken(existingToken);
      setUser(existingUser);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    storage.setToken(data.token);
    storage.setUser(data.user);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (payload: LoginInput) => {
    const response = await api.post<AuthResponse>("/auth/login", payload);
    handleAuthSuccess(response.data);
    router.push("/dashboard");
  };

  const signup = async (payload: SignupInput) => {
    const response = await api.post<AuthResponse>("/auth/signup", payload);
    handleAuthSuccess(response.data);
    router.push("/dashboard");
  };

  const logout = () => {
    storage.clearAll();
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login: async (payload) => {
        try {
          await login(payload);
        } catch (error) {
          throw new Error(getErrorMessage(error));
        }
      },
      signup: async (payload) => {
        try {
          await signup(payload);
        } catch (error) {
          throw new Error(getErrorMessage(error));
        }
      },
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
