let today
let month
const schedule = document.querySelector('#schedule');

document.addEventListener("DOMContentLoaded", function() {
    today = new Date();
    generateWeekDays();
    generateSchedule(today);
    monthMenu(today);
});

