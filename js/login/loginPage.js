//MAIN PAGE FOR LOGIN AND SIGNUP
//LOADS THE CORRECT FORM BASED ON USER ACTION

const form = document.querySelector('form');
const loginButton = document.getElementById('login');

loginButton.addEventListener('click', () => {
    loadLogin();
})
function loadLogin() {
    form.innerHTML = ``;

    form.innerHTML = `
    <fieldset>
    <legend>Login</legend>
    <label for="username">Enter Username</label>
    <input id="username" type="text">
    <label for="password">Enter Password</label>
    <input type="password">
    <button type="button" id="login-button" >Login</button>
    </fieldset>
    `;
    document.getElementById('login-button').addEventListener('click', () => {
        //Start Login process
    })
}


const signupButton = document.getElementById('signup');

signupButton.addEventListener('click', () => {
    loadSignUp();
})

function loadSignUp() {
    form.innerHTML = ``;

    form.innerHTML = `
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
    `;
document.getElementById('signupStart').addEventListener('click', () => {
   uploadUser();
})

}