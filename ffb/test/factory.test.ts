import { expect, test, describe, mock, beforeEach, afterEach } from "bun:test";
import { buildBackendService } from "../src/factory";
import { AppwriteBackendServiceFactory } from "../src/providers/appwrite/service";
import { AppwriteBackendService } from "../src/providers/appwrite/service";
import { ResultHelper } from "../src/core/result";
import type { BackendService } from "../src/backend/interfaces";
import type { CloudConfig } from "../src/core/types";
import type { MyResult } from "../src/core/result";

// Create jest-like mocking
const mockCreate = mock((config: CloudConfig) => Promise.resolve(ResultHelper.success({} as BackendService)));

// Mock the module instead of the global object
mock.module("../src/providers/appwrite", () => {
  return {
    AppwriteBackendServiceFactory: class MockFactory {
      public config: CloudConfig;
      
      constructor(config: CloudConfig) {
        this.config = config;
      }
      
      create(): Promise<MyResult<BackendService>> {
        return mockCreate(this.config);
      }
    },
    AppwriteBackendService: class MockService {
      constructor(public config: CloudConfig) {}
    }
  };
});

describe("buildBackendService", () => {
  const testConfig: CloudConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    projectId: "test-project-id"
  };
  
  beforeEach(() => {
    mockCreate.mockClear();
  });

  test("should create and return a backend service", async () => {
    // Setup mock implementation for this test
    const mockService = new AppwriteBackendService(testConfig);
    mockCreate.mockImplementation(() => Promise.resolve(ResultHelper.success(mockService)));
    
    const result = await buildBackendService(testConfig);
    
    // Verify the factory was called with correct config
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate.mock?.calls?.[0]?.[0]).toEqual(testConfig);
    
    // Verify the result
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(mockService);
    }
  });

  test("should handle factory creation errors", async () => {
    // Setup mock implementation for this test to simulate failure
    const mockError = new Error("Factory creation failed");
    mockCreate.mockImplementation(() => Promise.resolve(ResultHelper.failure(mockError)));
    
    const result = await buildBackendService(testConfig);
    
    // Verify the factory was called
    expect(mockCreate).toHaveBeenCalledTimes(1);
    
    // Verify the error was properly handled
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe("Factory creation failed");
    }
  });
});