$(document).ready(function() {
    let $header = $('body > header')
    $header.html(``)
    $header.html(`
    <nav class="navbar navbar-expand-lg bg-body-tertiary bg-primary-subtle">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Playbook</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="./index.html">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="./schedule.html">Schedule</a>
        </li>
        
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Room
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Create Room</a></li>
            <li><a class="dropdown-item" href="#">Join Room</a></li>
          </ul>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Profile
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">My Profile</a></li>
            <li><a class="dropdown-item" href="#">Add Friends</a></li>
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" href="#">Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>`)
})

