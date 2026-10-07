const { createApp } = Vue;

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
            endDate: null,
            participants: [],
            messages: [],
            selectedDates: []
        };

        const currentUser = window.utils.getCookie('currentUser');

        // Check if user is authorized to access this huddle
        const participantIds = huddleData.participants || [huddleData.owner];
        const isOwner = currentUser && huddleData.owner === currentUser;
        const isParticipant = currentUser && participantIds.includes(currentUser);
        const isAuthorized = isOwner || isParticipant || huddleData.name === 'Huddle Not Found';

        if (!isAuthorized && huddleData.name !== 'Huddle Not Found') {
            // Redirect unauthorized users to index page
            window.toast.error('You are not a participant of this huddle and cannot access it.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }

        // Build participants list from huddle data
        const participants = (huddleData.participants || [huddleData.owner]).map(id => ({
            name: id,
            id: id
        }));

        // Load messages from huddle data, default to empty array
        const messages = huddleData.messages || [];

        // Initialize currentMonthView to the huddle's start month if available, otherwise current month
        let initialMonthView = new Date();
        if (huddleData.startDate) {
            const startDate = new Date(huddleData.startDate);
            initialMonthView = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        }

        return {
            // Huddle data
            huddle: huddleData,
            participants,
            messages,
            currentUser,
            huddles, // reference to all huddles for localStorage updates

            // Schedule preview data
            today: new Date(),
            currentMonthView: initialMonthView,
            schedules: {},

            // Huddle schedule overlay modal
            showOverlayModal: false,
            overlayDate: null,
            overlayData: []
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

                // Only add days that are within the proper timeline
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
                    // Show a "disabled" placeholder for days outside the time frame
                    days.push({ 
                        type: 'outside-frame', 
                        date: dateObj,
                        disabled: true
                    }); 
                }
            }

            return days;
        }
    },
    methods: {
        // Huddle methods
        sendMessage(text) {
            if (text && text.trim()) {
                const msg = {
                    user: this.currentUser || 'Anonymous',
                    text: text.trim(),
                    time: new Date().toLocaleTimeString()
                };
                this.messages.push(msg);
                // Persist messages to localStorage
                this.saveHuddleData();
            }
        },
        saveHuddleData() {
            const index = this.huddles.findIndex(h => h.id === this.huddle.id);
            if (index !== -1) {
                this.huddles[index].participants = this.huddle.participants;
                this.huddles[index].messages = this.messages;
                this.huddles[index].selectedDates = this.huddle.selectedDates || [];
                this.huddles[index].name = this.huddle.name;
                this.huddles[index].description = this.huddle.description;
                this.huddles[index].location = this.huddle.location;
                localStorage.setItem('huddles', JSON.stringify(this.huddles));
            }
        },
        deleteMessage(index) {
            if (index >= 0 && index < this.messages.length) {
                this.messages.splice(index, 1);
                this.saveHuddleData();
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
        formatDate(dateStr) {
            // Use shared utility
            return window.utils.formatDate(dateStr);
        },
        changeMonth(offset) {
            const newDate = new Date(this.currentMonthView.getFullYear(), this.currentMonthView.getMonth() + offset, 1);
            
            // Validate against huddle time frame — only restrict if BOTH start and end are set
            if (this.huddle.startDate && this.huddle.endDate) {
                const minDate = new Date(this.huddle.startDate);
                minDate.setDate(1);  // Set to first day of the month
                
                const maxDate = new Date(this.huddle.endDate);
                // Set to last day of the month so we can still navigate to the end month
                maxDate.setMonth(maxDate.getMonth() + 1);
                maxDate.setDate(0);
                
                if (offset < 0 && newDate < minDate) {
                    return;
                }
                if (offset > 0 && newDate > maxDate) {
                    return;
                }
            } else if (this.huddle.startDate) {
                // Only start date set — don't go before it
                const minDate = new Date(this.huddle.startDate);
                minDate.setDate(1);
                if (offset < 0 && newDate < minDate) {
                    return;
                }
            } else if (this.huddle.endDate) {
                // Only end date set — don't go after it
                const maxDate = new Date(this.huddle.endDate);
                maxDate.setMonth(maxDate.getMonth() + 1);
                maxDate.setDate(0);
                if (offset > 0 && newDate > maxDate) {
                    return;
                }
            }
            
            this.currentMonthView = newDate;
        },
        // Remove participant from huddle (owners only)
        removeParticipant(participantId) {
            if (this.currentUser && this.huddle.owner === this.currentUser) {
                if (confirm('Are you sure you want to remove this participant?')) {
                    // Remove from huddle.participants array
                    if (!this.huddle.participants) {
                        this.huddle.participants = [this.huddle.owner];
                    }
                    this.huddle.participants = this.huddle.participants.filter(id => id !== participantId);
                    
                    // Update participants display list
                    this.participants = this.huddle.participants.map(id => ({
                        name: id,
                        id: id
                    }));
                    
                    // Add kick system message to chat
                    this.messages.push({
                        user: 'System',
                        text: `${participantId} was removed from the huddle by ${this.currentUser}.`,
                        time: new Date().toLocaleTimeString(),
                        system: true
                    });
                    
                    // Persist to localStorage
                    this.saveHuddleData();
                    window.toast.success(`${participantId} has been removed from the huddle.`);
                }
            } else {
                window.toast.error('Only the owner can remove participants.');
            }
        },
        // Select dates for huddle from schedule (owners only)
        selectHuddleDate(dateKey) {
            if (!this.huddle.selectedDates) {
                this.huddle.selectedDates = [];
            }
            
            const index = this.huddle.selectedDates.indexOf(dateKey);
            if (index !== -1) {
                this.huddle.selectedDates.splice(index, 1);
                // Add date removed system message
                this.messages.push({
                    user: 'System',
                    text: `${this.currentUser} removed ${this.formatDate(dateKey)} from the planned dates.`,
                    time: new Date().toLocaleTimeString(),
                    system: true
                });
            } else {
                this.huddle.selectedDates.push(dateKey);
                // Add date picked system message
                this.messages.push({
                    user: 'System',
                    text: `${this.currentUser} selected ${this.formatDate(dateKey)} as a planned date.`,
                    time: new Date().toLocaleTimeString(),
                    system: true
                });
            }
            
            this.saveHuddleData();
        },
        // Build huddle schedule overlay from all participants' schedules
        buildHuddleScheduleOverlay() {
            const participantIds = this.huddle.participants || [this.huddle.owner];
            const overlay = {};
            
            participantIds.forEach(pid => {
                const scheduleKey = `schedule_${pid}`;
                const scheduleData = localStorage.getItem(scheduleKey);
                if (scheduleData) {
                    try {
                        const schedules = JSON.parse(scheduleData);
                        Object.keys(schedules).forEach(dateKey => {
                            if (!overlay[dateKey]) {
                                overlay[dateKey] = { free: 0, busy: 0, undetermined: 0, details: [] };
                            }
                            overlay[dateKey].details.push({ participant: pid, ...schedules[dateKey] });
                            if (schedules[dateKey].mode === 'free') {
                                overlay[dateKey].free++;
                            } else if (schedules[dateKey].mode === 'busy') {
                                overlay[dateKey].busy++;
                            } else {
                                overlay[dateKey].undetermined++;
                            }
                        });
                    } catch (e) {
                        console.warn('Failed to parse schedule for', pid);
                    }
                } else {
                    // Participant has no schedule data
                }
            });
            
            return overlay;
        },
        // Get overlay status for a date: 'green', 'yellow', or 'red'
        getOverlayStatus(dateKey) {
            const overlay = this.buildHuddleScheduleOverlay();
            const data = overlay[dateKey];
            if (!data) return null;
            
            const total = data.free + data.busy;
            if (total === 0) return null;
            
            // Green: everyone is free (no busy)
            if (data.busy === 0) return 'green';
            // Red: more than half are busy
            if (data.busy > total / 2) return 'red';
            // Yellow: less than half are busy
            return 'yellow';
        },
        // Show overlay modal for a clicked date
        showScheduleOverlay(day) {
            if (!day || !day.dateKey) return;
            
            const overlay = this.buildHuddleScheduleOverlay();
            this.overlayDate = day.dateKey;
            this.overlayData = overlay[day.dateKey] ? overlay[day.dateKey].details : [];
            this.showOverlayModal = true;
        },
        closeOverlayModal() {
            this.showOverlayModal = false;
        },
        // Handle day click on schedule calendar - only show overlay, don't select date
        handleDayClick(day) {
            if (!day || day.type !== 'actual') return;
            
            // Show overlay with participant schedule details
            this.showScheduleOverlay(day);
        },
        // Owner selects a date as planned date via button
        selectDateAsPlanned(dateKey) {
            if (!this.currentUser || this.huddle.owner !== this.currentUser) {
                window.toast.error('Only the owner can select planned dates.');
                return;
            }
            
            this.selectHuddleDate(dateKey);
            const index = this.huddle.selectedDates.indexOf(dateKey);
            if (index !== -1) {
                window.toast.info(`${this.formatDate(dateKey)} removed from planned dates.`);
            } else {
                window.toast.success(`${this.formatDate(dateKey)} added to planned dates.`);
            }
        }
    }
}).mount('#app');
