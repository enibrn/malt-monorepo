// Mock implementations for Appwrite SDK

export class MockClient {
  setEndpoint() { return this; }
  setProject() { return this; }
}

export class MockAccount {
  private mockUserData = {
    $id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    preferences: {}
  };

  constructor(public client: any) {}

  async create() {
    return Promise.resolve(this.mockUserData);
  }
  
  async createEmailPasswordSession() {
    return Promise.resolve({
      $id: 'session-123',
      userId: this.mockUserData.$id,
    });
  }
  
  async get() {
    return Promise.resolve(this.mockUserData);
  }
  
  async deleteSession() {
    return Promise.resolve({ success: true });
  }

  // For testing failure scenarios
  setThrowOnMethod(methodName: string, error: Error) {
    const originalMethod = (this as any)[methodName];
    (this as any)[methodName] = () => Promise.reject(error);
    return () => {
      (this as any)[methodName] = originalMethod;
    };
  }
}

export const createMockAppwriteSDK = () => {
  const mockClient = new MockClient();
  const mockAccount = new MockAccount(mockClient);
  
  return {
    mockClient,
    mockAccount,
  };
};