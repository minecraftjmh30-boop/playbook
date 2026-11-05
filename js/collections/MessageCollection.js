/**
 * Collection of messages for a huddle.
 * Extends a simple array with factory methods for ChatMessage and SystemMessage.
 */
import { ChatMessage } from '../models/messages/ChatMessage.js';
import { SystemMessage } from '../models/messages/SystemMessage.js';

export class MessageCollection {
    /**
     * @param {Array<object>} [items=[]] - Plain message objects to hydrate.
     */
    constructor(items = []) {
        this.items = [];
        items.forEach(item => this.add(item));
    }

    /**
     * Smart factory: chooses subclass based on data.system flag.
     * @param {object} data
     * @returns {ChatMessage|SystemMessage}
     */
    add(data) {
        const msg = data.system ? new SystemMessage(data) : new ChatMessage(data);
        this.items.push(msg);
        return msg;
    }

    /**
     * Add a chat message from a user.
     * @param {string} user - User ID.
     * @param {string} text - Message text.
     * @returns {ChatMessage} The created message.
     */
    addChat(user, text) {
        return this.add({ user, text });
    }

    /**
     * Add a system message (join, leave, invite, etc.).
     * @param {string} text - Message text.
     * @returns {SystemMessage} The created message.
     */
    addSystem(text) {
        return this.add({ text, system: true });
    }

    /**
     * Remove a message at a specific index.
     * @param {number} index - Zero-based index.
     */
    removeAt(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
        }
    }

    /**
     * Number of messages in the collection.
     * @returns {number}
     */
    get size() { return this.items.length; }

    /** Allows `for...of` and `v-for` over the collection. */
    [Symbol.iterator]() { return this.items[Symbol.iterator](); }
}
