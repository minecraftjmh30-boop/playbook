const { createApp } = Vue;

createApp({
    data() {
        return {
            userInfo: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                dateJoined: 'September 19, 2026'
            },
            friends: [
                { id: 1, name: 'Alice Smith' },
                { id: 2, name: 'Bob Jones' }
            ],
            pendingRequests: [
                { id: 3, name: 'Charlie Brown' }
            ],
            friendCode: 'PLAY-9876',
            newFriendCode: ''
        };
    },
    methods: {
        removeFriend(id) {
            if (confirm('Are you sure you want to remove this friend?')) {
                this.friends = this.friends.filter(f => f.id !== id);
            }
        },
        handlePendingRequest(id, action) {
            if (action === 'add') {
                const friend = this.pendingRequests.find(p => p.id === id);
                if (friend) {
                    this.friends.push({ id: Date.now(), name: friend.name });
                    this.pendingRequests = this.pendingRequests.filter(p => p.id !== id);
                }
            } else {
                this.pendingRequests = this.pendingRequests.filter(p => p.id !== id);
            }
        },
        addFriend() {
            if (this.newFriendCode.trim()) {
                alert(`Friend request sent to: ${this.newFriendCode}`);
                this.newFriendCode = '';
            }
        }
    }
}).mount('#app');
