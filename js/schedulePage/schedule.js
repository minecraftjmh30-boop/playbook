

let activeDateForModal = null;
let storedSchedules = {}; // To temporarily store schedules when switching months

function generateSchedule(targetDate) {
    // Save current dates before clearing
    const currentDates = schedule.querySelectorAll(".date");
    currentDates.forEach(el => {
        if (el.dataset.year && el.dataset.month && el.dataset.date) {
            const key = `${el.dataset.year}-${el.dataset.month}-${el.dataset.date}`;
            storedSchedules[key] = {
                startTime: el.dataset.startTime,
                endTime: el.dataset.endTime,
                mode: el.dataset.mode,
                isSplit: el.classList.contains('splitDate'),
                isFree: el.classList.contains('free') || el.classList.contains('currentDateFree'),
                isBusy: el.classList.contains('busy') || el.classList.contains('currentDateBusy')
            };
        }
    });

    schedule.innerHTML = ``;
    let month = targetDate.getMonth() + 1;
    let firstWeekday = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    console.log(`${month} - ${firstWeekday.getDay()}`);
    let amount = firstWeekday.getDay()
    console.log(amount)
    generateFiller(amount);
    generateDate(targetDate);
}


function generateFiller(amount) {
    schedule.innerHTML = ``;
    for (let i = 0; i < amount; i++) {
        const date = document.createElement("div");
        date.classList.add("date");
        date.classList.add("dateSkipped");
        date.classList.add("opacity-0");
        date.innerHTML = `<div><p>skipped</p></div>`;
        schedule.appendChild(date);
    }
}

function generateDate(targetDate) {
    let lastDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1);
    lastDay.setDate(lastDay.getDate() - 1);

    console.log(lastDay);
    for (let i = 0; i < lastDay.getDate(); i++) {
        const date = document.createElement("div");
        date.classList.add("date");

        date.dataset.month = (targetDate.getMonth() + 1).toString();
        date.dataset.date = (i + 1).toString();
        date.dataset.year = targetDate.getFullYear();

        // Re-add stored data if it exists
        const key = `${date.dataset.year}-${date.dataset.month}-${date.dataset.date}`;
        if (storedSchedules[key]) {
            const data = storedSchedules[key];
            if (data.startTime) date.dataset.startTime = data.startTime;
            if (data.endTime) date.dataset.endTime = data.endTime;
            if (data.mode) date.dataset.mode = data.mode;
            if (data.isSplit) date.classList.add('splitDate');
            if (data.isFree) {
                if (date.classList.contains('currentDate')) {
                    date.classList.add('currentDateFree');
                } else {
                    date.classList.add('free');
                }
            }
            if (data.isBusy) {
                if (date.classList.contains('currentDate')) {
                    date.classList.add('currentDateBusy');
                } else {
                    date.classList.add('busy');
                }
            }
        }

        if (
            i + 1 === targetDate.getDate() &&
            targetDate.getMonth() === today.getMonth() &&
            targetDate.getFullYear() === today.getFullYear()
        ) {
            date.classList.add("currentDate");
        }

        // Disable past dates
        const currentDateObj = new Date(targetDate.getFullYear(), targetDate.getMonth(), i + 1);
        currentDateObj.setHours(0, 0, 0, 0);
        const todayObj = new Date();
        todayObj.setHours(0, 0, 0, 0);

        if (currentDateObj < todayObj) {
            date.classList.add("disabled");
            date.style.pointerEvents = "none";
            date.style.opacity = "0.5";
        }

        date.innerHTML = `
<p class="dateTitle">${i + 1}</p>
`;
        date.addEventListener("click", () => {
            if (date.classList.contains("disabled")) return;

            if (free || busy || remove) {
                // Quick buttons override existing time info
                delete date.dataset.startTime;
                delete date.dataset.endTime;
                delete date.dataset.mode;
                date.classList.remove('splitDate');

                if (date.classList.contains("currentDate")) {
                    if (free){date.classList.toggle("currentDateFree");}
                    if (busy){date.classList.toggle("currentDateBusy");}
                    if (remove){
                        date.classList.remove("currentDateFree");
                        date.classList.remove("currentDateBusy");
                    }
                }else {
                    if (free) {
                        date.classList.remove("busy");
                        date.classList.toggle("free");
                    }
                    if (busy) {
                        date.classList.remove("free")
                        date.classList.toggle("busy");
                    }
                    if (remove) {
                        date.classList.remove("free");
                        date.classList.remove("busy");
                    }
                }
            } else {
                activeDateForModal = date;
                
                // Pre-populate modal with existing info
                $('#modalMode').val(date.dataset.mode || 'free');
                $('#modalStartTime').val(date.dataset.startTime || '');
                $('#modalEndTime').val(date.dataset.endTime || '');

                const modalElement = document.getElementById('timeModal');
                if (modalElement && typeof bootstrap !== 'undefined') {
                    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                    modal.show();
                }
            }
        })
        schedule.appendChild(date);
    }
}

