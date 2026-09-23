const { createApp } = Vue;

createApp({
    data() {
        return {
            rooms: [
                { id: 1, name: 'Virtual Room #123', description: 'This is a room where users can collaborate and chat. The schedule shows upcoming events for this room.', status: 'Planning' },
                { id: 2, name: 'Design Workshop', description: 'Collaborative design session for the upcoming project.', status: 'Completed' }
            ],
            showModal: false,
            isEditMode: false,
            currentRoom: {
                id: null,
                name: '',
                description: '',
                status: 'Online'
            }
        };
    },
    methods: {
        openAddModal() {
            this.isEditMode = false;
            this.currentRoom = {
                id: null,
                name: '',
                description: '',
                status: 'Online'
            };
            this.showModal = true;
        },
        editRoom(room) {
            this.isEditMode = true;
            this.currentRoom = { ...room };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        saveRoom() {
            if (this.isEditMode) {
                const index = this.rooms.findIndex(r => r.id === this.currentRoom.id);
                if (index !== -1) {
                    this.rooms[index] = { ...this.currentRoom };
                }
            } else {
                const newRoom = {
                    ...this.currentRoom,
                    id: Date.now()
                };
                this.rooms.push(newRoom);
            }
            this.closeModal();
        },
        deleteRoom(id) {
            if (confirm('Are you sure you want to delete this room?')) {
                this.rooms = this.rooms.filter(room => room.id !== id);
            }
        },
        leaveRoom(room) {
            console.log('Leaving room:', room.name);
        }
    },
    computed: {
        // Add computed properties here if needed for future iterations
    }
}).mount('#app');
