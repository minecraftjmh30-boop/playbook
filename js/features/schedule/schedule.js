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
            for (let d = 1; d <= lastDay; d++) {
                const dateObj = new Date(year, monthIndex, d);
                const dateKey = this.getDateKey(dateObj);
                const isToday = this.isSameDay(dateObj, this.today);
                const isPast = dateObj.getTime() < todayStart;

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
        async loadSchedule() {
            const userId = window.utils.getCookie('currentUser') || 'User1';
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
                                const [y, m, d] = dateStr.split('-').map(Number);
                                const dateObj = new Date(y, m - 1, d);
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
            const userId = window.utils.getCookie('currentUser') || 'User1';
            const storageKey = `schedule_${userId}`;
            
            try {
                localStorage.setItem(storageKey, JSON.stringify(this.schedules));
                window.toast.success('Schedule saved successfully!');
                console.log('Simulated upload to schedule.csv:', this.schedules);
            } catch (error) {
                console.error('Error saving schedule:', error);
                window.toast.error('Error saving schedule.');
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
                window.toast.error("Please select both start and end times.");
                return;
            }
            const key = this.getDateKey(this.modalData.date);
            this.schedules[key] = {
                mode: this.modalData.mode,
                startTime: this.modalData.startTime,
                endTime: this.modalData.endTime
            };
            this.closeModal();
        },
        deleteSchedule(key) {
            delete this.schedules[key];
        },
        resetSchedule() {
            this.schedules = {};
        }
    }
}).mount('#app');
