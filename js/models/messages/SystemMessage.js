/**
 * An automatic message created by the app (join, leave, invite, etc.).
 * Extends Message with system-specific behavior.
 */
import { Message } from './Message.js';

export class SystemMessage extends Message {
    /**
     * System messages are always marked as system messages.
     * @returns {boolean} Always true.
     */
    get isSystem() { return true; }

    /**
     * The user label for system messages.
     * @returns {string} Always 'System'.
     */
    get user() { return 'System'; }
}
