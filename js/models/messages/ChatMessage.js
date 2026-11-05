/**
 * A message written by a user in the huddle chat.
 * Extends Message with user-specific behavior.
 */
import { Message } from './Message.js';

export class ChatMessage extends Message {
    /**
     * Create a chat message.
     * @param {{user: string, text: string, time?: string}} data - Message data.
     */
    constructor({ user = 'Anonymous', ...rest } = {}) {
        super(rest);
        this.user = user;
    }

    /**
     * Check if this message was written by a specific user.
     * Replaces the fragile `user.split(' ')[1]` hack in HuddleChat.
     * @param {string} userId - The user ID to check against.
     * @returns {boolean} True if the message is from the user.
     */
    isFrom(userId) { return this.user === userId; }

    /**
     * Check if a user can delete this message.
     * The author or the huddle owner can delete.
     * @param {string} userId - The user attempting to delete.
     * @param {string} ownerId - The huddle owner ID.
     * @returns {boolean} True if the user can delete the message.
     */
    canBeDeletedBy(userId, ownerId) { return this.isFrom(userId) || userId === ownerId; }
}
