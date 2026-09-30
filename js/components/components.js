const AppHeader = {
    name: 'AppHeader',
    template: `
    <header>
      <nav class="navbar navbar-expand-lg bg-body-tertiary bg-primary-subtle">
        <div class="container-fluid">
          <a class="navbar-brand" href="./index.html">Playbook</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="./index.html">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="./schedule.html">Schedule</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Huddle
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="./createHuddle.html">Create Huddle</a></li>
                  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#navbarJoinHuddleModal">Join Huddle</a></li>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Profile
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="./profile.html#main-tab" role="button">My Profile</a></li>
                  <li><a class="dropdown-item" href="./profile.html#friends-tab" role="button">Add Friends</a></li>
                  <li><a class="dropdown-item" href="./profile.html#settings-tab" role="button">Settings</a></li>
                  <li><a class="dropdown-item" href="./login.html">Logout</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Modal for Join Huddle from Navbar -->
      <div class="modal fade" id="navbarJoinHuddleModal" tabindex="-1" aria-labelledby="navbarJoinHuddleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content text-start text-dark">
            <div class="modal-header">
              <h5 class="modal-title" id="navbarJoinHuddleModalLabel">Join a Huddle</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="navbarJoinHuddleForm" @submit.prevent="handleNavbarJoin">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="navbarJoinHuddleCode" class="form-label">Enter Huddle Code</label>
                  <input type="text" class="form-control" id="navbarJoinHuddleCode" v-model="navbarJoinCode" placeholder="e.g. 123" required>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Join</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
    `,
    data() {
        return {
            navbarJoinCode: ''
        };
    },
    methods: {
        handleNavbarJoin() {
            if (this.navbarJoinCode && this.navbarJoinCode.trim()) {
                window.location.href = `huddle.html?code=${encodeURIComponent(this.navbarJoinCode.trim())}`;
            }
        }
    }
};

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

// Global component object definitions
if (typeof window !== 'undefined') {
    window.AppHeader = AppHeader;
    window.AppFooter = AppFooter;
    window.AppHero = AppHero;
}

// Auto-register components with Vue 3 createApp
if (typeof Vue !== 'undefined') {
    if (Vue.createApp) {
        const originalCreateApp = Vue.createApp;
        Vue.createApp = function(...args) {
            const app = originalCreateApp.apply(this, args);
            app.component('app-header', AppHeader);
            app.component('app-footer', AppFooter);
            app.component('app-hero', AppHero);
            return app;
        };
    }
    if (!Vue.component) {
        Vue.component = function(name, definition) {
            if (name === 'app-header') Object.assign(AppHeader, definition);
            if (name === 'app-footer') Object.assign(AppFooter, definition);
            if (name === 'app-hero') Object.assign(AppHero, definition);
        };
    }
}
