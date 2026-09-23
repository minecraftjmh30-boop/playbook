function renderHeader() {
    const header = document.querySelector('body > header') || document.querySelector('header');
    if (header) {
        header.innerHTML = `
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
            <li><a class="dropdown-item" href="./room.html">Join Room</a></li>
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
</nav>`;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHeader);
} else {
    renderHeader();
}

