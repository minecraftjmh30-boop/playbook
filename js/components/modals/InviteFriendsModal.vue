<template>
    <BaseModal :show="show" :title="title" @close="close">
        <input type="text" class="form-control form-control-sm mb-3" placeholder="Search friends..." :value="searchQuery" @input="onSearch">
        <div v-if="friends.length === 0" class="text-muted text-center">
            No friends found. Add friends from your profile first.
        </div>
        <ul v-else class="list-group">
            <li v-for="friend in filteredFriends" :key="friend.id" class="list-group-item d-flex justify-content-between align-items-center">
                <span>{{ friend.name }}</span>
                <span v-if="participantIds.includes(friend.id)" class="badge bg-success">Participant</span>
                <span v-else-if="pendingIds.includes(friend.id)" class="badge bg-info">Pending</span>
                <button v-else class="btn btn-sm btn-primary" @click="onInvite(friend.id)">Invite</button>
            </li>
        </ul>
        <template #footer>
            <button type="button" class="btn btn-secondary" @click="close">Close</button>
        </template>
    </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue';

/**
 * Modal for inviting friends to a huddle.
 *
 * Controlled programmatically via a ref: call `open(options)` to display the dialog.
 *
 * Usage in a parent component:
 *   <InviteFriendsModal ref="invite" />
 *   this.$refs.invite.open({ friends, participantIds, pendingIds, onInvite });
 */
export default {
    name: 'InviteFriendsModal',
    components: { BaseModal },
    data() {
        return {
            show: false,
            title: 'Invite Friends',
            /** Array of friend objects: { id, name }. */
            friends: [],
            /** Array of participant IDs (already in the huddle). */
            participantIds: [],
            /** Array of pending invite IDs. */
            pendingIds: [],
            /** Current search query text. */
            searchQuery: '',
            /** Callback invoked when inviting a friend. */
            onInvite: null
        };
    },
    computed: {
        /** Filter friends by the current search query. */
        filteredFriends() {
            if (!this.searchQuery) return this.friends;
            const search = this.searchQuery.toLowerCase();
            return this.friends.filter(friend => friend.name.toLowerCase().includes(search));
        }
    },
    emits: ['close', 'invite'],
    methods: {
        /**
         * Display the invite friends dialog.
         * @param {object} options
         * @param {string} [options.title='Invite Friends'] - Modal title.
         * @param {Array} options.friends - Array of friend objects with { id, name }.
         * @param {Array} [options.participantIds] - Array of IDs already in the huddle.
         * @param {Array} [options.pendingIds] - Array of IDs with pending invitations.
         * @param {Function} [options.onInvite] - Callback when a friend is invited.
         */
        open({ title = 'Invite Friends', friends, participantIds = [], pendingIds = [], onInvite = null } = {}) {
            this.title = title;
            this.friends = friends;
            this.participantIds = participantIds;
            this.pendingIds = pendingIds;
            this.onInvite = onInvite;
            this.searchQuery = '';
            this.show = true;
        },
        close() {
            this.show = false;
            this.searchQuery = '';
            this.onInvite = null;
        },
        /** Handle search input changes. */
        onSearch(event) {
            this.searchQuery = event.target.value;
        },
        /**
         * Handle inviting a friend.
         * @param {string} friendId - The ID of the friend to invite.
         */
        onInvite(friendId) {
            if (this.onInvite) {
                this.onInvite(friendId);
            }
            this.$emit('invite', friendId);
        }
    }
};
</script>
