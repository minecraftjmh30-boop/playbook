//Redirect to main page if user is logged in
import { getCookie } from './cookie.js';
const redirectToMain = () => {
    window.location.href = 'index.html';
}
document.addEventListener('DOMContentLoaded', () =>{
    let cookieExists = getCookie();
    if (cookieExists) {
        redirectToMain();
    }

})
