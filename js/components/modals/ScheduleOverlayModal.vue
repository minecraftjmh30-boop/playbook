<template>
    <BaseModal :show="show" :title="title" @close="close">
        <div v-if="details.length === 0" class="text-muted text-center">
            No schedule data available for this date.
        </div>
        <div v-else>
            <div v-for="(detail, index) in details" :key="index" class="mb-2 p-2 border rounded">
                <strong>{{ detail.participant }}</strong>
                <span :class="['badge', modeBadgeClass(detail.mode)]">{{ detail.mode || 'undetermined' }}</span>
                <span v-if="detail.startTime" class="ms-2">{{ detail.startTime }} - {{ detail.endTime }}</span>
                <span v-else class="ms-2 text-muted">All Day</span>
            </div>
        </div>
        <template #footer>
            <button type="button" class="btn btn-secondary" @click="close">Close</button>
            <button v-if="canSelectDate" type="button" class="btn btn-primary" @click="togglePlanned">
                {{ isPlanned ? 'Remove from Planned Dates' : 'Add to Planned Dates' }}
            </button>
        </template>
    </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue';

/**
 * Displays participant schedule details for a specific date.
 *
 * Controlled programmatically via a ref: call `open(options)` to display the dialog.
 *
 * Usage in a parent component:
 *   <ScheduleOverlayModal ref="overlay" />
 *   this.$refs.overlay.open({ dateKey, details, selectedDates, canSelectDate, onTogglePlanned });
 */
export default {
    name: 'ScheduleOverlayModal',
    components: { BaseModal },
    data() {
        return {
            show: false,
            /** Formatted date string for the modal title. */
            title: '',
            /** Array of detail objects: { participant, mode, startTime, endTime }. */
            details: [],
            /** Array of selected date keys to check against. */
            selectedDates: [],
            /** Current date key being viewed. */
            currentDateKey: null,
            /** Whether the owner can toggle planned dates. */
            canSelectDate: false,
            /** Callback invoked when the owner toggles the date as planned. */
            onTogglePlanned: null
        };
    },
    computed: {
        /** Whether the current date is already in the planned dates list. */
        isPlanned() {
            return this.currentDateKey && this.selectedDates && this.selectedDates.includes(this.currentDateKey);
        }
    },
    emits: ['close'],
    methods: {
        /**
         * CSS badge class for a schedule mode.
         * @param {string} mode - 'free', 'busy', or 'off'.
         */
        modeBadgeClass(mode) {
            if (mode === 'free') return 'bg-success';
            if (mode === 'busy') return 'bg-danger';
            return 'bg-secondary';
        },
        /**
         * Display the schedule overlay dialog.
         * @param {object} options
         * @param {string} options.dateKey - The date key being viewed.
         * @param {string} [options.title] - Modal title (defaults to formatted date).
         * @param {Array} options.details - Array of participant detail objects.
         * @param {Array} [options.selectedDates] - Array of planned date keys.
         * @param {boolean} [options.canSelectDate] - Whether the user can toggle planned dates.
         * @param {Function} [options.onTogglePlanned] - Callback when date is toggled.
         */
        open({ dateKey, title, details, selectedDates = [], canSelectDate = false, onTogglePlanned = null } = {}) {
            this.currentDateKey = dateKey;
            this.title = title || dateKey;
            this.details = details;
            this.selectedDates = selectedDates;
            this.canSelectDate = canSelectDate;
            this.onTogglePlanned = onTogglePlanned;
            this.show = true;
        },
        close() {
            this.show = false;
            this.onTogglePlanned = null;
        },
        /** Toggle the current date as a planned date. */
        togglePlanned() {
            if (this.onTogglePlanned) {
                this.onTogglePlanned(this.currentDateKey);
            }
            this.close();
        }
    }
};
</script>
