const TimeRangeModal = {
    name: 'TimeRangeModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        modalData: {
            type: Object,
            required: true
        }
    },
    emits: ['close', 'save'],
    template: `
    <div class="modal fade show d-block" v-if="show" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Set Time Range</h5>
                    <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Type</label>
                        <select class="form-select" v-model="modalData.mode">
                            <option value="free">Free</option>
                            <option value="busy">Busy</option>
                        </select>
                    </div>
                    <div class="row">
                        <div class="col">
                            <label class="form-label">Start Time</label>
                            <input type="time" class="form-control" v-model="modalData.startTime">
                        </div>
                        <div class="col">
                            <label class="form-label">End Time</label>
                            <input type="time" class="form-control" v-model="modalData.endTime">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
                    <button type="button" class="btn btn-primary" @click="$emit('save')">Save</button>
                </div>
            </div>
        </div>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.TimeRangeModal = TimeRangeModal;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('time-range-modal', TimeRangeModal);
        return app;
    };
}
