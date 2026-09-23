const { createApp } = Vue;

createApp({
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
    computed: {
        monthInfo() {
            const year = this.currentMonthView.getFullYear();
            const month = this.currentMonthView.getMonth();
            const firstDayOfMonth = new Date(year, month, 1);
            const lastDayOfMonth = new Date(year, month + 1, 0);
            const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
            
            return {
                year,
                month: month + 1,
                firstDayOfWeek,
                lastDay: lastDayOfMonth.getDate(),
                prevMonth: new Date(year, month - 1, 1),
                nextMonth: new Date(year, month + 1, 1)
            };
        },
        displayedDays() {
            const { firstDayOfWeek, lastDay, year, month } = this.monthInfo;
            const days = [];

            // Add filler days for previous month
            for (let i = 0; i < firstDayOfWeek; i++) {
                days.push({ type: 'filler', date: null });
            }

            // Add actual days of the current month
            for (let d = 1; d <= lastDay; d++) {
                const dateObj = new Date(year, month, d);
                const dateKey = this.getDateKey(dateObj);
                const isToday = this.isSameDay(dateObj, new Date());
                const isPast = dateObj < new Date().setHours(0,0,0,0);

                days.push({
                    type: 'actual',
                    day: d,
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
        getDateKey(date) {
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const d = date.getDate();
            return `${y}-${m}-${d}`;
        },
        isSameDay(d1, d2) {
            return d1.getFullYear() === d2.getFullYear() &&
                   d1.getMonth() === d2.getMonth() &&
                   d1.getDate() === d2.getDate();
        },
        changeMonth(offset) {
            const newDate = new Date(this.currentMonthView);
            newDate.setMonth(newDate.getMonth() + offset);
            this.currentMonthView = newDate;
        },
        setMode(newMode) {
            this.mode = (this.mode === newMode) ? null : newMode;
        },
        handleDayClick(dayObj) {
            if (dayObj.isPast) return;

            if (this.mode === 'remove') {
                this.deleteSchedule(dayObj.dateKey);
            } else if (this.mode) {
                // Quick action: Apply mode directly to the day
                this.schedules[dayObj.dateKey] = {
                    ...this.schedules[dayObj.dateKey],
                    mode: this.mode
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
            const key = this.getDateKey(this.modalData.date);
            this.schedules[key] = {
                mode: this.modalData.mode,
                startTime: this.modalData.startTime,
                endTime: this.modalData.endTime
            };
            this.closeModal();
        },
        deleteSchedule(key) {
            if (confirm('Remove this schedule entry?')) {
                delete this.schedules[key];
            }
        },
        resetSchedule() {
            if (confirm('Are you sure you want to reset the entire schedule?')) {
                this.schedules = {};
            }
        }
    }
}).mount('#app');
