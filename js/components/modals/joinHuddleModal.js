const JoinHuddleModal = {
    name: 'JoinHuddleModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: ['close', 'join', 'update:modelValue'],
    template: `
    <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Join a Huddle</h5>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Enter Huddle Code</label>
                        <input type="text" class="form-control" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" placeholder="e.g. 123" @keyup.enter="$emit('join')">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
                    <button type="button" class="btn btn-primary" @click="$emit('join')">Join</button>
                </div>
            </div>
        </div>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.JoinHuddleModal = JoinHuddleModal;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('join-huddle-modal', JoinHuddleModal);
        return app;
    };
}
