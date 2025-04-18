import { AppwriteBackendServiceFactory } from './providers/appwrite';
import type { CloudConfig } from './core/types';
import type { BackendService } from './backend/interfaces';
import { type MyResult } from './core/result';

export async function buildBackendService(config: CloudConfig): Promise<MyResult<BackendService>> {
  const backendServiceFactory = new AppwriteBackendServiceFactory(config);
  return backendServiceFactory.create();
}