/**
 * An optional start/end window. Either end may be null (unbounded).
 */
export class DateRange {
    /**
     * @param {string|Date|null} start
     * @param {string|Date|null} end
     */
    constructor(start = null, end = null) {
        this.start = start ? new Date(start) : null;
        this.end = end ? new Date(end) : null;
    }

    /**
     * Check if a date falls within this range.
     * @param {Date} date
     * @returns {boolean}
     */
    contains(date) {
        return (!this.start || date >= this.start) && (!this.end || date <= this.end);
    }

    /**
     * Check if any day of a month falls within this range.
     * @param {Date} monthStart - First day of a month.
     * @returns {boolean} True if any day of that month is in range.
     */
    overlapsMonth(monthStart) {
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
        return (!this.start || monthEnd >= this.start) && (!this.end || monthStart <= this.end);
    }
}
