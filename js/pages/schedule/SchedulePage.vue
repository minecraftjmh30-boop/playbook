<template>
    <div class="d-flex flex-column min-vh-100">
        <AppHeader></AppHeader>
        <main class="container my-4 flex-grow-1">
            <ScheduleTools :mode="mode" @set-mode="setMode"></ScheduleTools>
            <ScheduleCalendar :month-info="calendar.info" :displayed-days="calendar.days" :is-current-month="calendar.isCurrentMonth" :interactive="true" @change-month="changeMonth" @day-click="handleDayClick"></ScheduleCalendar>
            <section class="row justify-content-center gap-2 mt-4">
                <button class="btn btn-secondary col-auto px-4 rounded-pill" type="button" @click="resetSchedule">Reset</button>
                <button class="btn btn-primary col-auto px-4 rounded-pill" type="button" @click="saveSchedule">Save</button>
            </section>
        </main>
        <TimeRangeModal :show="showTimeModal" :modal-data="modalData" @close="closeModal" @save="saveTime"></TimeRangeModal>
        <AppFooter></AppFooter>
        <ToastComponent ref="toast" />
    </div>
</template>

<script>
import { getCookie, getDateKey } from '../../core/utils.js';
import { provide, ref } from 'vue';
import { ToastKey } from '../../core/keys.js';
import { store } from '../../core/store.js';
import { CalendarMonth } from '../../models/CalendarMonth.js';
import { DateRange } from '../../models/DateRange.js';
import { Schedule } from '../../collections/Schedule.js';
import AppHeader from '../../components/main/AppHeader.vue';
import AppFooter from '../../components/main/AppFooter.vue';
import ScheduleTools from '../../components/schedule/ScheduleTools.vue';
import ScheduleCalendar from '../../components/schedule/ScheduleCalendar.vue';
import TimeRangeModal from '../../components/modals/TimeRangeModal.vue';
import ToastComponent from '../../components/ui/Toast.vue';

export default {
    name: 'SchedulePage',
    components: { AppHeader, AppFooter, ScheduleTools, ScheduleCalendar, TimeRangeModal, ToastComponent },
    setup() {
        const toast = ref(null);
        provide(ToastKey, toast);
        return { toast };
    },
    data() {
        return {
            today: new Date(),
            currentMonthView: new Date(),
            mode: null, // 'free', 'busy', or 'remove'
            showTimeModal: false,
            modalData: {
                date: null,
                mode: 'free',
                startTime: '',
                endTime: ''
            },
            // Mock data for schedules
            schedules: new Schedule()
        };
    },
    async mounted() {
        await this.loadSchedule();
    },
    computed: {
        calendar() {
            // SchedulePage can't go before the current month
            const startOfThisMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
            const range = new DateRange(startOfThisMonth, null);
            return new CalendarMonth(this.currentMonthView, { range, schedule: this.schedules, today: this.today });
        }
    },
    methods: {
        async loadSchedule() {
            const userId = getCookie('currentUser') || 'User1';
            const storageKey = `schedule_${userId}`;

            // Check store first
            if (store.schedules[storageKey]) {
                this.schedules = store.schedules[storageKey];
                return;
            }

            // Load from CSV if not in store
            const url = `/debug/debugLogins/${userId}/schedule.csv`;
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const text = await response.text();
                    this.schedules = Schedule.fromCSV(text, this.today);
                    store.schedules[storageKey] = this.schedules;
// localStorage disabled - store.schedules is reactive
                }
            } catch (e) {
                console.warn('CSV fetch failed, starting with empty schedule.');
            }
        },
        async saveSchedule() {
            const userId = getCookie('currentUser') || 'User1';
            const storageKey = `schedule_${userId}`;

            store.schedules[storageKey] = this.schedules;
// localStorage disabled - store.schedules is reactive
            this.toast.success('Schedule saved successfully!');
            console.log('Simulated upload to schedule.csv:', this.schedules.toPlain());
        },
        changeMonth(offset) {
            const newCalendar = this.calendar.shift(offset);
            this.currentMonthView = newCalendar.viewDate;
        },
        setMode(newMode) {
            this.mode = (this.mode === newMode) ? null : newMode;
        },
        handleDayClick(dayObj) {
            if (dayObj.isPast) return;

            if (this.mode === 'remove') {
                this.schedules.remove(dayObj.dateKey);
            } else if (this.mode) {
                // Quick action: Apply mode directly to the day
                this.schedules.set(dayObj.dateKey, {
                    mode: this.mode,
                    startTime: '',
                    endTime: ''
                });
            } else {
                // Open modal for detailed time setting
                this.openTimeModal(dayObj);
            }
        },
        openTimeModal(dayObj) {
            const entry = this.schedules.get(dayObj.dateKey);
            this.modalData = {
                date: dayObj.date,
                mode: entry ? entry.mode : 'free',
                startTime: entry ? entry.startTime : '',
                endTime: entry ? entry.endTime : ''
            };
            this.showTimeModal = true;
        },
        closeModal() {
            this.showTimeModal = false;
        },
        saveTime() {
            if (!this.modalData.startTime || !this.modalData.endTime) {
                this.toast.error("Please select both start and end times.");
                return;
            }
            const key = getDateKey(this.modalData.date);
            this.schedules.set(key, {
                mode: this.modalData.mode,
                startTime: this.modalData.startTime,
                endTime: this.modalData.endTime
            });
            this.closeModal();
        },
        resetSchedule() {
            this.schedules.clear();
        }
    }
};
</script>
