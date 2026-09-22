const freeBtn = document.getElementById('freeBtn');
const busyBtn = document.getElementById('busyBtn');
const removeBtn = document.getElementById('removeBtn');

let free = false;
let busy = false;
let remove = false;

function updateButtonStyles() {
    freeBtn.classList.toggle('active', free);
    busyBtn.classList.toggle('active', busy);
    removeBtn.classList.toggle('active', remove);
}

freeBtn.addEventListener('click', () => {
    free = !free;
    busy = false;
    remove = false;
    updateButtonStyles();
});

busyBtn.addEventListener('click', () => {
    free = false;
    busy = !busy;
    remove = false;
    updateButtonStyles();
});

removeBtn.addEventListener('click', () => {
    free = false;
    busy = false;
    remove = !remove;
    updateButtonStyles();
});