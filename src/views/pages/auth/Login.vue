<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import { authService } from '@/services/AuthService';
import { useRouter } from 'vue-router';
import { GoogleLogin } from 'vue3-google-login';

// Refs para manejo de estado y datos
const email = ref('');
const password = ref('');
const router = useRouter();

// Manejo de login
const handleLogin = async () => {
  try {
    const { token } = await authService.login(email.value, password.value); // Obtén el token directamente
    if (token) {
      localStorage.setItem('token', token); // Guarda el token en el localStorage
      router.push('/home'); // Redirige a la página de inicio
    } else {
      throw new Error('Token not found');
    }
  } catch (error) {
    console.error('Login failed:', error); // Para depuración
    alert('Login failed: ' + (error.message || 'Invalid credentials'));
  }
};

// Callback para Google Login
const callback = async (response) => {
  try {
    const googleToken = response.credential; // Obtén el token de Google
    const { token } = await authService.loginWithGoogle(googleToken);
    if (token) {
      localStorage.setItem('token', token); // Guarda el token en el localStorage
      router.push('/home'); // Redirige a la página de inicio
    } else {
      throw new Error('Token not found');
    }
  } catch (error) {
    console.error('Google login failed:', error); // Para depuración
    alert('Google login failed: ' + (error.message || 'Invalid credentials'));
  }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to ITTools</div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>
                    <form @submit.prevent="handleLogin" class="flex flex-col items-center">
                        <div class="w-full">
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-4" v-model="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                            <div class="flex items-center justify-between mt-2 mb-4 gap-8">
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                            </div>
                            <Button label="Sign In" type="submit" class="w-full mb-4"></Button>
                        </div>
                    </form>

                    <div class="flex flex-col items-center">
                        <div>
                            <GoogleLogin :callback="callback" auto-login class="mt-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.btn {
    /* Add button styles */
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: var(--primary-color);
    color: #fff;
    cursor: pointer;
}

.btn-primary {
    background-color: var(--primary-color);
}
</style>
