import { expect, test, describe, beforeEach } from "bun:test";
import { AppwriteAuthService } from "../../../src/providers/appwrite/auth";
import { createMockAppwriteSDK, MockAccount } from "../../mocks/appwrite-mocks";
import { ResultHelper } from "../../../src/core/result";

describe("AppwriteAuthService", () => {
  let mockAccount: MockAccount;
  let authService: AppwriteAuthService;

  beforeEach(() => {
    const mocks = createMockAppwriteSDK();
    mockAccount = mocks.mockAccount;
    authService = new AppwriteAuthService(mockAccount as any);
  });

  describe("login", () => {
    test("should return success result with user data when login succeeds", async () => {
      const result = await authService.login("test@example.com", "password");
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("user-123");
        expect(result.data.email).toBe("test@example.com");
        expect(result.data.username).toBe("Test User");
      }
    });

    test("should return failure result when login fails", async () => {
      const error = new Error("Invalid credentials");
      const restore = mockAccount.setThrowOnMethod("createEmailPasswordSession", error);
      
      const result = await authService.login("test@example.com", "wrong-password");
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe("Invalid credentials");
      }
      
      restore(); // Restore original method
    });
  });

  describe("signup", () => {
    test("should create user and then log them in", async () => {
      const result = await authService.signup("new@example.com", "password", "New User");
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe("user-123");
        expect(result.data.email).toBe("test@example.com");
        expect(result.data.username).toBe("Test User");
      }
    });

    test("should return failure result when signup fails", async () => {
      const error = new Error("Email already exists");
      const restore = mockAccount.setThrowOnMethod("create", error);
      
      const result = await authService.signup("existing@example.com", "password", "Existing User");
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe("Email already exists");
      }
      
      restore(); // Restore original method
    });
  });

  describe("logout", () => {
    test("should return success result when logout succeeds", async () => {
      const result = await authService.logout();
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeUndefined();
      }
    });

    test("should return failure result when logout fails", async () => {
      const error = new Error("Session not found");
      const restore = mockAccount.setThrowOnMethod("deleteSession", error);
      
      const result = await authService.logout();
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe("Session not found");
      }
      
      restore(); // Restore original method
    });
  });

  describe("init", () => {
    test("should return user data when session is valid", async () => {
      const result = await authService.init();
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.id).toBe("user-123");
        expect(result.data?.email).toBe("test@example.com");
        expect(result.data?.username).toBe("Test User");
      }
    });

    test("should return null when no active session exists", async () => {
      const error = new Error("No active session");
      const restore = mockAccount.setThrowOnMethod("get", error);
      
      const result = await authService.init();
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeNull();
      
      restore(); // Restore original method
    });
  });
});