const HuddleParticipants = {
    name: 'HuddleParticipants',
    props: {
        participants: {
            type: Array,
            default: () => []
        }
    },
    template: `
    <div class="card mb-4">
        <div class="card-header">Participants</div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="p in participants" :key="p.name">{{ p.name }}</li>
        </ul>
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
