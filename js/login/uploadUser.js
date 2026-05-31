import { login } from './login.js';

export function uploadUser() {
    clearErrorMessages();
    let userData = getUserData();
    if (!userData) return;
    let isValid = sanitizeAndValidateData(userData);
    if (!isValid) return;
    generateRC(userData);
    uploadUserToDatabase(userData);
}

function getUserData() {
    let username = document.getElementById('username');
    let firstName = document.getElementById('firstname');
    let lastName = document.getElementById('lastname');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirm');
    return {
        username: username.value,
        firstName: firstName.value,
        lastName: lastName.value,
        password: password.value,
        confirm: confirmPassword.value,
        unLocation: username,
        fnLocation: firstName,
        lnLocation: lastName,
        pLocation: password,
        cLocation: confirmPassword
    };
}

function sanitizeAndValidateData(user) {
    const hasSymbols = str => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);

    if (!user.username) {
        displayErrorMessages(user.unLocation, "username cannot be empty");
        return false;
    } else if (user.username.length < 3 || user.username.length > 8) {
        displayErrorMessages(user.unLocation, "username must be 3 to 8 characters long");
        return false;
    } else if (hasSymbols(user.username) || user.username.includes(' ')) {
        displayErrorMessages(user.unLocation, "username cannot contain spaces or special characters");
        return false;
    }

    if (!user.firstName) {
        displayErrorMessages(user.fnLocation, "firstname cannot be empty");
        return false;
    } else if (user.firstName.length < 3 || user.firstName.length > 16) {
        displayErrorMessages(user.fnLocation, "firstname must be 3 to 16 characters long");
        return false;
    } else if (hasSymbols(user.firstName)) {
        displayErrorMessages(user.fnLocation, "firstname cannot contain special characters");
        return false;
    }

    if (user.firstName === 'Zee') {
        alert("Fine, you can be Zee");
    }

    if (!user.lastName) {
        displayErrorMessages(user.lnLocation, "lastname cannot be empty");
        return false;
    } else if (user.lastName.length < 3 || user.lastName.length > 16) {
        displayErrorMessages(user.lnLocation, "lastname must be 3 to 16 characters long");
        return false;
    } else if (hasSymbols(user.lastName)) {
        displayErrorMessages(user.lnLocation, "lastname cannot contain special characters");
        return false;
    }

    if (!user.password) {
        displayErrorMessages(user.pLocation, "password cannot be empty");
        return false;
    } else if (user.password.length < 8) {
        displayErrorMessages(user.pLocation, "password must be at least 8 characters long");
        return false;
    } else if (!hasSymbols(user.password)) {
        displayErrorMessages(user.pLocation, "password must contain at least one special character");
        return false;
    } else if (user.password !== user.confirm) {
        displayErrorMessages(user.cLocation, "password and confirm password must match");
        return false;
    }

    return true;
}

function generateRC(user) {
    let recoveryCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.recoveryCode = recoveryCode;
    alert("Your Recovery Code is: " + recoveryCode);
}

async function uploadUserToDatabase(user) {
    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: user.username,
            firstname: user.firstName,
            lastname: user.lastName,
            password: user.password,
            recoveryCode: user.recoveryCode
        })
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.error.includes('username')) {
            displayErrorMessages(user.unLocation, data.error);
        } else {
            alert("Error creating account: " + data.error);
        }
        return;
    }

    alert("Account created successfully!");
    await login(user.username, user.password, user.unLocation, user.pLocation);
}
