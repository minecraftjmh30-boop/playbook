/** An automatic message created by the app (join, leave, invite...). */
import { Message } from './Message.js';

export class SystemMessage extends Message {
    get isSystem() { return true; }
    get user() { return 'System'; }
}
