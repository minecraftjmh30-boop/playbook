/**
 * Global in-memory application state.
 *
 * Replaces localStorage while the new models are wired in.
 * Data persists while navigating between pages (Vue Router keeps the app alive),
 * but is lost on a full page reload.
 */
import { reactive } from 'vue';
import { Huddle } from '../models/Huddle.js';
import { HuddleCollection } from '../collections/HuddleCollection.js';

/**
 * Reactive store holding all application data.
 *
 * @property {HuddleCollection} huddles - Collection of Huddle instances.
 * @property {Object<string, Array>} invitations - Invitations keyed by user ID.
 * @property {Object<string, Object>} schedules - Schedules keyed by user ID.
 */
export const store = reactive({
    huddles: new HuddleCollection([
        new Huddle({
            id: 1,
            name: 'Game Night',
            description: 'Board games and snacks!',
            location: 'My place',
            owner: 'User1',
            participants: ['User1', 'User2']
        })
    ]),
    invitations: {},
    schedules: {}
});
