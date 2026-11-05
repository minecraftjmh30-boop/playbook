/**
 * Ordered list of Invitation instances.
 * Provides convenience methods for filtering by recipient or huddle.
 */
import { Collection } from './Collection.js';
import { Invitation } from '../models/Invitation.js';

export class InvitationCollection extends Collection {
    /**
     * @param {Array<Invitation|object>} [items=[]] - Invitations or plain objects.
     */
    constructor(items = []) {
        super(items, Invitation);
    }

    /**
     * Return invitations for a specific user.
     * @param {string} userId - User ID to filter by.
     * @returns {Invitation[]}
     */
    forUser(userId) {
        return this.filter(inv => inv.to === userId);
    }

    /**
     * Return invitations for a specific huddle.
     * @param {number|string} huddleId - Huddle ID to filter by.
     * @returns {Invitation[]}
     */
    forHuddle(huddleId) {
        return this.filter(inv => inv.huddleId === huddleId);
    }

    /**
     * Remove a single invitation by its ID.
     * @param {string} id - Invitation ID.
     * @returns {boolean} True if the invitation was found and removed.
     */
    removeById(id) {
        const index = this.items.findIndex(inv => inv.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
}
