const HuddleCard = {
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
    emits: ['edit', 'delete', 'leave'],
    computed: {
        huddleStatus() {
            // Show selected dates if available
            if (this.huddle.selectedDates && this.huddle.selectedDates.length > 0) {
                const dates = this.huddle.selectedDates;
                if (dates.length === 1) return dates[0];
                return `${dates.length} dates selected`;
            }
            // Show time frame if set
            if (this.huddle.startDate && this.huddle.endDate) {
                return `${this.huddle.startDate} to ${this.huddle.endDate}`;
            }
            if (this.huddle.startDate) return `Starts ${this.huddle.startDate}`;
            if (this.huddle.endDate) return `Ends ${this.huddle.endDate}`;
            // Fall back to status
            return this.huddle.status || 'Ongoing';
        },
        statusBadgeClass() {
            if (this.huddle.selectedDates && this.huddle.selectedDates.length > 0) return 'bg-primary';
            if (this.huddle.status === 'Online') return 'bg-success';
            if (this.huddle.status === 'Planning') return 'bg-warning';
            if (this.huddle.status === 'Completed') return 'bg-secondary';
            return 'bg-info';
        }
    },
    methods: {
        getHuddleStatus(huddle) {
            return this.huddleStatus;
        }
    },
    template: `
    <div class="col-md-4">
        <div class="card mb-4">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title mb-0">{{ huddle.name }}</h5>
                    <span :class="['badge', statusBadgeClass]">{{ huddleStatus }}</span>
                </div>
                <p class="card-text text-muted">{{ huddle.description }}</p>
                <div class="mb-2 small text-muted">
                    <span>Participants: {{ huddle.participants ? huddle.participants.length : 1 }}</span>
                    <span v-if="huddle.owner" class="ms-2">Owner: {{ huddle.owner }}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <a :href="'huddle.html?id=' + huddle.id" class="btn btn-primary btn-sm">Go to Huddle</a>
                    <div>
                        <!-- Edit and Delete buttons only shown if current user is owner -->
                        <template v-if="currentUser && currentUser === huddle.owner">
                            <button class="btn btn-warning btn-sm me-1" @click="$emit('edit', huddle)">Edit</button>
                            <button class="btn btn-danger btn-sm" @click="$emit('delete', huddle.id)">Delete</button>
                        </template>
                        <button v-else-if="huddle.status === 'Completed'" class="btn btn-danger btn-sm" @click="$emit('leave', huddle)">Leave</button>
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
