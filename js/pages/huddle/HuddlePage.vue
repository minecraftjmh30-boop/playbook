<template>
    <div class="d-flex flex-column min-vh-100">
        <AppHeader></AppHeader>
        <main class="container my-4 flex-grow-1">
            <div class="row">
                <div class="col-md-4">
                    <div class="card mb-4">
                        <div class="card-header">Huddle Schedule</div>
                        <div class="card-body">
                            <ScheduleCalendar :month-info="monthInfo" :displayed-days="displayedDays" :is-current-month="isCurrentMonth" :interactive="false" :overlay-status="getOverlayStatus" :selected-dates="huddle.selectedDates || []" @change-month="changeMonth" @day-click="handleDayClick"></ScheduleCalendar>
                        </div>
                    </div>
                    <div v-if="huddle.selectedDates && huddle.selectedDates.length > 0" class="card mb-4">
                        <div class="card-header">Planned Dates</div>
                        <ul class="list-group list-group-flush"><li v-for="date in huddle.selectedDates" :key="date" class="list-group-item">{{ formatDate(date) }}</li></ul>
                    </div>
                    <div v-if="currentUser && huddle.owner === currentUser" class="mb-3"><button class="btn btn-outline-primary w-100" @click="openInviteModal">Invite Friends</button></div>
                    <div v-if="currentUser && huddle.owner !== currentUser" class="mb-3"><button class="btn btn-outline-danger w-100" @click="leaveHuddle">Leave Huddle</button></div>
                    <HuddleParticipants :participants="participants" :owner-id="huddle.owner" :current-user="currentUser" @remove-participant="removeParticipant"></HuddleParticipants>
                </div>
                <div class="col-md-8">
                    <HuddleDetails :huddle="huddle" :current-user="currentUser" @save="saveHuddleData"></HuddleDetails>
                    <HuddleChat :messages="messages" :current-user="currentUser" :owner-id="huddle.owner" @send-message="sendMessage" @delete-message="deleteMessage"></HuddleChat>
                </div>
            </div>
        </main>
        <div v-if="showOverlayModal" class="modal fade show d-block modal-overlay" tabindex="-1">
            <div class="modal-dialog"><div class="modal-content">
                <div class="modal-header"><h5 class="modal-title">Schedule for {{ formatDate(overlayDate) }}</h5><button type="button" class="btn-close" @click="closeOverlayModal"></button></div>
                <div class="modal-body">
                    <div v-if="overlayData.length === 0" class="text-muted text-center">No schedule data available for this date.</div>
                    <div v-else>
                        <div v-for="(detail, index) in overlayData" :key="index" class="mb-2 p-2 border rounded">
                            <strong>{{ detail.participant }}</strong>
                            <span :class="['badge', detail.mode === 'free' ? 'bg-success' : detail.mode === 'busy' ? 'bg-danger' : 'bg-secondary']">{{ detail.mode || 'undetermined' }}</span>
                            <span v-if="detail.startTime" class="ms-2">{{ detail.startTime }} - {{ detail.endTime }}</span>
                            <span v-else class="ms-2 text-muted">All Day</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeOverlayModal">Close</button>
                    <button v-if="currentUser && huddle.owner === currentUser" type="button" class="btn btn-primary" @click="selectDateAsPlanned(overlayDate); closeOverlayModal()">{{ huddle.selectedDates && huddle.selectedDates.includes(overlayDate) ? 'Remove from Planned Dates' : 'Add to Planned Dates' }}</button>
                </div>
            </div></div>
        </div>
        <div v-if="showInviteModal" class="modal fade show d-block modal-overlay" tabindex="-1">
            <div class="modal-dialog"><div class="modal-content">
                <div class="modal-header"><h5 class="modal-title">Invite Friends</h5><button type="button" class="btn-close" @click="closeInviteModal"></button></div>
                <div class="modal-body">
                    <input type="text" class="form-control form-control-sm mb-3" placeholder="Search friends..." :value="inviteSearch" @input="inviteSearch = $event.target.value">
                    <div v-if="friends.length === 0" class="text-muted text-center">No friends found. Add friends from your profile first.</div>
                    <ul class="list-group">
                        <li v-for="friend in filteredInviteFriends" :key="friend.id" class="list-group-item d-flex justify-content-between align-items-center">
                            <span>{{ friend.name }}</span>
                            <button class="btn btn-sm btn-primary" @click="inviteFriend(friend.id)" :disabled="huddle.participants && huddle.participants.includes(friend.id)">{{ huddle.participants && huddle.participants.includes(friend.id) ? 'Invited' : 'Invite' }}</button>
                        </li>
                    </ul>
                </div>
                <div class="modal-footer"><button type="button" class="btn btn-secondary" @click="closeInviteModal">Close</button></div>
            </div></div>
        </div>
        <AppFooter></AppFooter>
        <ToastComponent ref="toast" />
    </div>
