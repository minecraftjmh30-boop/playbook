/**
 * Base chat message.
 * @abstract
 */
export class Message {
    /** @param {{text: string, time?: string}} data */
    constructor({ text = '', time = new Date().toLocaleTimeString() } = {}) {
        this.text = text;
        this.time = time;
    }
    /** @returns {boolean} Whether a given user may delete this message. */
    canBeDeletedBy(_userId, _ownerId) { return false; }
    /** @returns {boolean} */
    get isSystem() { return false; }
}
