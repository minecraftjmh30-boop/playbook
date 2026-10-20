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
            newFriendCode: '',
            friendSearch: ''
        };
    },
    computed: {
        filteredFriends() {
            if (!this.friendSearch.trim()) {
                return this.friends;
            }
            const query = this.friendSearch.toLowerCase();
            return this.friends.filter(f => f.name.toLowerCase().includes(query));
        }
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
            <div class="card-body pb-0">
                <input 
                    type="text" 
                    class="form-control form-control-sm mb-2" 
                    placeholder="Search friends by name..." 
                    :value="friendSearch"
                    @input="friendSearch = $event.target.value">
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="friend in filteredFriends" :key="friend.id">
                    {{ friend.name }}
                    <button class="btn btn-sm btn-outline-danger" @click="$emit('remove-friend', friend.id)">Remove</button>
                </li>
            </ul>
            <div v-if="filteredFriends.length === 0 && friendSearch.trim()" class="card-body text-muted text-center">
                No friends match your search.
            </div>
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

export { ProfileFriends };