const { createApp } = Vue;

createApp({
    data() {
        return {
            huddle: {
                name: '',
                description: '',
                location: ''
            }
        };
    },
    methods: {
        handleSubmit() {
            if (this.huddle.name && this.huddle.description) {
                console.log('Creating huddle with:', this.huddle);
                alert(`Huddle "${this.huddle.name}" created successfully! (Simulated)`);
                window.location.href = 'index.html';
            } else {
                alert('Please fill in all fields.');
            }
        }
    }
}).mount('#app');