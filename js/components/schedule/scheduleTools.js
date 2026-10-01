const ScheduleTools = {
    name: 'ScheduleTools',
    props: {
        mode: {
            type: String,
            default: null
        }
    },
    emits: ['set-mode'],
    template: `
    <section class="row justify-content-center gap-2 mb-4" id="tools">
        <button type="button" id="freeBtn" class="btn btn-success col-auto px-4 rounded-pill" :class="{ active: mode === 'free' }" @click="$emit('set-mode', 'free')">Quick Free</button>
        <button type="button" id="busyBtn" class="btn btn-danger col-auto px-4 rounded-pill" :class="{ active: mode === 'busy' }" @click="$emit('set-mode', 'busy')">Quick Busy</button>
        <button type="button" id="removeBtn" class="btn btn-secondary col-auto px-4 rounded-pill" :class="{ active: mode === 'remove' }" @click="$emit('set-mode', 'remove')">Quick Remove</button>
    </section>
    `
};

if (typeof window !== 'undefined') {
    window.ScheduleTools = ScheduleTools;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('schedule-tools', ScheduleTools);
        return app;
    };
}
