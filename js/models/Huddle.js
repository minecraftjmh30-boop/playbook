/**
 * A group event that users join to coordinate a date.
 */
import { BaseModel } from './BaseModel.js';
import { formatDate } from '../core/utils.js';
import { MessageCollection } from '../collections/MessageCollection.js';

export class Huddle extends BaseModel {
    /**
     * @param {object} [data]
     * @param {number} [data.id]
     * @param {string} [data.name]
     * @param {string} [data.description]
     * @param {string} [data.location]
     * @param {string} [data.status]
     * @param {string} [data.code]
     * @param {string|null} [data.owner] - User ID of the creator.
     * @param {string[]} [data.participants]
     * @param {string[]} [data.pendingInvites]
     * @param {string[]} [data.selectedDates] - Date keys ("YYYY-M-D").
     * @param {Array} [data.messages]
     * @param {string|null} [data.startDate]
     * @param {string|null} [data.endDate]
     */
    constructor({
        id = null, name = '', description = '', location = 'Virtual', status = 'Online',
        code = Huddle.generateCode(), owner = null, participants = null,
        pendingInvites = [], selectedDates = [], messages = [],
        startDate = null, endDate = null
    } = {}) {
        super();
        Object.assign(this, { id, name, description, location, status, code, owner,
            pendingInvites, selectedDates, startDate, endDate });
        // One place to apply the default, so no more `participants || [owner]` everywhere
        this.participants = participants ?? (owner ? [owner] : []);
        this.messages = new MessageCollection(messages);
    }

    /** @returns {string} Random 5-character join code. */
    static generateCode() {
        return Math.random().toString(36).substring(2, 7).toUpperCase();
    }

    /** @param {string} userId @returns {boolean} */
    isOwner(userId) { return !!userId && this.owner === userId; }

    /** @param {string} userId @returns {boolean} True if owner or participant. */
    isMember(userId) { return this.isOwner(userId) || this.participants.includes(userId); }

    /** @param {string} userId @returns {boolean} */
    isPending(userId) { return this.pendingInvites.includes(userId); }

    /**
     * Add a user as a participant and clear any pending invite.
     * @param {string} userId
     * @returns {boolean} False if the user was already a member.
     */
    addParticipant(userId) {
        this.pendingInvites = this.pendingInvites.filter(id => id !== userId);
        if (this.isMember(userId)) return false;
        this.participants.push(userId);
        this.messages.addSystem(`${userId} joined the huddle.`);
        return true;
    }

    /**
     * Remove a participant. The owner cannot be removed.
     * @param {string} userId
     * @param {string|null} [removedBy] - Who removed them, or null if they left.
     */
    removeParticipant(userId, removedBy = null) {
        if (this.isOwner(userId)) return;
        this.participants = this.participants.filter(id => id !== userId);
        const msg = removedBy
            ? `${userId} was removed from the huddle by ${removedBy}.`
            : `${userId} left the huddle.`;
        this.messages.addSystem(msg);
    }

    /**
     * Mark a user as invited.
     * @param {string} userId
     * @param {string} invitedBy
     * @returns {'participant'|'pending'|'invited'} Result, so the view can pick a toast.
     */
    invite(userId, invitedBy) {
        if (this.participants.includes(userId)) return 'participant';
        if (this.isPending(userId)) return 'pending';
        this.pendingInvites.push(userId);
        this.messages.addSystem(`${invitedBy} invited ${userId} to the huddle.`);
        return 'invited';
    }

    /**
     * Toggle a planned date on or off.
     * @param {string} dateKey
     * @param {string} byUser
     * @returns {boolean} True if the date is now planned (fixes the inverted toast bug).
     */
    togglePlannedDate(dateKey, byUser) {
        const idx = this.selectedDates.indexOf(dateKey);
        if (idx !== -1) {
            this.selectedDates.splice(idx, 1);
            this.messages.addSystem(`${byUser} removed ${formatDate(dateKey)} from the planned dates.`);
            return false;
        }
        this.selectedDates.push(dateKey);
        this.messages.addSystem(`${byUser} selected ${formatDate(dateKey)} as a planned date.`);
        return true;
    }

    /** @returns {string[]} Participants plus pending invitees, without duplicates. */
    get allParticipantIds() { return [...new Set([...this.participants, ...this.pendingInvites])]; }

    /** @returns {string} Badge text (moved out of HuddleCard). */
    get statusLabel() {
        if (this.selectedDates && this.selectedDates.length > 0) {
            const dates = this.selectedDates;
            if (dates.length === 1) return formatDate(dates[0]);
            return `${dates.length} dates selected`;
        }
        if (this.startDate && this.endDate) {
            return `${formatDate(this.startDate)} to ${formatDate(this.endDate)}`;
        }
        if (this.startDate) return `Starts ${formatDate(this.startDate)}`;
        if (this.endDate) return `Ends ${formatDate(this.endDate)}`;
        return this.status || 'Ongoing';
    }

    /** @returns {string} Bootstrap badge class (moved out of HuddleCard). */
    get statusBadgeClass() {
        if (this.selectedDates && this.selectedDates.length > 0) return 'bg-primary';
        if (this.status === 'Online') return 'bg-success';
        if (this.status === 'Planning') return 'bg-warning';
        if (this.status === 'Completed') return 'bg-secondary';
        return 'bg-info';
    }

    /**
     * Case-insensitive search on name and description.
     * @param {string} query
     * @returns {boolean}
     */
    matches(query) {
        const q = query.trim().toLowerCase();
        return !q || this.name.toLowerCase().includes(q) || this.description.toLowerCase().includes(q);
    }

    /**
     * Validate the editable fields (moved from CreateHuddlePage.validateForm).
     * @returns {{name: string, description: string, location: string}} Error per field; empty string means valid.
     */
    validate() {
        return {
            name: !this.name.trim() ? 'Huddle name is required.'
                : this.name.trim().length < 3 ? 'Name must be at least 3 characters.' : '',
            description: this.description.trim() ? '' : 'Description is required.',
            location: this.location.trim() ? '' : 'Location is required.'
        };
    }

    /** @returns {boolean} */
    isValid() { return Object.values(this.validate()).every(e => !e); }
}
