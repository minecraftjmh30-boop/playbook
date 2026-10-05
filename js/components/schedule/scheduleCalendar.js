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
        },
        // Huddle schedule overlay support
        overlayStatus: {
            type: Function,
            default: null
        },
        selectedDates: {
            type: Array,
            default: () => []
        }
    },
    emits: ['change-month', 'day-click'],
    methods: {
        getDayClasses(day) {
            const classes = {};
            if (day.isPast) classes.disabled = true;
            if (day.isToday) classes.currentDate = true;
            if (day.mode === 'free' || day.isFree) classes.free = true;
            if (day.mode === 'busy' || day.isBusy) classes.busy = true;
            if (day.isToday && (day.mode === 'free' || day.isFree)) classes.currentDateFree = true;
            if (day.isToday && (day.mode === 'busy' || day.isBusy)) classes.currentDateBusy = true;
            if (day.startTime && day.endTime) classes.splitDate = true;
            if (day.type === 'outside-frame') classes['outside-frame'] = true;

            // Overlay status for huddle schedule
            if (this.overlayStatus && day.dateKey) {
                const status = this.overlayStatus(day.dateKey);
                if (status === 'green') classes['overlay-green'] = true;
                else if (status === 'yellow') classes['overlay-yellow'] = true;
                else if (status === 'red') classes['overlay-red'] = true;
            }

            // Selected date highlight
            if (this.selectedDates && this.selectedDates.includes(day.dateKey)) {
                classes['selected-date'] = true;
            }

            return classes;
        }
    },
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
                <div v-else-if="day.type === 'outside-frame'"
                     class="date outside-frame">
                    <p class="dateTitle">{{ day.date ? day.date.getDate() : '' }}</p>
                </div>
                <div v-else
                     class="date"
                     :class="getDayClasses(day)"
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
