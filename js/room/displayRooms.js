//Displays all rooms that the user is a part of
import { getCookie } from '../checkAuth/cookie.js';
import { redirectToLogin } from '../checkAuth/redirectToLogin.js';

$(document).ready(function(){
    const $roomArea = $('#rooms')

    //get user cookie
    const userCookie = getCookie();
    const user_id = userCookie ? userCookie.id : null;

    if (!user_id) {
        console.error('User ID not found in cookie');
        alert('Please log in');
        redirectToLogin();
        return;
    }

    conn.query(
    'SELECT event_id, title, description, status FROM event_room WHERE FIND_IN_SET(?, allowed_users)',
    [user_id],
    (err, results) => {
        if (err) {
            console.error('Error fetching rooms:', err);
            $roomArea.html('<p>Error fetching rooms. Please try again later.</p>');
            return;
        }
        if (results.length === 0) {
            $roomArea.html('<p>No rooms found</p>');
            return;
        }

        results.forEach(room => {
            $roomArea.append(`<div class="room">${room.title}</div>`);
        });
    }
);
})