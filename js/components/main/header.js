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

if (typeof window !== 'undefined') {
    window.AppHeader = AppHeader;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('app-header', AppHeader);
        return app;
    };
}