const { createApp } = Vue;

createApp({
    data() {
        return {
            huddles: [
                { id: 1, name: 'Virtual Huddle #123', description: 'This is a huddle where users can collaborate and chat. The schedule shows upcoming events for this huddle.', status: 'Planning', location: 'Virtual', friends: '', code: '123' },
                { id: 2, name: 'Design Workshop', description: 'Collaborative design session for the upcoming project.', status: 'Completed', location: 'Workshop', friends: '', code: '456' }
            ],
            showModal: false,
            showChoiceModal: false,
            showJoinModal: false,
            joinCode: '',
            isEditMode: false,
            currentHuddle: {
                id: null,
                name: '',
                description: '',
                location: '',
                friends: '',
                code: '',
                status: 'Online'
            }
        };
    },
    methods: {
        openAddModal() {
            this.isEditMode = false;
            this.currentHuddle = {
                id: null,
                name: '',
                description: '',
                location: '',
                friends: '',
                code: '',
                status: 'Online'
            };
            this.showModal = true;
        },
        editHuddle(huddle) {
            this.isEditMode = true;
            this.currentHuddle = { ...huddle };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.showJoinModal = false;
        },
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
        saveHuddle() {
            if (this.isEditMode) {
                const index = this.huddles.findIndex(r => r.id === this.currentHuddle.id);
                if (index !== -1) {
                    this.huddles[index] = { ...this.currentHuddle };
                }
            } else {
                const newHuddle = {
                    ...this.currentHuddle,
                    id: Date.now()
                };
                this.huddles.push(newHuddle);
            }
            this.closeModal();
        },
        deleteHuddle(id) {
            if (confirm('Are you sure you want to delete this huddle?')) {
                this.huddles = this.huddles.filter(huddle => huddle.id !== id);
            }
        },
        leaveHuddle(huddle) {
            console.log('Leaving huddle:', huddle.name);
        }
    },
    computed: {
        // Add computed properties here if needed for future iterations
    }
}).mount('#app');
