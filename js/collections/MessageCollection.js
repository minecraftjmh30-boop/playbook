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

    /** @param {string} user @param {string} text @returns {ChatMessage} */
    addChat(user, text) {
        return this.add({ user, text });
    }

    /** @param {string} text @returns {SystemMessage} */
    addSystem(text) {
        return this.add({ text, system: true });
    }

    /** @param {number} index */
    removeAt(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
        }
    }

    /** @returns {number} */
    get size() { return this.items.length; }

    /** Allows `for...of` and `v-for` over the collection. */
    [Symbol.iterator]() { return this.items[Symbol.iterator](); }
}
