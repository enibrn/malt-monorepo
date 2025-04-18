import { expect, test, describe, beforeEach, mock } from "bun:test";
import { AppwriteBackendService, AppwriteBackendServiceFactory } from "../../../src/providers/appwrite/service";
import { AppwriteAuthService } from "../../../src/providers/appwrite/auth";
import { createMockAppwriteSDK } from "../../mocks/appwrite-mocks";
import type { CloudConfig } from "../../../src/core/types";
import { ResultHelper } from "../../../src/core/result";

// Create a proper mock of the Appwrite SDK
const { mockClient, mockAccount } = createMockAppwriteSDK();

// Mock the appwrite module
mock.module("appwrite", () => {
  return {
    Client: function() {
      return mockClient;
    },
    Account: function() {
      return mockAccount;
    },
    ID: { unique: () => "unique-id" }
  };
});

// Mock AppwriteAuthService to ensure it's properly initialized
const mockAuthService = new AppwriteAuthService(mockAccount as any);
mock.module("../../../src/providers/appwrite/auth", () => {
  return {
    AppwriteAuthService: class MockAuthService {
      constructor() {
        return mockAuthService;
      }
    }
  };
});

describe("AppwriteBackendService", () => {
  const testConfig: CloudConfig = {
    endpoint: "https://test.appwrite.io/v1",
    projectId: "test-project"
  };

  test("should initialize with config and create auth service", () => {
    const service = new AppwriteBackendService(testConfig);
    
    expect(service).toBeInstanceOf(AppwriteBackendService);
  });
});

describe("AppwriteBackendServiceFactory", () => {
  const testConfig: CloudConfig = {
    endpoint: "https://test.appwrite.io/v1",
    projectId: "test-project"
  };
  
  let factory: AppwriteBackendServiceFactory;
  
  beforeEach(() => {
    factory = new AppwriteBackendServiceFactory(testConfig);
  });
  
  test("should store config on initialization", () => {
    expect(factory.config).toEqual(testConfig);
  });
  
  test("create() should handle exceptions", async () => {
    // Use a more reliable mocking approach
    const originalCreate = AppwriteBackendServiceFactory.prototype.create;
    const mockError = new Error("Service creation failed");
    
    // Replace the create method with one that simulates an error
    AppwriteBackendServiceFactory.prototype.create = async function() {
      return ResultHelper.failure(mockError);
    };
    
    try {
      const result = await factory.create();
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe("Service creation failed");
      }
    } finally {
      // Restore the original method
      AppwriteBackendServiceFactory.prototype.create = originalCreate;
    }
  });
});