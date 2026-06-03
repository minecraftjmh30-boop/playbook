import { setCookie } from "/js/checkAuth/cookie.js";

export async function login(username, password, unLocation, pLocation) {
    clearErrorMessages();

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.error.includes('username')) {
            displayErrorMessages(unLocation, "username does not exist");
        } else {
            displayErrorMessages(pLocation, "incorrect password");
        }
        return;
    }

    setCookie('user', data.user.id, data.user.username, data.user.firstname, data.user.lastname);
    window.location.href = '/index.html';
}