</template>

<script>
import { getCookie, buildParticipantsDisplay, getDateKey, isSameDay, formatDate, createSystemMessage } from '../../core/utils.js';
import { provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const ToastKey = Symbol('toast');
import AppHeader from '../../components/main/AppHeader.vue';
import AppFooter from '../../components/main/AppFooter.vue';
import ScheduleCalendar from '../../components/schedule/ScheduleCalendar.vue';
import HuddleParticipants from '../../components/huddle/HuddleParticipants.vue';
import HuddleDetails from '../../components/huddle/HuddleDetails.vue';
import HuddleChat from '../../components/huddle/HuddleChat.vue';
import ToastComponent from '../../components/ui/Toast.vue';

export default {
    name: 'HuddlePage',
    components: { AppHeader, AppFooter, ScheduleCalendar, HuddleParticipants, HuddleDetails, HuddleChat, ToastComponent },
    setup() {
        const toast = ref(null);
        const route = useRoute();
        const router = useRouter();
        provide(ToastKey, toast);
        return { toast, route, router };
    },
    data() {
        const idParam = this.route.query.id || this.route.query.code;
        
        const huddles = JSON.parse(localStorage.getItem('huddles')) || [];
        const idParamNumber = idParam ? Number(idParam) : null;
        const huddleData = huddles.find(h => h.id === idParamNumber || h.code === idParam) || {
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

        const currentUser = getCookie('currentUser');

        // If accessing via code and user is not already a participant, add them
        let updatedHuddleData = huddleData;
        if (idParam && huddleData.code === idParam && currentUser && huddleData.name !== 'Huddle Not Found') {
            if (!huddleData.participants) {
                huddleData.participants = [huddleData.owner];
            }
            if (!huddleData.participants.includes(currentUser)) {
                huddleData.participants.push(currentUser);
                // Save the updated participants to localStorage
                const huddles = JSON.parse(localStorage.getItem('huddles')) || [];
                const index = huddles.find(h => h.id === huddleData.id);
                if (index) {
                    index.participants = huddleData.participants;
                    localStorage.setItem('huddles', JSON.stringify(huddles));
                }
                updatedHuddleData = huddleData;
            }
        }

        // Check if user is authorized to access this huddle
        const participantIds = updatedHuddleData.participants || [updatedHuddleData.owner];
        const isOwner = currentUser && updatedHuddleData.owner === currentUser;
        const isParticipant = currentUser && participantIds.includes(currentUser);
        const isAuthorized = isOwner || isParticipant || updatedHuddleData.name === 'Huddle Not Found';

        if (!isAuthorized && updatedHuddleData.name !== 'Huddle Not Found') {
            // Redirect unauthorized users to index page
            // Note: toast cannot be used in data() — handled in mounted()
        }

        // Build participants list from huddle data
        const participants = buildParticipantsDisplay(updatedHuddleData.participants || [updatedHuddleData.owner]);

        // Load messages from huddle data, default to empty array
        const messages = updatedHuddleData.messages || [];

        // Initialize currentMonthView to the huddle's start month if available, otherwise current month
        let initialMonthView = new Date();
        if (updatedHuddleData.startDate) {
            const startDate = new Date(updatedHuddleData.startDate);
            initialMonthView = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        }

        return {
            // Huddle data
            huddle: updatedHuddleData,
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
            overlayData: [],

            // Invite friends modal
            showInviteModal: false,
            friends: [],
            inviteSearch: ''
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
            for (let day = 1; day <= lastDay; day++) {
                const dateObj = new Date(year, monthIndex, day);
                const dateKey = getDateKey(dateObj);
                const isToday = isSameDay(dateObj, this.today);
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
                        day: day,
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
        },
        filteredInviteFriends() {
            if (!this.inviteSearch) return this.friends;
            const search = this.inviteSearch.toLowerCase();
            return this.friends.filter(friend => friend.name.toLowerCase().includes(search));
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
        // Leave huddle (non-owners only)
        leaveHuddle() {
            if (this.currentUser && this.huddle.owner !== this.currentUser) {
                if (confirm('Are you sure you want to leave this huddle?')) {
                    // Remove self from participants
                    if (this.huddle.participants) {
                        this.huddle.participants = this.huddle.participants.filter(id => id !== this.currentUser);
                    }
                    // Update participant display list
                    this.participants = buildParticipantsDisplay(this.huddle.participants);
                    // Add leave system message
                    this.messages.push(createSystemMessage(`${this.currentUser} has left the huddle.`));
                    // Persist to localStorage
                    this.saveHuddleData();
                    this.toast.info('You have left the huddle.');
                    setTimeout(() => {
                        this.router.push('/');
                    }, 1000);
                }
            }
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
                    
                    // Update participant display list
                    this.participants = buildParticipantsDisplay(this.huddle.participants);
                    
                    // Add kick system message to chat
                    this.messages.push(createSystemMessage(`${participantId} was removed from the huddle by ${this.currentUser}.`));
                    
                    // Persist to localStorage
                    this.saveHuddleData();
                    this.toast.success(`${participantId} has been removed from the huddle.`);
                }
            } else {
                this.toast.error('Only the owner can remove participants.');
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
                this.messages.push(createSystemMessage(`${this.currentUser} removed ${formatDate(dateKey)} from the planned dates.`));
            } else {
                this.huddle.selectedDates.push(dateKey);
                // Add date picked system message
                this.messages.push(createSystemMessage(`${this.currentUser} selected ${formatDate(dateKey)} as a planned date.`));
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
        // Load friends for current user
        loadFriends() {
            try {
                const userInfo = localStorage.getItem(`userInfo_${this.currentUser}`);
                if (userInfo) {
                    const data = JSON.parse(userInfo);
                    this.friends = (data.friends || []).map(fId => ({ id: fId, name: fId }));
                }
            } catch (e) {
                console.warn('Failed to load friends:', e);
            }
        },
        // Open invite friends modal
        openInviteModal() {
            this.loadFriends();
            this.showInviteModal = true;
        },
        closeInviteModal() {
            this.showInviteModal = false;
            this.inviteSearch = '';
        },
        // Invite a friend to the huddle
        inviteFriend(friendId) {
            if (!this.huddle.participants) {
                this.huddle.participants = [this.huddle.owner];
            }
            if (this.huddle.participants.includes(friendId)) {
                this.toast.info(`${friendId} is already a participant.`);
                return;
            }
            this.huddle.participants.push(friendId);
            // Update participant display list
            this.participants = buildParticipantsDisplay(this.huddle.participants);
            // Add invite system message
            this.messages.push(createSystemMessage(`${this.currentUser} invited ${friendId} to the huddle.`));
            this.saveHuddleData();
            this.toast.success(`${friendId} has been invited to the huddle!`);
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
                this.toast.error('Only the owner can select planned dates.');
                return;
            }
            
            this.selectHuddleDate(dateKey);
            const index = this.huddle.selectedDates.indexOf(dateKey);
            if (index !== -1) {
                this.toast.info(`${formatDate(dateKey)} removed from planned dates.`);
            } else {
                this.toast.success(`${formatDate(dateKey)} added to planned dates.`);
            }
        }
    }
};
</script>

<style scoped>
.modal-overlay {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
