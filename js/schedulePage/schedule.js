

function generateSchedule(targetDate) {
    schedule.innerHTML = ``
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

        if (
            i + 1 === targetDate.getDate() &&
            targetDate.getMonth() === today.getMonth() &&
            targetDate.getFullYear() === today.getFullYear()
        ) {
            date.classList.add("currentDate");
        }

        date.innerHTML = `
<p class="dateTitle">${i + 1}</p>
`;
        date.addEventListener("click", () => {
            if (date.classList.contains("currentDate")) {
                if (free){date.classList.toggle("currentDateFree");}
                if (busy){date.classList.toggle("currentDateBusy");}
                if (remove){
                    date.classList.remove("currentDateFree");
                    date.classList.remove("currentDateBusy");
                }
            }else {
                if (free) {
                    date.classList.toggle("free");
                }
                if (busy) {
                    date.classList.toggle("busy");
                }
                if (remove) {
                    date.classList.remove("free");
                    date.classList.remove("busy");
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
    div.classList.add("center")
    div.innerHTML = `
    <button class="flex-1" id="backwards"> &#8592; </button>
    <h3 class="flex-1">${monthFormat.format(targetDate)} ${yearFormat.format(targetDate)}</h3>
    <button class="flex-1" id="forwards"> &#8594; </button>  `

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
    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
    for (let i = 0; i < weekdays.length; i++) {
        const weekday = document.createElement('p')
        weekday.classList.add("weekday")
        weekday.innerText = `${weekdays[i]}`;
        area.appendChild(weekday);
    }
}