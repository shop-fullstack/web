/**
 * 인증 통합 테스트
 * auth.ts 유틸 + auth-store 연동을 검증합니다.
 */
import { getToken, setToken, removeToken, getUser, setUser, removeUser, isAuthenticated } from "@/lib/auth";
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

describe("auth.ts 유틸리티", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "";
  });

  describe("Token 관리", () => {
    it("setToken → getToken으로 토큰을 저장/조회한다", () => {
      setToken("my-jwt-token");
      expect(getToken()).toBe("my-jwt-token");
    });

    it("removeToken으로 토큰을 삭제한다", () => {
      setToken("my-jwt-token");
      removeToken();
      expect(getToken()).toBeNull();
    });

    it("setToken은 쿠키에도 저장한다", () => {
      setToken("cookie-test-token");
      expect(document.cookie).toContain("access_token=cookie-test-token");
    });
  });

  describe("User 관리", () => {
    it("setUser → getUser로 유저 정보를 저장/조회한다", () => {
      setUser(mockUser);
      const user = getUser();
      expect(user?.email).toBe("test@bizmart.com");
      expect(user?.company_name).toBe("하늘빛 카페");
    });

    it("removeUser로 유저 정보를 삭제한다", () => {
      setUser(mockUser);
      removeUser();
      expect(getUser()).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("토큰이 있으면 true", () => {
      setToken("exists");
      expect(isAuthenticated()).toBe(true);
    });

    it("토큰이 없으면 false", () => {
      expect(isAuthenticated()).toBe(false);
    });

    it("토큰 삭제 후 false", () => {
      setToken("temp");
      removeToken();
      expect(isAuthenticated()).toBe(false);
    });
  });
});
