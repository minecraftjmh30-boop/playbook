Vue.component('app-header', {
    template: `
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
                Room
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="./createRoom.html">Create Room</a></li>
                <li><a class="dropdown-item" href="#">Join Room</a></li>
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
                <li><a class="dropdown-item" href="#">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer class="text-center bg-primary-subtle py-3 mt-5">
        <p>Jack Hackett | {{ currentYear }}</p>
    </footer>
    `,
    data() {
        return {
            currentYear: new Date().getFullYear()
        };
    }
});

Vue.component('app-hero', {
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
});
