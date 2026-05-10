import { User } from "../types";

const TOKEN_KEY = "ttm_token";
const USER_KEY = "ttm_user";

export const storage = {
  getToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser(): User | null {
    if (typeof window === "undefined") {
      return null;
    }
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  },
  clearAll(): void {
    this.clearToken();
    this.clearUser();
  }
};
