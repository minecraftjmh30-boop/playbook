<template>
    <li class="list-group-item d-flex justify-content-between align-items-center">
        <span>
            {{ displayName }}
            <span v-if="participant.id === ownerId" class="badge bg-warning text-dark ms-1" title="Owner">Owner</span>
            <span v-if="isPending" class="badge bg-info ms-1" title="Pending invitation">Pending</span>
        </span>
        <button v-if="currentUser && currentUser === ownerId && participant.id !== currentUser" class="btn btn-danger btn-sm" @click="$emit('remove-participant', participant.id)">Remove</button>
    </li>
</template>

<script>
export default {
    name: 'ParticipantItem',
    props: {
        participant: {
            type: Object,
            required: true
        },
        ownerId: {
            type: String,
            default: null
        },
        currentUser: {
            type: String,
            default: null
        },
        isPending: {
            type: Boolean,
            default: false
        }
    },
    emits: ['remove-participant'],
    computed: {
        displayName() {
            if (this.currentUser && this.participant.id === this.currentUser) {
                return 'Me';
            }
            return this.participant.name;
        }
    }
};
</script>