/**
 * A Playbook user loaded from userInfo.json.
 * Wraps the raw user data and provides friend management methods.
 */
import { BaseModel } from './BaseModel.js';

export class User extends BaseModel {
    /**
     * @param {object} [data]
     * @param {string} [data.id] - User ID.
     * @param {string} [data.name] - Display name.
     * @param {string} [data.email] - Email address.
     * @param {string} [data.dateJoined] - Date the user joined.
     * @param {string} [data.friendCode] - Unique friend code for adding this user.
     * @param {string[]} [data.friends] - Array of friend IDs/names.
     */
    constructor({ id = '', name = '', email = '', dateJoined = '', friendCode = '', friends = [] } = {}) {
        super();
        this.id = id;
        this.name = name;
        this.email = email;
        this.dateJoined = dateJoined;
        this.friendCode = friendCode;
        this.friends = friends;
    }

    /**
     * Check whether a user ID is in the friends list.
     * @param {string} id - Friend ID to check.
     * @returns {boolean}
     */
    hasFriend(id) {
        return this.friends.includes(id);
    }

    /**
     * Remove a friend by ID.
     * @param {string} id - Friend ID to remove.
     * @returns {boolean} True if the friend was found and removed.
     */
    removeFriend(id) {
        const index = this.friends.indexOf(id);
        if (index !== -1) {
            this.friends.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Search friends by query string (case-insensitive partial match on name).
     * Used by both ProfileFriends and InviteFriendsModal.
     * @param {string} query - Search query.
     * @returns {Array<{id: string, name: string}>} Matching friends as id/name pairs.
     */
    searchFriends(query) {
        if (!query) {
            return this.friends.map(fName => ({ id: fName, name: fName }));
        }
        const lower = query.toLowerCase();
        return this.friends
            .filter(fName => fName.toLowerCase().includes(lower))
            .map(fName => ({ id: fName, name: fName }));
    }

    /**
     * Load a user from the debug JSON endpoint.
     * Replaces the duplicated fetch logic in ProfilePage and HuddlePage.
     * @param {string} userId - User ID to load.
     * @returns {Promise<User>}
     */
    static async load(userId) {
        const response = await fetch(`/debug/debugLogins/${userId}/userInfo.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user info for ${userId}`);
        }
        const data = await response.json();
        return new User({
            id: userId,
            name: data.name,
            email: data.email,
            dateJoined: data.dateJoined,
            friendCode: data.friendCode,
            friends: data.friends || []
        });
    }
}
