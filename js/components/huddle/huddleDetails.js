const HuddleDetails = {
    name: 'HuddleDetails',
    props: {
        huddle: {
            type: Object,
            required: true
        }
    },
    template: `
    <div class="card mb-4">
        <div class="card-header">Huddle Details</div>
        <div class="card-body">
            <h5 class="mt-0">{{ huddle.name }}</h5>
            <p>{{ huddle.description }}</p>
            <hr>
            <h5 class="mt-0">Location & Date</h5>
            <div class="row">
                <div class="col-6">
                    <p><i class="bi bi-geo-alt"></i> {{ huddle.location }}</p>
                </div>
                <div class="col-6">
                    <p>Huddle Code: <strong>{{ huddle.code }}</strong></p>
                </div>
            </div>
            <p>Planned date: not determined yet</p>
        </div>
    </div>
    `
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
