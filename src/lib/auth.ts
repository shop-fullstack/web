import type { User } from "@/types";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function setToken(token: string): void {
  localStorage.setItem("access_token", token);
}

export function removeToken(): void {
  localStorage.removeItem("access_token");
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function setUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function removeUser(): void {
  localStorage.removeItem("user");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
