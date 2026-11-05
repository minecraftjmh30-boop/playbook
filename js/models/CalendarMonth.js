/**
 * One month of calendar data. Composed with a DateRange (which months/days are allowed)
 * and an optional schedule map (what each day contains).
 */
import { DateRange } from './DateRange.js';
import { getDateKey, isSameDay } from '../core/utils.js';

export class CalendarMonth {
    /**
     * @param {Date} viewDate - Any date in the month to display.
     * @param {object} [options]
     * @param {DateRange} [options.range] - Allowed window (default: unbounded).
     * @param {Object<string, object>} [options.schedule] - Schedule entries keyed by dateKey.
     * @param {Date} [options.today] - Current date for highlighting.
     */
    constructor(viewDate, { range = new DateRange(), schedule = null, today = new Date() } = {}) {
        this.viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        this.range = range;
        this.schedule = schedule;
        this.today = today;
    }

    /**
     * @returns {number} Year of the month.
     */
    get year() {
        return this.viewDate.getFullYear();
    }

    /**
     * @returns {number} Zero-based month index.
     */
    get monthIndex() {
        return this.viewDate.getMonth();
    }

    /**
     * @returns {string} Human-readable month name.
     */
    get monthName() {
        return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(this.viewDate);
    }

    /**
     * @returns {{year: number, monthIndex: number, monthName: string, month: number, firstDayOfWeek: number, lastDay: number}}
     * Same shape ScheduleCalendar already expects.
     */
    get info() {
        const firstDayOfMonth = new Date(this.year, this.monthIndex, 1);
        const lastDayOfMonth = new Date(this.year, this.monthIndex + 1, 0);
        return {
            year: this.year,
            monthIndex: this.monthIndex,
            monthName: this.monthName,
            month: this.monthIndex + 1,
            firstDayOfWeek: firstDayOfMonth.getDay(),
            lastDay: lastDayOfMonth.getDate()
        };
    }

    /**
     * @returns {boolean} True if this is the current calendar month.
     */
    get isCurrentMonth() {
        return this.year === this.today.getFullYear() &&
               this.monthIndex === this.today.getMonth();
    }

    /**
     * Look up a schedule entry, supporting both plain objects and Schedule instances.
     * @param {string} dateKey
     * @returns {object|undefined}
     * @private
     */
    _getScheduleEntry(dateKey) {
        if (!this.schedule) return undefined;
        // Schedule collection instance with get() method
        if (typeof this.schedule.get === 'function') {
            return this.schedule.get(dateKey);
        }
        // Plain object (legacy / store format)
        return this.schedule[dateKey];
    }

    /**
     * @returns {Array<object>} Filler, actual and outside-frame day objects.
     */
    get days() {
        const { firstDayOfWeek, lastDay, year, monthIndex } = this.info;
        const days = [];

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

            // Check if the date is within the allowed range
            if (this.range.contains(dateObj)) {
                const entry = this._getScheduleEntry(dateKey);
                days.push({
                    type: 'actual',
                    day: day,
                    date: dateObj,
                    dateKey: dateKey,
                    isToday,
                    isPast,
                    ...(entry || { mode: null, startTime: '', endTime: '' })
                });
            } else {
                // Show a "disabled" placeholder for days outside the range
                days.push({
                    type: 'outside-frame',
                    date: dateObj,
                    disabled: true
                });
            }
        }

        return days;
    }

    /**
     * Shift to the previous or next month.
     * Returns the new month, or this one if the new month is out of range.
     * @param {number} offset - +1 or -1.
     * @returns {CalendarMonth}
     */
    shift(offset) {
        const next = new Date(this.year, this.monthIndex + offset, 1);
        if (this.range.overlapsMonth(next)) {
            return new CalendarMonth(next, {
                range: this.range,
                schedule: this.schedule,
                today: this.today
            });
        }
        return this;
    }
}
