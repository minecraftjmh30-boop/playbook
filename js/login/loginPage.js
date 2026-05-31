//MAIN PAGE FOR LOGIN AND SIGNUP
//LOADS THE CORRECT FORM BASED ON USER ACTION
import { login } from './login.js';
import { uploadUser } from './uploadUser.js';
$(document).ready(function(){

const $form = $('form');


const loginButton = $('#login');

loginButton.click(loadLogin)

function loadLogin() {
    $form.html(``);

    $form.html( `
    <fieldset>
    <legend>Login</legend>
    <label for="username">Enter Username</label>
    <input id="username" type="text">
    <label for="password">Enter Password</label>
    <input type="password">
    <button type="button" id="login-button" >Login</button>
    </fieldset>
    `);
    $('#login-button').click(function(){
        let unLocation = $('#username');
        let pLocation = $('#password');
        let username = unLocation.val();
        let password = pLocation.val();
        login(username, password);
    })
}


const signupButton = $('#signup');

signupButton.click(loadSignUp)

function loadSignUp() {
    $form.html(``);
    $form.id = 'signupForm';
    $form.html(`
    <fieldset>
    <legend>Sign Up</legend>
    <label for="username">Enter Username</label>
    <input id="username" type="text">
    <label for="firstname">Enter First Name</label>
    <input id="firstname" type="text">
    <label for="lastname">Enter Last Name</label>
    <input id="lastname" type="text">
    <label for="password">Enter Password</label>
    <input type="password">
    <label for="confirm">Confirm Password</label>
    <input id="confirm" type="password">
    
    <button type="button" id="signupStart">Sign Up</button>
    </fieldset>
    `);
    $('#signupStart').click(uploadUser);

}
})