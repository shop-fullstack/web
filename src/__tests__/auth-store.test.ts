import { useAuthStore } from "@/store/auth-store";
import type { User } from "@/types";

const mockUser: User = {
  id: "user-1",
  email: "test@bizmart.com",
  business_number: "220-81-62517",
  business_type: "카페/베이커리",
  company_name: "하늘빛 카페",
  owner_name: "김민준",
  grade: "일반회원",
  created_at: "2026-01-01",
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock document.cookie
Object.defineProperty(document, "cookie", {
  writable: true,
  value: "",
});

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorageMock.clear();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it("login: 토큰과 유저 정보를 저장한다", () => {
    useAuthStore.getState().login("test-token-123", mockUser);

    const state = useAuthStore.getState();
    expect(state.token).toBe("test-token-123");
    expect(state.user?.email).toBe("test@bizmart.com");
    expect(state.isAuthenticated).toBe(true);
    expect(localStorageMock.getItem("access_token")).toBe("test-token-123");
  });

  it("logout: 상태를 초기화한다", () => {
    useAuthStore.getState().login("test-token-123", mockUser);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorageMock.getItem("access_token")).toBeNull();
  });

  it("hydrate: localStorage에서 상태를 복원한다", () => {
    localStorageMock.setItem("access_token", "saved-token");
    localStorageMock.setItem("user", JSON.stringify(mockUser));

    useAuthStore.getState().hydrate();

    const state = useAuthStore.getState();
    expect(state.token).toBe("saved-token");
    expect(state.user?.email).toBe("test@bizmart.com");
    expect(state.isAuthenticated).toBe(true);
  });

  it("hydrate: localStorage가 비어있으면 비인증 상태 유지", () => {
    useAuthStore.getState().hydrate();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("updateUser: 유저 정보를 갱신한다", () => {
    useAuthStore.getState().login("test-token", mockUser);
    useAuthStore.getState().updateUser({
      ...mockUser,
      company_name: "변경된 카페",
    });

    expect(useAuthStore.getState().user?.company_name).toBe("변경된 카페");
  });
});
