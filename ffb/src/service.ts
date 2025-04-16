import type { MyUser, CloudConfig } from './types';
import { type MyResult } from './result';

export interface AuthService {
  login(email: string, password: string): Promise<MyResult<MyUser>>;
  signup(email: string, password: string, username: string): Promise<MyResult<MyUser>>;
  logout(): Promise<MyResult<void>>;
  init(): Promise<MyResult<MyUser|null>>;
}

export interface BackendService {
  auth: AuthService;
}

export interface BackendServiceFactory {
  config: CloudConfig;
  create(): Promise<MyResult<BackendService>>;
}