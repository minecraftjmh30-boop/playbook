const ChoiceModal = {
    name: 'ChoiceModal',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close', 'open-join'],
    template: `
    <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">What would you like to do?</h5>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>
                <div class="modal-body text-center">
                    <p>Choose an option to proceed.</p>
                    <div class="d-flex justify-content-center gap-3">
                        <a href="createHuddle.html" class="btn btn-primary">Create Huddle</a>
                        <button class="btn btn-secondary" @click="$emit('open-join')">Join Huddle</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.ChoiceModal = ChoiceModal;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('choice-modal', ChoiceModal);
        return app;
    };
}
