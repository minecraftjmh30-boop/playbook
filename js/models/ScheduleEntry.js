/**
 * A single schedule entry for one day.
 * Represents a user's availability status (free or busy) with optional time bounds.
 */
export class ScheduleEntry {
    /**
     * @param {object} [data]
     * @param {'free'|'busy'} [data.mode] - Availability mode.
     * @param {string} [data.startTime] - Start time in "HH:MM" format, empty string for all-day.
     * @param {string} [data.endTime] - End time in "HH:MM" format, empty string for all-day.
     */
    constructor({ mode = 'free', startTime = '', endTime = '' } = {}) {
        this.mode = mode;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    /**
     * @returns {boolean} True if the entry spans the entire day (no time bounds).
     */
    get isAllDay() {
        return !this.startTime || !this.endTime;
    }

    /**
     * @returns {string} Bootstrap badge class for the entry's mode.
     */
    get badgeClass() {
        if (this.mode === 'free') return 'bg-success';
        if (this.mode === 'busy') return 'bg-danger';
        return 'bg-secondary';
    }
}
