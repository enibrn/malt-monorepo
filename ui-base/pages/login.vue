<script lang="ts" setup>
definePageMeta({ layout: 'guest'});

const { login } = useAuth();
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async (event: Event) => {
  loading.value = true;
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const onSuccessUi = () => {
    form.reset();
    loading.value = false;
    navigateTo('/');
  };
  
  await login(email, password, onSuccessUi);
};
</script>

<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <h1>Login</h1>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            placeholder="Enter your email"
            autocomplete="email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            placeholder="Enter your password"
            autocomplete="current-password"
          />
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="login-button" 
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
        
        <div class="form-footer">
          <p>Don't have an account? <NuxtLink to="/register">Register</NuxtLink></p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #f5f5f5;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #444;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

.error-message {
  color: #e53935;
  font-size: 0.875rem;
  margin-top: -0.5rem;
}

.form-actions {
  margin-top: 0.5rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover:not(:disabled) {
  background-color: #0055aa;
}

.login-button:disabled {
  background-color: #8cb8e0;
  cursor: not-allowed;
}

.form-footer {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
}

.form-footer a {
  color: #0066cc;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>