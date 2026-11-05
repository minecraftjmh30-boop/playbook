<template>
    <div class="d-flex flex-column min-vh-100">
        <AppHeader></AppHeader>
        <main class="container my-4 flex-grow-1">
            <div class="row">
                <div class="col-md-4">
                    <div class="card mb-4">
                        <div class="card-header">Huddle Schedule</div>
                        <div class="card-body">
                            <ScheduleCalendar :month-info="calendar.info" :displayed-days="calendar.days" :is-current-month="calendar.isCurrentMonth" :interactive="false" :overlay-status="getOverlayStatus" :selected-dates="huddle.selectedDates || []" @change-month="changeMonth" @day-click="handleDayClick"></ScheduleCalendar>
                        </div>
                    </div>
                    <div v-if="huddle.selectedDates && huddle.selectedDates.length > 0" class="card mb-4">
                        <div class="card-header">Planned Dates</div>
                        <ul class="list-group list-group-flush"><li v-for="date in huddle.selectedDates" :key="date" class="list-group-item">{{ formatDate(date) }}</li></ul>
                    </div>
                    <div v-if="currentUser && huddle.owner === currentUser" class="mb-3"><button class="btn btn-outline-primary w-100" @click="openInviteModal">Invite Friends</button></div>
                    <div v-if="currentUser && huddle.owner !== currentUser" class="mb-3"><button class="btn btn-outline-danger w-100" @click="leaveHuddle">Leave Huddle</button></div>
                    <HuddleParticipants :participants="allParticipants" :owner-id="huddle.owner" :current-user="currentUser" :pending-ids="pendingInviteIds" @remove-participant="removeParticipant"></HuddleParticipants>
                </div>
                <div class="col-md-8">
                    <HuddleDetails :huddle="huddle" :current-user="currentUser" @save="saveHuddleData"></HuddleDetails>
                    <HuddleChat :messages="huddle.messages.items" :current-user="currentUser" :owner-id="huddle.owner" @send-message="sendMessage" @delete-message="deleteMessage"></HuddleChat>
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
                            <span v-if="huddle.participants && huddle.participants.includes(friend.id)" class="badge bg-success">Participant</span>
                            <span v-else-if="huddle.pendingInvites && huddle.pendingInvites.includes(friend.id)" class="badge bg-info">Pending</span>
                            <button v-else class="btn btn-sm btn-primary" @click="inviteFriend(friend.id)">Invite</button>
                        </li>
                    </ul>
                </div>
                <div class="modal-footer"><button type="button" class="btn btn-secondary" @click="closeInviteModal">Close</button></div>
            </div></div>
        </div>
        <div v-if="showConfirmModal" class="modal fade show d-block modal-overlay" tabindex="-1">
            <div class="modal-dialog"><div class="modal-content">
                <div class="modal-header"><h5 class="modal-title">{{ confirmTitle }}</h5><button type="button" class="btn-close" @click="closeConfirmModal"></button></div>
                <div class="modal-body"><p>{{ confirmMessage }}</p></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeConfirmModal">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="executeConfirmAction">Confirm</button>
                </div>
            </div></div>
        </div>
        <AppFooter></AppFooter>
        <ToastComponent ref="toast" />
    </div>
</template>

