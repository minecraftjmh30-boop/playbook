<template>
    <div class="d-flex flex-column min-vh-100">
        <AppHeader></AppHeader>
        <main class="container my-4 flex-grow-1">
            <ScheduleTools :mode="mode" @set-mode="setMode"></ScheduleTools>
            <ScheduleCalendar :month-info="monthInfo" :displayed-days="displayedDays" :is-current-month="isCurrentMonth" :interactive="true" @change-month="changeMonth" @day-click="handleDayClick"></ScheduleCalendar>
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
import { getCookie, getDateKey, isSameDay } from '../../core/utils.js';
import { provide, ref } from 'vue';
const ToastKey = Symbol('toast');
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
            schedules: {} 
        };
    },
    async mounted() {
        await this.loadSchedule();
    },
    computed: {
        isCurrentMonth() {
            return this.currentMonthView.getFullYear() === this.today.getFullYear() &&
                   this.currentMonthView.getMonth() === this.today.getMonth();
        },
        monthInfo() {
            const year = this.currentMonthView.getFullYear();
            const monthIndex = this.currentMonthView.getMonth();
            const firstDayOfMonth = new Date(year, monthIndex, 1);
            const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
            const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(this.currentMonthView);
            
            return {
                year,
                monthIndex,
                monthName,
                month: monthIndex + 1,
                firstDayOfWeek,
                lastDay: lastDayOfMonth.getDate()
            };
        },
        displayedDays() {
            const { firstDayOfWeek, lastDay, year, monthIndex } = this.monthInfo;
            const days = [];

            // Add filler days for previous month
            for (let i = 0; i < firstDayOfWeek; i++) {
                days.push({ type: 'filler', date: null });
            }

            const todayStart = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).getTime();

            // Add actual days of the current month
            for (let day = 1; day <= lastDay; day++) {
                const dateObj = new Date(year, monthIndex, day);
                const dateKey = getDateKey(dateObj);
                const isToday = isSameDay(dateObj, this.today);
                const isPast = dateObj.getTime() < todayStart;

                days.push({
                    type: 'actual',
                    day: day,
                    date: dateObj,
                    dateKey: dateKey,
                    isToday,
                    isPast,
                    ...this.schedules[dateKey] || { mode: null, startTime: '', endTime: '' }
                });
            }

            return days;
        }
    },
    methods: {
        async loadSchedule() {
            const userId = getCookie('currentUser') || 'User1';
            const storageKey = `schedule_${userId}`;
            
            try {
                const savedData = localStorage.getItem(storageKey);
                if (savedData) {
                    this.schedules = JSON.parse(savedData);
                } else {
                    const url = `/debug/debugLogins/${userId}/schedule.csv`;
                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            const text = await response.text();
                            const lines = text.trim().split('\n');
                            const todayStart = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).getTime();
                            const newSchedules = {};
                            for (const line of lines) {
                                if (!line.trim()) continue;
                                const [dateStr, mode, startTime, endTime] = line.split(',');
                                const [year, month, day] = dateStr.split('-').map(Number);
                                const dateObj = new Date(year, month - 1, day);
                                if (dateObj.getTime() >= todayStart) {
                                    newSchedules[dateStr] = { mode, startTime, endTime };
                                }
                            }
                            this.schedules = newSchedules;
                            localStorage.setItem(storageKey, JSON.stringify(this.schedules));
                        }
                    } catch (e) {
                        console.warn('CSV fetch failed, starting with empty schedule.');
                    }
                }
            } catch (error) {
                console.error('Error loading schedule:', error);
            }
        },
        async saveSchedule() {
            const userId = getCookie('currentUser') || 'User1';
            const storageKey = `schedule_${userId}`;
            
            try {
                localStorage.setItem(storageKey, JSON.stringify(this.schedules));
                this.toast.success('Schedule saved successfully!');
                console.log('Simulated upload to schedule.csv:', this.schedules);
            } catch (error) {
                console.error('Error saving schedule:', error);
                this.toast.error('Error saving schedule.');
            }
        },
        changeMonth(offset) {
            const newDate = new Date(this.currentMonthView.getFullYear(), this.currentMonthView.getMonth() + offset, 1);
            if (offset < 0) {
                const minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
                if (newDate < minDate) {
                    return;
                }
            }
            this.currentMonthView = newDate;
        },
        setMode(newMode) {
            this.mode = (this.mode === newMode) ? null : newMode;
        },
        handleDayClick(dayObj) {
            if (dayObj.isPast) return;

            if (this.mode === 'remove') {
                delete this.schedules[dayObj.dateKey];
            } else if (this.mode) {
                // Quick action: Apply mode directly to the day
                this.schedules[dayObj.dateKey] = {
                    mode: this.mode,
                    startTime: '',
                    endTime: ''
                };
            } else {
                // Open modal for detailed time setting
                this.openTimeModal(dayObj);
            }
        },
        openTimeModal(dayObj) {
            this.modalData = {
                date: dayObj.date,
                mode: dayObj.mode || 'free',
                startTime: dayObj.startTime || '',
                endTime: dayObj.endTime || ''
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
            this.schedules[key] = {
                mode: this.modalData.mode,
                startTime: this.modalData.startTime,
                endTime: this.modalData.endTime
            };
            this.closeModal();
        },
        resetSchedule() {
            this.schedules = {};
        }
    }
};
</script>
