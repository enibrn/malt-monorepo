import type { MyUser } from '../core/types';
import { type MyResult } from '../core/result';

export interface AuthService {
  login(email: string, password: string): Promise<MyResult<MyUser>>;
  signup(email: string, password: string, username: string): Promise<MyResult<MyUser>>;
  logout(): Promise<MyResult<void>>;
  init(): Promise<MyResult<MyUser|null>>;
}