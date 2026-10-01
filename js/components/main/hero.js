const AppHero = {
    name: 'AppHero',
    template: `
    <section id="hero" class="bg-primary text-white py-5 mb-4">
        <div class="container">
            <h1 class="display-4">{{ weekday }}, {{ month }} {{ day }}, {{ year }}</h1>
            <p class="lead">Week {{ week }} • {{ season }}</p>
        </div>
    </section>
    `,
    data() {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });
        const year = now.getFullYear();
        const weekday = now.toLocaleString('default', { weekday: 'long' });

        // Week number
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now - startOfYear) / 86400000;
        const week = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

        // Season
        const monthIndex = now.getMonth();
        let season = "";
        if (monthIndex >= 2 && monthIndex <= 4) season = "Spring";
        else if (monthIndex >= 5 && monthIndex <= 7) season = "Summer";
        else if (monthIndex >= 8 && monthIndex <= 10) season = "Autumn";
        else season = "Winter";

        return { day, month, year, weekday, week, season };
    }
};

if (typeof window !== 'undefined') {
    window.AppHero = AppHero;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('app-hero', AppHero);
        return app;
    };
}
