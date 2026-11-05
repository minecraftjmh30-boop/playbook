/**
 * Collection of Huddle models providing lookup, filtering and join operations.
 */
import { Collection } from './Collection.js';
import { Huddle } from '../models/Huddle.js';

export class HuddleCollection extends Collection {
    /**
     * @param {Array<Huddle|object>} [items=[]]
     */
    constructor(items = []) {
        super(items, Huddle);
    }

    /**
     * Add a huddle, assigning an ID if missing.
     * @param {Huddle|object} item
     * @returns {Huddle}
     */
    add(item) {
        const huddle = super.add(item);
        if (huddle.id == null) huddle.id = this.nextId();
        return huddle;
    }

    /** @returns {number} The next available huddle ID. */
    nextId() {
        return this.size ? Math.max(...this.items.map(h => h.id)) + 1 : 1;
    }

    /**
     * Find a huddle by its numeric ID (accepts string or number).
     * @param {number|string} id
     * @returns {Huddle|undefined}
     */
    findById(id) {
        return this.find(h => h.id === Number(id));
    }

    /**
     * Find a huddle by its join code.
     * @param {string} code
     * @returns {Huddle|undefined}
     */
    findByCode(code) {
        return this.find(h => h.code === code);
    }

    /**
     * Return huddles where the user is a member (owner or participant).
     * @param {string} userId
     * @returns {Huddle[]}
     */
    forMember(userId) {
        return this.filter(h => h.isMember(userId));
    }

    /**
     * Return huddles owned by the user.
     * @param {string} userId
     * @returns {Huddle[]}
     */
    ownedBy(userId) {
        return this.filter(h => h.isOwner(userId));
    }

    /**
     * Remove a huddle by its ID.
     * @param {number} id
     */
    removeById(id) {
        this.remove(h => h.id === id);
    }

    /**
     * Replace the stored huddle with the same ID (used after editing a clone).
     * @param {Huddle} huddle
     */
    replace(huddle) {
        const i = this.items.findIndex(h => h.id === huddle.id);
        if (i !== -1) this.items[i] = huddle;
    }

    /**
     * Join a huddle by code. Replaces the duplicated join-by-code logic in pages.
     * @param {string} code
     * @param {string} userId
     * @returns {{huddle: Huddle|null, joined: boolean}}
     */
    joinByCode(code, userId) {
        const huddle = this.findByCode(code);
        return { huddle: huddle ?? null, joined: huddle ? huddle.addParticipant(userId) : false };
    }
}
