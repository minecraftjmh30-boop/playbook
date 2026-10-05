const HuddleDetails = {
    name: 'HuddleDetails',
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
    emits: ['save'],
    data() {
        return {
            editing: false,
            editName: '',
            editDescription: '',
            editLocation: ''
        };
    },
    template: `
    <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <span>Huddle Details</span>
            <!-- Owner edit button -->
            <button 
                v-if="currentUser && huddle.owner === currentUser && !editing" 
                class="btn btn-warning btn-sm" 
                @click="startEdit">Edit</button>
        </div>
        <div class="card-body">
            <div v-if="!editing">
                <h5 class="mt-0">{{ huddle.name }}</h5>
                <p>{{ huddle.description }}</p>
                <hr>
                <h6 class="mt-0">Location & Code</h6>
                <div class="row">
                    <div class="col-6">
                        <p><i class="bi bi-geo-alt"></i> {{ huddle.location }}</p>
                    </div>
                    <div class="col-6">
                        <p>Huddle Code: <strong>{{ huddle.code }}</strong></p>
                    </div>
                </div>
                <p v-if="huddle.startDate && huddle.endDate">Time frame: {{ formatDate(huddle.startDate) }} to {{ formatDate(huddle.endDate) }}</p>
                <p v-else-if="huddle.startDate">Starts: {{ formatDate(huddle.startDate) }}</p>
                <p v-else-if="huddle.endDate">Ends: {{ formatDate(huddle.endDate) }}</p>
                <p v-else class="text-muted">No time frame set</p>
            </div>
            <div v-else>
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" v-model="editName">
                </div>
                <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" rows="3" v-model="editDescription"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-control" v-model="editLocation">
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary btn-sm" @click="saveEdit">Save</button>
                    <button class="btn btn-secondary btn-sm" @click="cancelEdit">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        formatDate(dateStr) {
            if (!dateStr) return '';
            const parts = dateStr.split(/[-/]/);
            if (parts.length >= 3) {
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const day = parseInt(parts[2]);
                const date = new Date(year, month, day);
                return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            }
            return dateStr;
        },
        startEdit() {
            if (this.currentUser && this.huddle.owner === this.currentUser) {
                this.editName = this.huddle.name;
                this.editDescription = this.huddle.description;
                this.editLocation = this.huddle.location;
                this.editing = true;
            } else {
                alert('You must be the owner to edit this huddle.');
            }
        },
        saveEdit() {
            if (!this.editName.trim()) {
                alert('Name cannot be empty.');
                return;
            }
            this.huddle.name = this.editName.trim();
            this.huddle.description = this.editDescription.trim();
            this.huddle.location = this.editLocation.trim() || 'Virtual';
            this.editing = false;
            this.$emit('save');
        },
        cancelEdit() {
            this.editing = false;
        }
    }
};

if (typeof window !== 'undefined') {
    window.HuddleDetails = HuddleDetails;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('huddle-details', HuddleDetails);
        return app;
    };
}
