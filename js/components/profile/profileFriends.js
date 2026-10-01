const ProfileFriends = {
    name: 'ProfileFriends',
    props: {
        friends: {
            type: Array,
            default: () => []
        },
        pendingRequests: {
            type: Array,
            default: () => []
        },
        friendCode: {
            type: String,
            default: ''
        }
    },
    emits: ['remove-friend', 'handle-request', 'add-friend'],
    data() {
        return {
            newFriendCode: ''
        };
    },
    methods: {
        handleAdd() {
            if (this.newFriendCode.trim()) {
                this.$emit('add-friend', this.newFriendCode.trim());
                this.newFriendCode = '';
            }
        }
    },
    template: `
    <div>
        <!-- Friends List -->
        <div class="card mb-4">
            <div class="card-header">Your Friends</div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="friend in friends" :key="friend.id">
                    {{ friend.name }}
                    <button class="btn btn-sm btn-outline-danger" @click="$emit('remove-friend', friend.id)">Remove</button>
                </li>
            </ul>
        </div>

        <!-- Pending Requests -->
        <div class="card mb-4">
            <div class="card-header">Pending Friend Requests</div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="request in pendingRequests" :key="request.id">
                    {{ request.name }}
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-success me-2" @click="$emit('handle-request', request.id, 'add')">Add</button>
                        <button class="btn btn-sm btn-secondary" @click="$emit('handle-request', request.id, 'ignore')">Ignore</button>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Friend Code Sharing & Adding -->
        <div class="card">
            <div class="card-body">
                <h6 class="card-title">Share Your Friend Code</h6>
                <p class="card-text mb-3">Your code: <span class="badge bg-light text-dark border">{{ friendCode }}</span></p>
                
                <hr>
                
                <h6 class="card-title">Add a Friend</h6>
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Enter friend code" v-model="newFriendCode" @keyup.enter="handleAdd">
                    <button class="btn btn-primary" type="button" @click="handleAdd">Add</button>
                </div>
            </div>
        </div>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.ProfileFriends = ProfileFriends;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('profile-friends', ProfileFriends);
        return app;
    };
}