<script>
import { getCookie, buildParticipantsDisplay, formatDate } from '../../core/utils.js';
import { provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ToastKey } from '../../core/keys.js';
import { store } from '../../core/store.js';
import { Huddle } from '../../models/Huddle.js';
import { User } from '../../models/User.js';
import { Invitation } from '../../models/Invitation.js';
import { CalendarMonth } from '../../models/CalendarMonth.js';
import { DateRange } from '../../models/DateRange.js';
import { ScheduleOverlay } from '../../models/ScheduleOverlay.js';
import { Schedule } from '../../collections/Schedule.js';
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
        return { toast, route, router, formatDate };
    },
    data() {
        const idParam = this.route.query.id || this.route.query.code;

        // Look up by id first, then by code
        const idParamNumber = idParam ? Number(idParam) : null;
        let huddleData = store.huddles.findById(idParamNumber)
            || store.huddles.findByCode(idParam)
            || new Huddle({
                name: 'Huddle Not Found',
                description: 'The requested huddle could not be found.',
                location: 'Unknown',
                code: idParam || '',
                status: 'Offline'
            });

        const currentUser = getCookie('currentUser');

        // If accessing via code, use the collection join method
        if (idParam && huddleData.code === idParam && currentUser && huddleData.name !== 'Huddle Not Found') {
            const result = store.huddles.joinByCode(idParam, currentUser);
            if (result.huddle) {
                huddleData = result.huddle;
            }
        }

        // Build participants list from huddle data
        const participants = buildParticipantsDisplay(huddleData.participants);

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
            currentUser,
            pendingInviteIds: huddleData.pendingInvites || [],

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
            inviteSearch: '',

            // Confirmation modal
            showConfirmModal: false,
            confirmTitle: '',
            confirmMessage: '',
            confirmCallback: null
        };
    },
    computed: {
        // Combine regular participants with pending invitees for display
        allParticipants() {
            return buildParticipantsDisplay(this.huddle.allParticipantIds);
        },
        calendar() {
            const range = new DateRange(this.huddle.startDate, this.huddle.endDate);
            return new CalendarMonth(this.currentMonthView, { range, schedule: this.schedules, today: this.today });
        },
        /**
         * Build the schedule overlay once and reuse it for all calendar cells.
         * Replaces the per-cell buildHuddleScheduleOverlay() call.
         */
        overlay() {
            // Gather schedules for all participants from the store
            const schedulesByUser = {};
            const participantIds = this.huddle.allParticipantIds;
            participantIds.forEach(pid => {
                const scheduleKey = `schedule_${pid}`;
                const raw = store.schedules[scheduleKey];
                if (raw) {
                    // Wrap plain objects in Schedule; keep Schedule instances as-is
                    schedulesByUser[pid] = raw instanceof Schedule ? raw : new Schedule(raw);
                }
            });
            return new ScheduleOverlay(schedulesByUser);
        },
        filteredInviteFriends() {
            if (!this.inviteSearch) return this.friends;
            const search = this.inviteSearch.toLowerCase();
            return this.friends.filter(friend => friend.name.toLowerCase().includes(search));
        }
    },
    methods: {
        sendMessage(text) {
            if (text && text.trim()) {
                this.huddle.messages.addChat(this.currentUser || 'Anonymous', text.trim());
                this.saveHuddleData();
            }
        },
        saveHuddleData() {
            // The huddle is the same instance in store.huddles, so no copy needed
// localStorage disabled - store.huddles is reactive
        },
        deleteMessage(index) {
            this.huddle.messages.removeAt(index);
            this.saveHuddleData();
        },

        // Schedule methods
        changeMonth(offset) {
            const newCalendar = this.calendar.shift(offset);
            this.currentMonthView = newCalendar.viewDate;
        },
        // Leave huddle (non-owners only)
        leaveHuddle() {
            if (this.currentUser && !this.huddle.isOwner(this.currentUser)) {
                this.confirmTitle = 'Leave Huddle';
                this.confirmMessage = 'Are you sure you want to leave this huddle?';
                this.confirmCallback = () => {
                    this.huddle.removeParticipant(this.currentUser);
                    this.saveHuddleData();
                    this.toast.info('You have left the huddle.');
                    setTimeout(() => {
                        this.router.push('/');
                    }, 1000);
                };
                this.showConfirmModal = true;
            }
        },
        // Remove participant from huddle (owners only)
        removeParticipant(participantId) {
            if (!this.huddle.isOwner(this.currentUser)) {
                this.toast.error('Only the owner can remove participants.');
                return;
            }
            this.confirmTitle = 'Remove Participant';
            this.confirmMessage = 'Are you sure you want to remove this participant?';
            this.confirmCallback = () => {
                this.huddle.removeParticipant(participantId, this.currentUser);
                this.saveHuddleData();
                this.toast.success(`${participantId} has been removed from the huddle.`);
            };
            this.showConfirmModal = true;
        },
        // Select dates for huddle from schedule (owners only)
        selectHuddleDate(dateKey) {
            this.huddle.togglePlannedDate(dateKey, this.currentUser);
            this.saveHuddleData();
        },
        // Get overlay status for a date using the computed overlay (built once)
        getOverlayStatus(dateKey) {
            return this.overlay.statusFor(dateKey);
        },
        // Show overlay modal for a clicked date
        showScheduleOverlay(day) {
            if (!day || !day.dateKey) return;

            this.overlayDate = day.dateKey;
            this.overlayData = this.overlay.detailsFor(day.dateKey);
            this.showOverlayModal = true;
        },
        closeOverlayModal() {
            this.showOverlayModal = false;
        },
        // Load friends for current user using the User model
        async loadFriends() {
            try {
                const user = await User.load(this.currentUser);
                this.friends = user.searchFriends('');
            } catch (e) {
                console.warn('Failed to load friends:', e);
                this.friends = [];
            }
        },
        // Open invite friends modal
        async openInviteModal() {
            await this.loadFriends();
            this.showInviteModal = true;
        },
        closeInviteModal() {
            this.showInviteModal = false;
            this.inviteSearch = '';
        },
        closeConfirmModal() {
            this.showConfirmModal = false;
            this.confirmCallback = null;
        },
        executeConfirmAction() {
            if (this.confirmCallback) {
                this.confirmCallback();
            }
            this.closeConfirmModal();
        },
        // Invite a friend to the huddle — creates a pending invitation
        inviteFriend(friendId) {
            const result = this.huddle.invite(friendId, this.currentUser);
            if (result === 'participant') {
                this.toast.info(`${friendId} is already a participant.`);
                return;
            }
            if (result === 'pending') {
                this.toast.info(`${friendId} already has a pending invitation.`);
                return;
            }
            // Create pending invitation record using the Invitation model
            const invitation = new Invitation({
                id: `inv_${Date.now()}_${friendId}`,
                huddleId: this.huddle.id,
                huddleName: this.huddle.name,
                invitedBy: this.currentUser,
                to: friendId
            });
            store.invitations.add(invitation);
// localStorage disabled - store.invitations is reactive
            this.saveHuddleData();
            this.toast.success(`Invitation sent to ${friendId}!`);
        },
        // Handle day click on schedule calendar - only show overlay, don't select date
        handleDayClick(day) {
            if (!day || day.type !== 'actual') return;
            
            // Show overlay with participant schedule details
            this.showScheduleOverlay(day);
        },
        // Owner selects a date as planned date via button
        selectDateAsPlanned(dateKey) {
            if (!this.currentUser || !this.huddle.isOwner(this.currentUser)) {
                this.toast.error('Only the owner can select planned dates.');
                return;
            }
            const isNowPlanned = this.huddle.togglePlannedDate(dateKey, this.currentUser);
            this.saveHuddleData();
            if (isNowPlanned) {
                this.toast.success(`${formatDate(dateKey)} added to planned dates.`);
            } else {
                this.toast.info(`${formatDate(dateKey)} removed from planned dates.`);
            }
        }
    }
};
</script>

