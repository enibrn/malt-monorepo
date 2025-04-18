import type { CloudConfig } from '../core/types';
import type { AuthService } from '../auth/interfaces';
import { type MyResult } from '../core/result';

export interface BackendService {
  auth: AuthService;
}

export interface BackendServiceFactory {
  config: CloudConfig;
  create(): Promise<MyResult<BackendService>>;
}