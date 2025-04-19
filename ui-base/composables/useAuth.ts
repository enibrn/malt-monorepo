import {
  type MyResult,
  type MyUser,
} from '@enibrn/malt-ffb';

export function useAuth() {
  const { $backendService } = useNuxtApp();
  const { handleError } = useErrors();

  const user = ref<MyUser | null>(null);

  const init = async () => {
    await executeAuthAction(
      () => $backendService.auth.init(),
      (u) => user.value = u
    );
  };

  const login = async (
    email: string,
    password: string,
    onSuccessUi: () => void) => {
    await executeAuthAction(
      () => $backendService.auth.login(email, password),
      (u) => {
        user.value = u;
        onSuccessUi();
      }
    );
  };

  const register = async (
    email: string,
    password: string,
    username: string, onSuccessUi: () => void) => {
    await executeAuthAction(
      () => $backendService.auth.signup(email, password, username),
      (u) => {
        user.value = u;
        onSuccessUi();
      }
    );
  };

  const logout = async (onSuccessUi: () => void) => {
    await executeAuthAction(
      () => $backendService.auth.logout(),
      () => {
        user.value = null;
        onSuccessUi();
      }
    );
  };

  const executeAuthAction = async <T>(
    action: () => Promise<MyResult<T>>,
    onSuccess?: (data: T) => void
  ) => {
    const result = await action();

    if (!result.success) {
      handleError(result.error);
      return;
    }

    if (onSuccess) {
      onSuccess(result.data);
    }
  };

  return {
    user,
    init,
    login,
    register,
    logout
  };
}