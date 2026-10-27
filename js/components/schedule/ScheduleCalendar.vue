<template>
    <div>
        <div class="row justify-content-center align-items-center mb-3">
            <button class="btn btn-sm btn-outline-secondary col-auto px-2 rounded-pill" :class="{ invisible: isCurrentMonth }" @click="$emit('change-month', -1)"> &#8592; </button>
            <h6 v-if="!interactive" class="col-auto text-center mx-2 my-0">{{ monthInfo.monthName }} {{ monthInfo.year }}</h6>
            <h3 v-else class="col-auto text-center mx-3 my-0">{{ monthInfo.monthName }} {{ monthInfo.year }}</h3>
            <button class="btn btn-sm btn-outline-secondary col-auto px-2 rounded-pill" @click="$emit('change-month', 1)"> &#8594; </button>
        </div>
        <div class="weekdayTable mb-2" :id="interactive ? 'weekdays' : undefined">
            <div class="weekday">Sun</div><div class="weekday">Mon</div><div class="weekday">Tue</div><div class="weekday">Wed</div><div class="weekday">Thu</div><div class="weekday">Fri</div><div class="weekday">Sat</div>
        </div>
        <section :id="interactive ? 'schedule' : undefined" class="scheduleTable" :class="{ 'mb-0': !interactive }">
            <template v-for="(day, index) in displayedDays" :key="index">
                <div v-if="day.type === 'filler'" class="date dateSkipped opacity-0"><div><p>skipped</p></div></div>
                <div v-else-if="day.type === 'outside-frame'" class="date outside-frame"><p class="dateTitle">{{ day.date ? day.date.getDate() : '' }}</p></div>
                <div v-else class="date" :class="getDayClasses(day)" @click="$emit('day-click', day)"><p class="dateTitle">{{ day.day }}</p></div>
            </template>
        </section>
        <div v-if="overlayStatus" class="mt-3">
            <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="collapse" :data-bs-target="'#legend-' + (interactive ? '' : 'static')" aria-expanded="false">Schedule Legend <span class="caret"></span></button>
            <div :id="'legend-' + (interactive ? '' : 'static')" class="collapse mt-2 p-2 bg-light rounded">
                <div class="d-flex flex-wrap gap-2 small text-dark">
                    <span class="d-flex align-items-center"><span class="badge bg-success me-1">●</span> All Free</span>
                    <span class="d-flex align-items-center"><span class="badge bg-warning text-dark me-1">●</span> Mixed</span>
                    <span class="d-flex align-items-center"><span class="badge bg-danger me-1">●</span> Majority Busy</span>
                    <span class="d-flex align-items-center"><span class="badge bg-primary me-1">●</span> Planned Date</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
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
};
</script>

<style lang="scss" scoped>
.scheduleTable,
.weekdayTable {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.25rem;

    @media (min-width: 576px) { gap: 0.5rem; }
    @media (min-width: 768px) { gap: 1rem; }
}

.scheduleTable { grid-auto-rows: 1fr; margin-bottom: 2rem; }
.weekdayTable { margin-bottom: 0.5rem; }

.weekday {
    text-align: center;
    font-weight: 600;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) { font-size: 1rem; }
}

.date {
    background-color: var(--bs-tertiary-bg, #f8f9fa);
    border: 1px solid var(--bs-border-color, #dee2e6);
    border-radius: var(--bs-border-radius, 0.375rem);
    padding: 0.375rem 0.25rem;
    width: 100%;
    aspect-ratio: 1 / 1;
    min-height: 2.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    user-select: none;
    box-sizing: border-box;

    @media (min-width: 576px) { min-height: 3.5rem; padding: 0.5rem; }
    @media (min-width: 768px) { min-height: 4.5rem; padding: 1rem; }
    &:hover { background-color: var(--bs-secondary-bg, #e9ecef); border-color: var(--bs-border-color-translucent, #ced4da); }
}

.dateTitle { text-align: center; font-weight: 600; margin-bottom: 0; font-size: 0.875rem; @media (min-width: 768px) { font-size: 1rem; } }
.currentDate { background-color: var(--bs-dark, #212529); color: var(--bs-light, #ffffff); border-color: var(--bs-dark, #212529); &:hover { background-color: var(--bs-gray-800, #343a40); color: var(--bs-light, #ffffff); } }
.free { background-color: var(--bs-success-bg-subtle, #d1e7dd); color: var(--bs-success-text-emphasis, #0a3622); border-color: var(--bs-success-border-subtle, #a3cfbb); &:hover { background-color: #b7e1cd; opacity: 0.9; } }
.freeSaved { background-color: var(--bs-success, #198754); color: #ffffff; border-color: var(--bs-success, #198754); &:hover { background-color: #157347; color: #ffffff; } }
.busy { background-color: var(--bs-danger-bg-subtle, #f8d7da); color: var(--bs-danger-text-emphasis, #58151c); border-color: var(--bs-danger-border-subtle, #f1aeb5); &:hover { background-color: #f1b0b7; opacity: 0.9; } }
.busySaved { background-color: var(--bs-danger, #dc3545); color: #ffffff; border-color: var(--bs-danger, #dc3545); &:hover { background-color: #bb2d3b; color: #ffffff; } }
.currentDateFree { color: var(--bs-success, #198754) !important; border-color: var(--bs-success, #198754) !important; box-shadow: 0 0 0 2px var(--bs-success, #198754); }
.currentDateBusy { color: var(--bs-danger, #dc3545) !important; border-color: var(--bs-danger, #dc3545) !important; box-shadow: 0 0 0 2px var(--bs-danger, #dc3545); }
.dateSkipped { opacity: 0; pointer-events: none; visibility: hidden; }
.date.disabled { pointer-events: none; opacity: 0.5; cursor: default; }
.splitDate { border-left: 4px solid var(--bs-primary); background-color: var(--bs-info-bg-subtle); }
.outside-frame { opacity: 0.3; pointer-events: none; cursor: not-allowed; }
.overlay-green { background-color: var(--bs-success-bg-subtle, #d1e7dd) !important; border-color: var(--bs-success, #198754) !important; box-shadow: inset 0 0 0 2px var(--bs-success, #198754); }
.overlay-yellow { background-color: var(--bs-warning-bg-subtle, #fff3cd) !important; border-color: var(--bs-warning, #ffc107) !important; box-shadow: inset 0 0 0 2px var(--bs-warning, #ffc107); }
.overlay-red { background-color: var(--bs-danger-bg-subtle, #f8d7da) !important; border-color: var(--bs-danger, #dc3545) !important; box-shadow: inset 0 0 0 2px var(--bs-danger, #dc3545); }
.selected-date { background-color: var(--bs-primary-bg-subtle, #cfe2ff) !important; border-color: var(--bs-primary, #0d6efd) !important; box-shadow: inset 0 0 0 2px var(--bs-primary, #0d6efd); }
</style>