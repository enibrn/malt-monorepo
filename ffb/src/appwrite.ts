import { Client, Account, type Models, ID } from 'appwrite';

import type { AuthService, BackendService, BackendServiceFactory } from './service';
import type { MyUser, CloudConfig } from './types';

import { type MyResult, ResultHelper } from './result';

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

export class AppwriteBackendService implements BackendService {
  public auth: AuthService;

  constructor(config: CloudConfig) {
    const client = new Client();
    client.setEndpoint(config.endpoint).setProject(config.projectId);

    const account = new Account(client);
    this.auth = new AppwriteAuthService(account);
  }
}

class AppwriteAuthService implements AuthService {
  private account: Account;

  constructor(account: Account) {
    this.account = account;
  }

  async signup(email: string, password: string, username: string): Promise<MyResult<MyUser>> {
    try {
      await this.account.create(ID.unique(), email, password, username);
      return this.login(email, password);
    } catch (error) {
      return ResultHelper.failure(error);
    }
  }

  async login(email: string, password: string): Promise<MyResult<MyUser>> {
    try {
      await this.account.createEmailPasswordSession(email, password);
      const user = await this.account.get();
      return ResultHelper.success(this.mapUser(user));
    } catch (error) {
      return ResultHelper.failure(error);
    }
  }  

  async logout(): Promise<MyResult<void>> {
    try {
      await this.account.deleteSession('current');
      return ResultHelper.success(undefined);
    } catch (error) {
      return ResultHelper.failure(error);
    }
  }

  async init(): Promise<MyResult<MyUser|null>> {
    try {
      const user = await this.account.get();
      return ResultHelper.success(this.mapUser(user));
    } catch (error) {
      // for now let's assume the error is always that the user is not logged in
      // in reality we should check the type of error and take a different action
      return ResultHelper.success(null);
    }
  }

  private mapUser(user: Models.User<Models.Preferences>): MyUser {
    return {
      id: user.$id,
      email: user.email,
      username: user.name,
    };
  }
}

