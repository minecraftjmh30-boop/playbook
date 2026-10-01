const AppFooter = {
    name: 'AppFooter',
    template: `
    <footer class="text-center bg-primary-subtle py-4 mt-auto">
        <p class="mb-0">Jack Hackett | {{ currentYear }}</p>
    </footer>
    `,
    data() {
        return {
            currentYear: new Date().getFullYear()
        };
    }
};

if (typeof window !== 'undefined') {
    window.AppFooter = AppFooter;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('app-footer', AppFooter);
        return app;
    };
}