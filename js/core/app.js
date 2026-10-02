const { createApp } = Vue;

createApp({
    data() {
        return {
            huddles: JSON.parse(localStorage.getItem('huddles')) || [
                { id: 1, name: 'Virtual Huddle #123', description: 'This is a huddle where users can collaborate and chat. The schedule shows upcoming events for this huddle.', status: 'Planning', location: 'Virtual', friends: '', code: '123', owner: 'User 1' },
                { id: 2, name: 'Design Workshop', description: 'Collaborative design session for the upcoming project.', status: 'Completed', location: 'Workshop', friends: '', code: '456', owner: 'User 2' }
            ],
            showChoiceModal: false,
            showJoinModal: false,
            joinCode: ''
        };
    },
    methods: {
        openJoinModal() {
            this.showJoinModal = true;
        },
        joinHuddle() {
            const huddle = this.huddles.find(r => r.code === this.joinCode);
            if (huddle) {
                this.showJoinModal = false;
                this.joinCode = '';
                window.location.href = `huddle.html?id=${huddle.id}`;
            } else {
                alert('Invalid huddle code!');
            }
        },
        editHuddle(huddle) {
            console.log('Editing huddle:', huddle.name);
        },
        deleteHuddle(id) {
            if (confirm('Are you sure you want to delete this huddle?')) {
                this.huddles = this.huddles.filter(huddle => huddle.id !== id);
            }
        },
        leaveHuddle(huddle) {
            console.log('Leaving huddle:', huddle.name);
        }
    }
}).mount('#app');
