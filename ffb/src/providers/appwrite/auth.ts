import { Account, type Models, ID } from 'appwrite';
import type { AuthService } from '../../auth/interfaces';
import type { MyUser } from '../../core/types';
import { type MyResult, ResultHelper } from '../../core/result';

export class AppwriteAuthService implements AuthService {
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