import { AppwriteBackendServiceFactory } from './src/appwrite';
import type { CloudConfig } from './src/types';
import type { BackendService } from './src/service';
import { type MyResult } from './src/result';

export async function buildBackendService(config: CloudConfig): Promise<MyResult<BackendService>> {
  const backendServiceFactory = new AppwriteBackendServiceFactory(config);
  return backendServiceFactory.create();
}

export type { MyUser, CloudConfig } from './src/types';
export type { AuthService, BackendService } from './src/service';
export { type MyResult, MyError } from './src/result';