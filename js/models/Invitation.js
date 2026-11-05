/**
 * An invitation for a user to join a huddle.
 * Carries the huddle reference, sender, recipient, and timestamp.
 */
import { BaseModel } from './BaseModel.js';

export class Invitation extends BaseModel {
    /**
     * @param {object} [data]
     * @param {string} [data.id] - Unique invitation ID.
     * @param {number|string} [data.huddleId] - ID of the huddle being invited to.
     * @param {string} [data.huddleName] - Name of the huddle (for display).
     * @param {string} [data.invitedBy] - User ID of the inviter.
     * @param {string} [data.to] - User ID of the invitee.
     * @param {string} [data.timestamp] - ISO timestamp of creation.
     */
    constructor({
        id = `inv_${Date.now()}`,
        huddleId,
        huddleName = '',
        invitedBy = '',
        to = '',
        timestamp = new Date().toISOString()
    } = {}) {
        super();
        this.id = id;
        this.huddleId = huddleId;
        this.huddleName = huddleName;
        this.invitedBy = invitedBy;
        this.to = to;
        this.timestamp = timestamp;
    }

    /**
     * Accept the invitation: adds the user to the huddle.
     * @param {import('../../collections/HuddleCollection.js').HuddleCollection} huddles - Collection of all huddles.
     */
    accept(huddles) {
        const huddle = huddles.findById(this.huddleId);
        if (huddle) {
            huddle.addParticipant(this.to);
        }
    }

    /**
     * Decline the invitation: clears the pending flag on the huddle.
     * @param {import('../../collections/HuddleCollection.js').HuddleCollection} huddles - Collection of all huddles.
     */
    decline(huddles) {
        const huddle = huddles.findById(this.huddleId);
        if (huddle) {
            huddle.pendingInvites = huddle.pendingInvites.filter(id => id !== this.to);
        }
    }
}
