<template>
    <div class="d-flex flex-column min-vh-100">
        <header class="bg-primary-subtle"><h2 class="container">PlayBook</h2></header>
        <main class="container flex-grow-1">
            <header><h1>Welcome!</h1></header>
            <form @submit.prevent="handleSubmit" novalidate>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" :class="{'is-invalid': submitted && formErrors.email, 'is-valid': submitted && !formErrors.email && email}" v-model="email" required placeholder="Enter your email">
                    <div class="invalid-feedback">{{ formErrors.email }}</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" :class="{'is-invalid': submitted && formErrors.password, 'is-valid': submitted && !formErrors.password && password}" v-model="password" required placeholder="Enter your password">
                    <div class="invalid-feedback">{{ formErrors.password }}</div>
                </div>
                <button type="submit" class="btn btn-primary w-100 mb-2" id="login">Login</button>
                <div class="text-center my-2">OR</div>
                <button type="button" class="btn btn-outline-secondary w-100" id="signup" @click="handleSignup">Sign-Up</button>
            </form>
        </main>
        <AppFooter></AppFooter>
        <ToastComponent ref="toast" />
    </div>
</template>

<script>
import { sanitizeInput, setCookie } from '../../core/utils.js';
import { provide, ref } from 'vue';
const ToastKey = Symbol('toast');
import AppFooter from '../../components/main/AppFooter.vue';
import ToastComponent from '../../components/ui/Toast.vue';

export default {
    name: 'LoginPage',
    components: { AppFooter, ToastComponent },
    setup() {
        const toast = ref(null);
        provide(ToastKey, toast);
        return { toast };
    },
    data() {
        return {
            email: '',
            password: '',
            formErrors: {
                email: '',
                password: ''
            },
            submitted: false
        };
    },
    methods: {
        validateForm() {
            let isValid = true;
            this.formErrors = { email: '', password: '' };
            
            // Validate email
            if (!this.email || !this.email.trim()) {
                this.formErrors.email = 'Email is required.';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
                this.formErrors.email = 'Please enter a valid email.';
                isValid = false;
            }
            
            // Validate password
            if (!this.password) {
                this.formErrors.password = 'Password is required.';
                isValid = false;
            }
            
            return isValid;
        },
        handleSubmit() {
            this.submitted = true;
            
            if (!this.validateForm()) {
                this.toast.error('Please fill in all fields correctly.');
                return;
            }
            
            // Sanitize email
            const sanitizedEmail = sanitizeInput(this.email.trim());
            console.log('Logging in with:', sanitizedEmail);
            
            // Set the currentUser cookie so other pages can read the logged-in user
            setCookie('currentUser', sanitizedEmail);
            
            this.toast.success(`Logged in as ${sanitizedEmail}`);
        },
        handleSignup() {
            this.toast.info('Signup feature coming soon!');
        }
    }
};
</script>
