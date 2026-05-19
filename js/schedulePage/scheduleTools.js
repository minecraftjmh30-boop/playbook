const freeBtn = document.getElementById('freeBtn');
const busyBtn = document.getElementById('busyBtn');
const removeBtn = document.getElementById('removeBtn');

let free = false;
let busy = false;
let remove = false;

document.addEventListener('DOMContentLoaded', () => {
    free = false;
    busy = false;
    remove = false;
})

freeBtn.addEventListener('click', () => {
    busy = false
    remove = false
    busyBtn.classList.remove("active");
    removeBtn.classList.remove("active");
    free = !free
    freeBtn.classList.toggle('active');
})

busyBtn.addEventListener('click', () => {
    free = false
    remove = false
    freeBtn.classList.remove("active");
    removeBtn.classList.remove("active");
    busy = !busy
    busyBtn.classList.toggle('active');
})

removeBtn.addEventListener('click', () => {
    busy = false
    free = false
    freeBtn.classList.remove('active');
    busyBtn.classList.remove('active');
    remove = !remove
    removeBtn.classList.toggle('active');
})