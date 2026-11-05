<template>
    <div class="card">
        <div class="card-header">Group Chat</div>
        <div class="card-body messages">
            <div v-for="(msg, index) in messages" :key="index" class="mb-2">
                <div v-if="msg.time !== messages[index-1]?.time" class="text-muted small mb-1">{{ msg.time }}</div>
                <div v-else class="d-none"></div>
                <div :class="{'text-muted fst-italic': msg.isSystem}">
                    <span v-if="!msg.isSystem">
                        <strong class="me-1">{{ displayUser(msg) }}:</strong> {{ msg.text }}
                    </span>
                    <span v-else>{{ msg.text }}</span>
                    <button v-if="canDeleteMessage(msg)" class="btn btn-sm text-danger ms-2 p-0" @click="deleteMessage(index)" title="Delete message">
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
</template>

<script>
export default {
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
        displayUser(msg) {
            return msg.isFrom(this.currentUser) ? 'Me' : msg.user;
        },
        handleSend() {
            if (this.newMessage.trim()) {
                this.$emit('send-message', this.newMessage.trim());
                this.newMessage = '';
            }
        },
        canDeleteMessage(msg) {
            return msg.canBeDeletedBy(this.currentUser, this.ownerId);
        },
        deleteMessage(index) {
            this.$emit('delete-message', index);
        }
    },
};
</script>

<style scoped>
.messages {
    height: 350px;
    overflow-y: auto;
}
</style>