const { createApp } = Vue;

createApp({
    data() {
        return {
            room: {
                name: '',
                description: '',
                location: ''
            }
        };
    },
    methods: {
        handleSubmit() {
            if (this.room.name && this.room.description) {
                console.log('Creating room with:', this.room);
                alert(`Room "${this.room.name}" created successfully! (Simulated)`);
                // In a real app, you would send this data to a server and then redirect.
                window.location.href = 'index.html';
            } else {
                alert('Please fill in all fields.');
            }
        }
    }
}).mount('#app');