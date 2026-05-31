$(document).ready(function() {
    let $header = $('body > header')
    let page = location.pathname.split('/').pop().split('.')[0]
    $header.html(``)
    $header.html(`
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
                    <button>Log-Out</button>
                </div>
                </li> <!--will be pfp with drow down-->
            </ul>
        </nav>
    </div>
    `)
})