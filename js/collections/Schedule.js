/**
 * Keyed collection of schedule entries for a single user.
 * Entries are indexed by date key ("YYYY-M-D") and wrap ScheduleEntry instances.
 */
import { ScheduleEntry } from '../models/ScheduleEntry.js';
import { getDateKey } from '../core/utils.js';

export class Schedule {
    /**
     * @param {Object<string, ScheduleEntry|object>} [entries] - Initial entries keyed by date key.
     */
    constructor(entries = {}) {
        /** @type {Object<string, ScheduleEntry>} */
        this._entries = {};
        for (const [key, value] of Object.entries(entries)) {
            this._entries[key] = this._toEntry(value);
        }
    }

    /**
     * Ensure a value is a ScheduleEntry instance.
     * @param {ScheduleEntry|object} value
     * @returns {ScheduleEntry}
     * @private
     */
    _toEntry(value) {
        return value instanceof ScheduleEntry ? value : new ScheduleEntry(value);
    }

    /**
     * Get the entry for a date key.
     * @param {string} key - Date key ("YYYY-M-D").
     * @returns {ScheduleEntry|undefined}
     */
    get(key) {
        return this._entries[key];
    }

    /**
     * Set or update an entry for a date key.
     * @param {string} key - Date key ("YYYY-M-D").
     * @param {ScheduleEntry|object} entry - Entry data or instance.
     */
    set(key, entry) {
        this._entries[key] = this._toEntry(entry);
    }

    /**
     * Remove an entry for a date key.
     * @param {string} key - Date key ("YYYY-M-D").
     * @returns {boolean} True if the entry existed and was removed.
     */
    remove(key) {
        if (key in this._entries) {
            delete this._entries[key];
            return true;
        }
        return false;
    }

    /**
     * Clear all entries.
     */
    clear() {
        this._entries = {};
    }

    /**
     * @returns {string[]} All date keys with entries.
     */
    get keys() {
        return Object.keys(this._entries);
    }

    /**
     * @returns {ScheduleEntry[]} All schedule entries.
     */
    get values() {
        return Object.values(this._entries);
    }

    /**
     * @returns {number} Number of entries.
     */
    get size() {
        return Object.keys(this._entries).length;
    }

    /**
     * @returns {Object<string, ScheduleEntry>} A shallow copy of the entries map.
     */
    toPlain() {
        const result = {};
        for (const [key, entry] of Object.entries(this._entries)) {
            result[key] = { mode: entry.mode, startTime: entry.startTime, endTime: entry.endTime };
        }
        return result;
    }

    /**
     * Parse a CSV string and return a Schedule for future dates only.
     * Expected CSV format: "YYYY-MM-DD,mode,startTime,endTime" (one entry per line).
     * @param {string} text - Raw CSV text.
     * @param {Date} [today] - Reference date; entries before today are ignored.
     * @returns {Schedule}
     */
    static fromCSV(text, today = new Date()) {
        const entries = {};
        const lines = text.trim().split('\n');
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

        for (const line of lines) {
            if (!line.trim()) continue;
            const [dateStr, mode, startTime, endTime] = line.split(',');
            const [year, month, day] = dateStr.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day);
            if (dateObj.getTime() >= todayStart) {
                // Normalise the key to the app's date-key format
                const key = getDateKey(dateObj);
                entries[key] = {
                    mode: mode ? mode.trim() : 'free',
                    startTime: startTime ? startTime.trim() : '',
                    endTime: endTime ? endTime.trim() : ''
                };
            }
        }
        return new Schedule(entries);
    }
}
