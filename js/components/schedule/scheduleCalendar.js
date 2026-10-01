const ScheduleCalendar = {
    name: 'ScheduleCalendar',
    props: {
        monthInfo: {
            type: Object,
            required: true
        },
        displayedDays: {
            type: Array,
            required: true
        },
        isCurrentMonth: {
            type: Boolean,
            default: false
        },
        interactive: {
            type: Boolean,
            default: false
        }
    },
    emits: ['change-month', 'day-click'],
    template: `
    <div>
        <div class="row justify-content-center align-items-center mb-3">
            <button class="btn btn-sm btn-outline-secondary col-auto px-2 rounded-pill" :class="{ invisible: isCurrentMonth }" @click="$emit('change-month', -1)"> &#8592; </button>
            <h6 v-if="!interactive" class="col-auto text-center mx-2 my-0">{{ monthInfo.monthName }} {{ monthInfo.year }}</h6>
            <h3 v-else class="col-auto text-center mx-3 my-0">{{ monthInfo.monthName }} {{ monthInfo.year }}</h3>
            <button class="btn btn-sm btn-outline-secondary col-auto px-2 rounded-pill" @click="$emit('change-month', 1)"> &#8594; </button>
        </div>

        <div class="weekdayTable mb-2" :id="interactive ? 'weekdays' : undefined">
            <div class="weekday">Sun</div>
            <div class="weekday">Mon</div>
            <div class="weekday">Tue</div>
            <div class="weekday">Wed</div>
            <div class="weekday">Thu</div>
            <div class="weekday">Fri</div>
            <div class="weekday">Sat</div>
        </div>

        <section :id="interactive ? 'schedule' : undefined" class="scheduleTable" :class="{ 'mb-0': !interactive }">
            <template v-for="(day, index) in displayedDays" :key="index">
                <div v-if="day.type === 'filler'" class="date dateSkipped opacity-0">
                    <div><p>skipped</p></div>
                </div>
                <div v-else 
                     class="date" 
                     :class="{
                        'disabled': day.isPast,
                        'currentDate': day.isToday,
                        'free': day.mode === 'free' || day.isFree,
                        'busy': day.mode === 'busy' || day.isBusy,
                        'currentDateFree': day.isToday && (day.mode === 'free' || day.isFree),
                        'currentDateBusy': day.isToday && (day.mode === 'busy' || day.isBusy),
                        'splitDate': day.startTime && day.endTime
                     }"
                     @click="$emit('day-click', day)">
                    <p class="dateTitle">{{ day.day }}</p>
                </div>
            </template>
        </section>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.ScheduleCalendar = ScheduleCalendar;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('schedule-calendar', ScheduleCalendar);
        return app;
    };
}
