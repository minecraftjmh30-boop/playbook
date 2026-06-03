function clearErrorMessages(){
    document.querySelectorAll('.error').forEach(element => element.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(element => element.remove());
}

function displayErrorMessages(location, message){
    location.classList.add('error');
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;
    location.insertAdjacentElement('afterend', errorMessage);
}