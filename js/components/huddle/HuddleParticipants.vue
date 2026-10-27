<template>
    <div class="card mb-4">
        <div class="card-header">Participants</div>
        <ul class="list-group list-group-flush">
            <ParticipantItem v-for="p in participants" :key="p.id" :participant="p" :owner-id="ownerId" :current-user="currentUser" @remove-participant="$emit('remove-participant', $event)"></ParticipantItem>
        </ul>
        <div v-if="participants.length === 0" class="card-body text-muted text-center">No participants yet.</div>
    </div>
</template>

<script>
import ParticipantItem from './ParticipantItem.vue';

export default {
    name: 'HuddleParticipants',
    components: {
        ParticipantItem
    },
    props: {
        participants: {
            type: Array,
            default: () => []
        },
        ownerId: {
            type: String,
            default: null
        },
        currentUser: {
            type: String,
            default: null
        }
    },
    emits: ['remove-participant'],
};
</script>