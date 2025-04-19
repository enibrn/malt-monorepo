<script lang="ts" setup>
definePageMeta({ layout: 'guest'});

const { register } = useAuth();
const loading = ref(false);
const errorMessage = ref('');

const handleRegister = async (event: Event) => {
  loading.value = true;
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;

  const onSuccessUi = () => {
    form.reset();
    loading.value = false;
    navigateTo('/');
  };
  
  await register(email, password, username, onSuccessUi);
};
</script>

<template>
  <div class="register-container">
    <div class="register-form-wrapper">
      <h1>Register</h1>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            required 
            placeholder="Enter your username"
            autocomplete="username"
          />
        </div>
        
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
            autocomplete="new-password"
            minlength="6"
          />
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            class="register-button" 
            :disabled="loading"
          >
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>
        </div>
        
        <div class="form-footer">
          <p>Already have an account? <NuxtLink to="/login">Login</NuxtLink></p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #f5f5f5;
}

.register-form-wrapper {
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

.register-form {
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

.register-button {
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

.register-button:hover:not(:disabled) {
  background-color: #0055aa;
}

.register-button:disabled {
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