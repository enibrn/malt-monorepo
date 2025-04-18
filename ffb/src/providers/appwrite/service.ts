import { Client, Account } from 'appwrite';
import type { BackendService, BackendServiceFactory } from '../../backend/interfaces';
import type { CloudConfig } from '../../core/types';
import { type MyResult, ResultHelper } from '../../core/result';
import { AppwriteAuthService } from './auth';

export class AppwriteBackendService implements BackendService {
  public auth: AppwriteAuthService;

  constructor(config: CloudConfig) {
    const client = new Client();
    client.setEndpoint(config.endpoint).setProject(config.projectId);

    const account = new Account(client);
    this.auth = new AppwriteAuthService(account);
  }
}

export class AppwriteBackendServiceFactory implements BackendServiceFactory {
  public config: CloudConfig;

  constructor(config: CloudConfig) {
    this.config = config;
  }

  async create(): Promise<MyResult<AppwriteBackendService>> {
    try {
      var result = new AppwriteBackendService(this.config);
      return ResultHelper.success(result);
    } catch (error) {
      return ResultHelper.failure(error);
    }
  }
}