const { createApp } = Vue;


function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

createApp({
    data() {
        const urlParams = typeof window !== 'undefined' && window.location ? new URLSearchParams(window.location.search) : null;
        const idParam = urlParams ? (urlParams.get('id') || urlParams.get('code')) : null;
        
        const huddles = JSON.parse(localStorage.getItem('huddles')) || [];
        const huddleData = huddles.find(h => h.id == idParam || h.code == idParam) || {
            name: 'Huddle Not Found',
            description: 'The requested huddle could not be found.',
            location: 'Unknown',
            code: idParam || '',
            status: 'Offline',
            owner: null,
            startDate: null,
            endDate: null
        };

        const currentUser = getCookie('currentUser');

        return {
            // Huddle data
            huddle: huddleData,
            participants: [
                { name: 'User 1', id: 'User1' },
                { name: 'User 2', id: 'User2' },
                { name: 'User 3', id: 'User3' },
                { name: 'User 4', id: 'User4' }
            ],
            messages: [
                { user: 'User 1', text: 'Welcome to the huddle!', time: 'Yesterday' },
                { user: 'User 2', text: 'Thanks!', time: 'Yesterday' },
                { user: 'User 3', text: 'Is there a schedule here?', time: 'Yesterday' }
            ],
            currentUser,

            // Schedule preview data
            today: new Date(),
            currentMonthView: new Date(),
            schedules: {} 
        };
    },
    computed: {
        // Schedule computed properties
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

            const startDate = this.huddle.startDate ? new Date(this.huddle.startDate) : null;
            const endDate = this.huddle.endDate ? new Date(this.huddle.endDate) : null;

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

                // Check if the date is within the huddle's time frame if provided
                let isWithinFrame = true;
                if (startDate && dateObj < startDate) {
                    isWithinFrame = false;
                }
                if (endDate && dateObj > endDate) {
                    isWithinFrame = false;
                }

                if (isWithinFrame) {
                    days.push({
                        type: 'actual',
                        day: d,
                        date: dateObj,
                        dateKey: dateKey,
                        isToday,
                        isPast,
                        ...this.schedules[dateKey] || { mode: null, startTime: '', endTime: '' }
                    });
                } else {
                    // Add a placeholder for skipped days within the month view if it's part of the month 
                    // so the grid doesn't break, but mark it as skipped.
                    days.push({ type: 'filler', date: null }); 
                }
            }

            return days;
        }
    },
    methods: {
        // Huddle methods
        sendMessage(text) {
            if (text && text.trim()) {
                this.messages.push({
                    user: this.currentUser || 'User 1',
                    text: text.trim(),
                    time: 'Just now'
                });
            }
        },

        // Schedule methods
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
            const newDate = new Date(this.currentMonthView.getFullYear(), this.currentMonthView.getMonth() + offset, 1);
            if (offset < 0) {
                const minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
                if (newDate < minDate) {
                    return;
                }
            }
            this.currentMonthView = newDate;
        }
    }
}).mount('#app');
