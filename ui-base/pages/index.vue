<script setup lang="ts">
import {
  type MyResult,
  type MyUser,
  type MyError
} from '@enibrn/malt-ffb';

const { baseLayer } = useAppConfig();
const config = useRuntimeConfig();
const { $backendService } = useNuxtApp();

const loggedInUser = ref<MyUser|null>(null);
const email = ref<string>('');
const password = ref<string>('');
const name = ref<string>('');

function handleError(error: MyError) {
  console.error(error);
  alert(error.toString());
}

// Metodo helper che unifica la logica comune
const executeAuthAction = async <T>(
  action: () => Promise<MyResult<T>>, 
  onSuccess?: (data: T) => void
) => {
  const result = await action();
  console.log(result);
  
  if (!result.success) {
    handleError(result.error);
    return;
  }
  
  if (onSuccess) {
    onSuccess(result.data);
  }
};

console.log('config', config.public.endpoint, config.public.projectId);

onMounted(async () => {
  await executeAuthAction(
    () => $backendService.auth.init(),
    (user) => loggedInUser.value = user
  );
});

const login = async () => {
  await executeAuthAction(
    () => $backendService.auth.login(email.value, password.value),
    (user) => loggedInUser.value = user
  );
};

const register = async () => {
  await executeAuthAction(
    () => $backendService.auth.signup(email.value, password.value, name.value),
    (user) => loggedInUser.value = user
  );
};

const logout = async () => {
  await executeAuthAction(
    () => $backendService.auth.logout(),
    () => loggedInUser.value = null
  );
};
</script>

<template>
  <div>
    <h2>{{ baseLayer.name }}</h2>
    <p>
      {{ loggedInUser ? `Logged in as ${loggedInUser.username}` : 'Not logged in' }}
    </p>

    <form>
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <input type="text" placeholder="Name" v-model="name" />
      <button type="button" @click="login">Login</button>
      <button type="button" @click="register">
        Register
      </button>
      <button type="button" @click="logout">
        Logout
      </button>
    </form>
  </div>
</template>
