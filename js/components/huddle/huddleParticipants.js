const HuddleParticipants = {
    name: 'HuddleParticipants',
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
    template: `
    <div class="card mb-4">
        <div class="card-header">Participants</div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center" v-for="p in participants" :key="p.id">
                <span>
                    {{ p.name }}
                    <span v-if="p.id === ownerId" class="badge bg-warning text-dark ms-1" title="Owner">Owner</span>
                </span>
                <!-- Remove participant button only for owner, not on self -->
                <button 
                    v-if="currentUser && currentUser === ownerId && p.id !== currentUser" 
                    class="btn btn-danger btn-sm"
                    @click="$emit('remove-participant', p.id)">Remove</button>
            </li>
        </ul>
        <div v-if="participants.length === 0" class="card-body text-muted text-center">
            No participants yet.
        </div>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.HuddleParticipants = HuddleParticipants;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('huddle-participants', HuddleParticipants);
        return app;
    };
}
