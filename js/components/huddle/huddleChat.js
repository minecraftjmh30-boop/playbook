const HuddleChat = {
    name: 'HuddleChat',
    props: {
        messages: {
            type: Array,
            default: () => []
        },
        currentUser: {
            type: String,
            default: ''
        },
        ownerId: {
            type: String,
            default: null
        }
    },
    emits: ['send-message', 'delete-message'],
    data() {
        return {
            newMessage: ''
        };
    },
    methods: {
        displayUser(user) {
            if (this.currentUser && (this.currentUser === user || this.currentUser === `User ${user.split(' ')[1]}`)) {
                return 'Me';
            }
            const normalizedUser = user.replace(/\s+/g, '');
            const normalizedCurrent = this.currentUser ? this.currentUser.replace(/\s+/g, '') : '';
            if (normalizedUser === normalizedCurrent) {
                return 'Me';
            }
            return user;
        },
        handleSend() {
            if (this.newMessage.trim()) {
                this.$emit('send-message', this.newMessage.trim());
                this.newMessage = '';
            }
        },
        canDeleteMessage(msg) {
            // Owner can delete any message
            if (this.ownerId && this.currentUser === this.ownerId) {
                return true;
            }
            // Users can delete their own messages
            if (this.currentUser && msg.user === this.currentUser) {
                return true;
            }
            // System messages cannot be deleted by non-owners
            return false;
        },
        deleteMessage(index) {
            this.$emit('delete-message', index);
        }
    },
    template: `
    <div class="card">
        <div class="card-header">Group Chat</div>
        <div class="card-body" style="height: 350px; overflow-y: auto;">
            <div v-for="(msg, index) in messages" :key="index" class="mb-2">
                <div v-if="msg.time !== messages[index-1]?.time" class="text-muted small mb-1">{{ msg.time }}</div>
                <div v-else class="d-none"></div>
                <div :class="{'text-muted fst-italic': msg.system}">
                    <span v-if="!msg.system">
                        <strong class="me-1">{{ displayUser(msg.user) }}:</strong> {{ msg.text }}
                    </span>
                    <span v-else>{{ msg.text }}</span>
                    <button 
                        v-if="canDeleteMessage(msg)" 
                        class="btn btn-sm text-danger ms-2 p-0" 
                        @click="deleteMessage(index)" 
                        title="Delete message">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Type a message..." v-model="newMessage" @keyup.enter="handleSend">
                <button class="btn btn-primary" type="button" @click="handleSend">Send</button>
            </div>
        </div>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.HuddleChat = HuddleChat;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('huddle-chat', HuddleChat);
        return app;
    };
}