function monthMenu(targetDate){
    const menu = document.getElementById("monthMenu");
    const monthFormat = new Intl.DateTimeFormat("en-US", {month: 'long'})
    const yearFormat = new Intl.DateTimeFormat("en-US", {year: 'numeric'})
    const div = document.createElement("div");
    menu.innerHTML = ``;
    div.classList.add("row");
    div.classList.add("justify-content-center");
    div.classList.add("align-items-center");
    div.innerHTML = `
    <button class="btn btn-outline-secondary col-auto px-3 rounded-pill" id="backwards"> &#8592; </button>
    <h3 class="col-auto text-center mx-3 my-0">${monthFormat.format(targetDate)} ${yearFormat.format(targetDate)}</h3>
    <button class="btn btn-outline-secondary col-auto px-3 rounded-pill" id="forwards"> &#8594; </button>  `

    if (targetDate.getMonth() === today.getMonth() && targetDate.getFullYear() === today.getFullYear()) {
        div.querySelector("#backwards").classList.add("hidden");
    }

    div.querySelector("#backwards").addEventListener("click", function(){
        let lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() -1, 1);
        if (lastMonth.getMonth() === today.getMonth() && lastMonth.getFullYear() === today.getFullYear()) {
            lastMonth = today
        }
        generateSchedule(lastMonth);
        monthMenu(lastMonth);
    })
    div.querySelector("#forwards").addEventListener("click", function(){
        let nextMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() +1, 1);
        generateSchedule(nextMonth);
        monthMenu(nextMonth);
    })

    menu.appendChild(div);

}

function generateWeekDays(){
    const area = document.getElementById("weekdays");
    area.innerHTML = ``;
    const weekdays = [
        { full: "Sunday", short: "Sun" },
        { full: "Monday", short: "Mon" },
        { full: "Tuesday", short: "Tue" },
        { full: "Wednesday", short: "Wed" },
        { full: "Thursday", short: "Thu" },
        { full: "Friday", short: "Fri" },
        { full: "Saturday", short: "Sat" }
    ];
    for (let i = 0; i < weekdays.length; i++) {
        const weekday = document.createElement('div');
        weekday.classList.add("weekday", "text-center", "fw-bold", "mb-0");
        weekday.innerHTML = `<span class="d-inline">${weekdays[i].short}</span>`;
        area.appendChild(weekday);
    }
}

$(document).on('click', '#saveTimeBtn', () => {
    if (!activeDateForModal) return;

    const mode = $('#modalMode');
    const startTime = $('#modalStartTime');
    const endTime = $('#modalEndTime');

    if (!startTime.val() || !endTime.val()) {
        alert("Please select both start and end times.");
        return;
    }

    // Clear existing status classes
    activeDateForModal.classList.remove('free', 'busy', 'currentDateFree', 'currentDateBusy', 'freeSaved', 'busySaved', 'splitDate');
    
    // Apply splitDate class
    activeDateForModal.classList.add('splitDate');

    // Store the time information in data attributes
    activeDateForModal.dataset.startTime = startTime.val();
    activeDateForModal.dataset.endTime = endTime.val();
    activeDateForModal.dataset.mode = mode.val();

    // Close the modal
    const modalElement = document.getElementById('timeModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    }
    
    // Reset modal inputs for next use
    startTime.val('');
    endTime.val('');
});

$('#resetBtn').on('click', () => {
    schedule.innerHTML = ``;
    startSchedulePage();
});