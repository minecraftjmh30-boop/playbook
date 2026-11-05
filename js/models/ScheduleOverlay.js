/**
 * Combines the schedules of several participants to show group availability.
 * Built once and reused across all calendar cells, replacing the per-cell rebuild.
 */
export class ScheduleOverlay {
    /**
     * @param {Object<string, import('./Schedule.js').Schedule>} schedulesByUser -
     *   Schedules keyed by user ID. Each value is a Schedule instance.
     */
    constructor(schedulesByUser) {
        /** @type {Object<string, Array<{participant: string, mode: string, startTime: string, endTime: string}>>} */
        this._details = {};

        /** @type {Object<string, {free: number, busy: number, undetermined: number}>} */
        this._counts = {};

        this._build(schedulesByUser);
    }

    /**
     * Build the combined overlay from all participant schedules.
     * @param {Object<string, import('./Schedule.js').Schedule>} schedulesByUser
     * @private
     */
    _build(schedulesByUser) {
        for (const [userId, schedule] of Object.entries(schedulesByUser)) {
            if (!schedule) continue;

            for (const [dateKey, entry] of Object.entries(schedule.toPlain())) {
                if (!this._details[dateKey]) {
                    this._details[dateKey] = [];
                    this._counts[dateKey] = { free: 0, busy: 0, undetermined: 0 };
                }

                this._details[dateKey].push({
                    participant: userId,
                    mode: entry.mode,
                    startTime: entry.startTime,
                    endTime: entry.endTime
                });

                if (entry.mode === 'free') {
                    this._counts[dateKey].free++;
                } else if (entry.mode === 'busy') {
                    this._counts[dateKey].busy++;
                } else {
                    this._counts[dateKey].undetermined++;
                }
            }
        }
    }

    /**
     * Get all participant schedule details for a given date.
     * @param {string} dateKey - Date key ("YYYY-M-D").
     * @returns {Array<{participant: string, mode: string, startTime: string, endTime: string}>}
     */
    detailsFor(dateKey) {
        return this._details[dateKey] || [];
    }

    /**
     * Get the group availability status for a date.
     * @param {string} dateKey - Date key ("YYYY-M-D").
     * @returns {'green'|'yellow'|'red'|null}
     *   - 'green': all participants are free (no busy)
     *   - 'yellow': some participants are busy (less than half)
     *   - 'red': majority are busy (more than half)
     *   - null: no schedule data for this date
     */
    statusFor(dateKey) {
        const counts = this._counts[dateKey];
        if (!counts) return null;

        const total = counts.free + counts.busy;
        if (total === 0) return null;

        // Green: everyone is free (no busy)
        if (counts.busy === 0) return 'green';
        // Red: more than half are busy
        if (counts.busy > total / 2) return 'red';
        // Yellow: less than half are busy
        return 'yellow';
    }
}
