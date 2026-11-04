/** A message written by a user. */
import { Message } from './Message.js';

export class ChatMessage extends Message {
    /** @param {{user: string, text: string, time?: string}} data */
    constructor({ user = 'Anonymous', ...rest } = {}) {
        super(rest);
        this.user = user;
    }
    /** @param {string} userId @returns {boolean} (replaces the split(' ') hack in HuddleChat) */
    isFrom(userId) { return this.user === userId; }
    /** Authors and the huddle owner can delete. */
    canBeDeletedBy(userId, ownerId) { return this.isFrom(userId) || userId === ownerId; }
}
