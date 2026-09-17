$(document).ready(function() {
    let $header = $('body > header')
    let page = location.pathname.split('/').pop().split('.')[0]
    $header.html(``)

    $header.html(`
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Playbook</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Schedule</a>
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



/*$header.html(`
    <div class="row site-width">
        <h2 class="flex-1">Meet-Up</h2>
        <nav class="flex-1 right">
            <ul>
                <li><button onclick="location.href='./index.html'" class="${page === 'index' ? 'active' : ''}">Home</button></li>
                <li><button onclick="location.href='./schedule.html'" class="${page === 'schedule' ? 'active' : ''}">Schedule</button></li>
                <li><button type="button" id="roomMenu">Room</button>
                <div class="roomDropDown">
                    <button>Create Room</button>
                    <button>Join Room</button>
                </div>
                </li>
                <li>
                <button type="button" id="profileMenu">Profile</button>
                <div class="profileDropDown">
                    <button>my Profile</button>
                    <button>Add Friend</button>
                    <button>Settings</button>
                    <button onclick="removeCookie()">Log-Out</button>
                </div>
                </li> <!--will be pfp with drow down-->
            </ul>
        </nav>
    </div>
    `)*/