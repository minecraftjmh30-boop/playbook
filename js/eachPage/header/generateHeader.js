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
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#navbarJoinRoomModal">Join Room</a></li>
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

<!-- Modal for Join Room from Navbar -->
<div class="modal fade" id="navbarJoinRoomModal" tabindex="-1" aria-labelledby="navbarJoinRoomModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content text-start text-dark">
      <div class="modal-header">
        <h5 class="modal-title" id="navbarJoinRoomModalLabel">Join a Room</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="navbarJoinRoomForm">
        <div class="modal-body">
          <div class="mb-3">
            <label for="navbarJoinRoomCode" class="form-label">Enter Room Code</label>
            <input type="text" class="form-control" id="navbarJoinRoomCode" placeholder="e.g. 123" required>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Join</button>
        </div>
      </form>
    </div>
  </div>
</div>`;

        const joinForm = document.getElementById('navbarJoinRoomForm');
        if (joinForm) {
            joinForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const codeInput = document.getElementById('navbarJoinRoomCode');
                const code = codeInput ? codeInput.value.trim() : '';
                if (code) {
                    window.location.href = `room.html?code=${encodeURIComponent(code)}`;
                }
            });
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHeader);
} else {
    renderHeader();
}

