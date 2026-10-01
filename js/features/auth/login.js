const { createApp } = Vue;

createApp({
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        handleSubmit() {
            console.log('Logging in with:', this.email);
            alert(`Logged in as ${this.email}`);
        },
        handleSignup() {
            alert('Signup clicked');
        }
    }
}).mount('#app');
