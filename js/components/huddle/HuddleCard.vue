<template>
    <div class="col-md-4">
        <div class="card mb-4">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title mb-0">{{ huddle.name }}</h5>
                    <span :class="['badge', huddle.statusBadgeClass]">{{ huddle.statusLabel }}</span>
                </div>
                <p class="card-text text-muted">{{ huddle.description }}</p>
                <div class="mb-2 small text-muted">
                    <span>Participants: {{ huddle.participants ? huddle.participants.length : 1 }}</span>
                    <span v-if="huddle.owner" class="ms-2">Owner: {{ huddle.owner }}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <router-link :to="{ path: '/huddle', query: { id: huddle.id } }" class="btn btn-primary btn-sm">Go to Huddle</router-link>
                    <div>
                        <template v-if="currentUser && currentUser === huddle.owner">
                            <button class="btn btn-warning btn-sm me-1" @click="$emit('edit', huddle)">Edit</button>
                            <button class="btn btn-danger btn-sm" @click="$emit('delete', huddle.id)">Delete</button>
                        </template>
                        <button v-else-if="currentUser && huddle.participants && huddle.participants.includes(currentUser)" class="btn btn-outline-danger btn-sm" @click="$emit('leave', huddle)">Leave</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HuddleCard',
    props: {
        huddle: {
            type: Object,
            required: true
        },
        currentUser: {
            type: String,
            default: null
        }
    },
    emits: ['edit', 'delete', 'leave']
};
</script>