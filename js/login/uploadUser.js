const signup = document.getElementById('signup-form');

/*TODO
* get all user data from form
* pass them through validation and sanitize
* generate recovery code and display it
* send data to database
* create login session
* redirect to main page
* */
function uploadUser() {
    //calls all functions
    let user = []
    let data = []
    let ids = []
    user.push(data,ids)
    getUserData(user);
    sanitizeAndValidateData(data);
    generateRC();
    uploadUserToDatabase();

}

function getUserData(user) {

    let username = document.getElementById('username');
    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');

    user[1].push(username, firstName, lastName, password, confirmPassword); //used for placing errors
    user[0].push(username.value, firstName.value, lastName.value, password.value, confirmPassword.value);//users data
    return user
}

function sanitizeAndValidateData(user) {

}

function generateRC(user){
let recoveryCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user[0].push(recoveryCode);
    alert("Your Recovery Code is: " + recoveryCode);
}

function uploadUserToDatabase(user){

}