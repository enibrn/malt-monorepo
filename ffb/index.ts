import { buildBackendService } from './src/factory';

// Re-export dei tipi core
export type { MyUser, CloudConfig } from './src/core/types';
export { type MyResult, MyError } from './src/core/result';

// Re-export delle interfacce
export type { AuthService } from './src/auth/interfaces';
export type { BackendService, BackendServiceFactory } from './src/backend/interfaces';

// Re-export della funzione principale
export { buildBackendService };