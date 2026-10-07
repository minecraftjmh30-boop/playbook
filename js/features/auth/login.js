const { createApp } = Vue;

createApp({
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
                window.toast.error('Please fill in all fields correctly.');
                return;
            }
            
            // Sanitize email
            const sanitizedEmail = window.utils.sanitizeInput(this.email.trim());
            console.log('Logging in with:', sanitizedEmail);
            window.toast.success(`Logged in as ${sanitizedEmail}`);
        },
        handleSignup() {
            window.toast.info('Signup feature coming soon!');
        }
    }
}).mount('#app');
