const HuddleCard = {
    name: 'HuddleCard',
    props: {
        huddle: {
            type: Object,
            required: true
        }
    },
    emits: ['edit', 'delete', 'leave'],
    template: `
    <div class="col-md-4">
        <div class="card mb-4">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title mb-0">{{ huddle.name }}</h5>
                    <span :class="['badge', huddle.status === 'Online' ? 'bg-success' : 'bg-secondary']">{{ huddle.status }}</span>
                </div>
                <p class="card-text text-muted">{{ huddle.description }}</p>
                <div class="d-flex justify-content-between">
                    <a :href="'huddle.html?id=' + huddle.id" class="btn btn-primary btn-sm">Go to Huddle</a>
                    <div v-if="huddle.status === 'Completed'">
                        <button class="btn btn-danger btn-sm" @click="$emit('leave', huddle)">Leave</button>
                    </div>
                    <div v-else>
                        <button class="btn btn-warning btn-sm me-1" @click="$emit('edit', huddle)">Edit</button>
                        <button class="btn btn-danger btn-sm" @click="$emit('delete', huddle.id)">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.HuddleCard = HuddleCard;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('huddle-card', HuddleCard);
        return app;
    };
}
