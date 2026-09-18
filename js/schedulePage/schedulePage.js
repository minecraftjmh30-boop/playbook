let today
const schedule = document.querySelector('#schedule');

document.addEventListener("DOMContentLoaded", startSchedulePage);

function startSchedulePage() {
    today = new Date();
    generateWeekDays();
    generateSchedule(today);
    monthMenu(today);
}

