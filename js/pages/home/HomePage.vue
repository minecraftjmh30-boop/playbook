<template>
    <div class="d-flex flex-column min-vh-100">
        <AppHeader></AppHeader>
        <AppHero></AppHero>
        <main class="flex-grow-1">
            <header class="mt-4">
                <div class="container">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h1 class="mb-0">My Huddles</h1>
                        <div>
                            <button class="btn btn-success me-2" @click="showChoiceModal = true">Add Huddle</button>
                            <button class="btn" :class="showMyHuddlesOnly ? 'btn-primary' : 'btn-secondary'" @click="toggleMyHuddles()">
                                {{ showMyHuddlesOnly ? 'All Huddles' : 'My Huddles Only' }}
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <input type="text" class="form-control" placeholder="Search huddles by name..." :value="searchQuery" @input="updateSearch">
                        </div>
                    </div>
                </div>
            </header>
            <section id="huddles">
                <div class="container my-4">
                    <div class="row">
                        <HuddleCard v-for="huddle in huddles" :key="huddle.id" :huddle="huddle" :current-user="currentUser" @edit="editHuddle" @delete="deleteHuddle" @leave="leaveHuddle"></HuddleCard>
                    </div>
                    <div v-if="huddles.length === 0" class="text-center text-muted">No huddles available. Add one!</div>
                </div>
            </section>
            <ChoiceModal :show="showChoiceModal" @close="showChoiceModal = false" @open-join="showChoiceModal = false; openJoinModal()"></ChoiceModal>
            <JoinHuddleModal :show="showJoinModal" v-model="joinCode" @close="showJoinModal = false" @join="joinHuddle"></JoinHuddleModal>
            <div v-if="showDeleteModal" class="modal fade show d-block modal-overlay" tabindex="-1">
                <div class="modal-dialog"><div class="modal-content">
                    <div class="modal-header"><h5 class="modal-title">{{ confirmAction === 'delete' ? 'Delete Huddle' : 'Leave Huddle' }}</h5><button type="button" class="btn-close" @click="showDeleteModal = false"></button></div>
                    <div class="modal-body">
                        <p v-if="confirmAction === 'delete'">Are you sure you want to delete "{{ confirmHuddle?.name }}"? This action cannot be undone.</p>
                        <p v-else>Are you sure you want to leave "{{ confirmHuddle?.name }}"?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
                        <button v-if="confirmAction === 'delete'" type="button" class="btn btn-danger" @click="executeConfirmAction">Delete</button>
                        <button v-else type="button" class="btn btn-primary" @click="executeConfirmAction">Leave</button>
                    </div>
                </div></div>
            </div>
        </main>
        <AppFooter></AppFooter>
        <ToastComponent ref="toast" />
    </div>
</template>

<script>
import { getCookie, sanitizeInput } from '../../core/utils.js';
import { provide, ref } from 'vue';
import { useRouter } from 'vue-router';
const ToastKey = Symbol('toast');
import AppHeader from '../../components/main/AppHeader.vue';
import AppFooter from '../../components/main/AppFooter.vue';
import AppHero from '../../components/main/AppHero.vue';
import HuddleCard from '../../components/huddle/HuddleCard.vue';
import ChoiceModal from '../../components/modals/ChoiceModal.vue';
import JoinHuddleModal from '../../components/modals/JoinHuddleModal.vue';
import ToastComponent from '../../components/ui/Toast.vue';

export default {
    name: 'HomePage',
    components: { AppHeader, AppFooter, AppHero, HuddleCard, ChoiceModal, JoinHuddleModal, ToastComponent },
    setup() {
        const toast = ref(null);
        const router = useRouter();
        provide(ToastKey, toast);
        return { toast, router };
    },
    data() {
        return {
            // Remove static huddles - only load from localStorage
            allHuddles: JSON.parse(localStorage.getItem('huddles')) || [],
            showChoiceModal: false,
            showJoinModal: false,
            joinCode: '',
            currentUser: getCookie('currentUser') || null,
            showMyHuddlesOnly: false,
            searchQuery: '',
            showDeleteModal: false,
            confirmAction: null,
            confirmHuddle: null
        };
    },
    computed: {
        huddles() {
            if (!this.currentUser) {
                return [];
            }
            
            let filtered;
            if (this.showMyHuddlesOnly) {
                // Only show huddles the user owns
                filtered = this.allHuddles.filter(huddle => huddle.owner === this.currentUser);
            } else {
                // Show all huddles the user is a part of (owner or participant)
                filtered = this.allHuddles.filter(huddle =>
                    huddle.owner === this.currentUser ||
                    (huddle.participants && huddle.participants.includes(this.currentUser))
                );
            }
            
            // Filter by search query
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(huddle =>
                    huddle.name.toLowerCase().includes(query) ||
                    (huddle.description && huddle.description.toLowerCase().includes(query))
                );
            }
            
            return filtered;
        }
    },
    methods: {
        openJoinModal() {
            this.showJoinModal = true;
        },
        joinHuddle() {
            // Sanitize and trim the join code
            const code = sanitizeInput(this.joinCode.trim());
            if (!code) {
                this.toast.error('Please enter a huddle code.');
                return;
            }

            const huddle = this.allHuddles.find(r => r.code === code);
            if (huddle) {
                // Add current user as participant if not already
                if (!huddle.participants) {
                    huddle.participants = [huddle.owner];
                }
                if (this.currentUser && !huddle.participants.includes(this.currentUser)) {
                    huddle.participants.push(this.currentUser);
                    // Add join system message to chat
                    if (!huddle.messages) huddle.messages = [];
                    huddle.messages.push({
                        user: 'System',
                        text: `${this.currentUser} joined the huddle.`,
                        time: new Date().toLocaleTimeString(),
                        system: true
                    });
                    this.toast.success(`Successfully joined "${huddle.name}"!`);
                } else {
                    this.toast.info('You are already a member of this huddle.');
                }
                localStorage.setItem('huddles', JSON.stringify(this.allHuddles));
                this.showJoinModal = false;
                this.joinCode = '';
                this.router.push({ path: '/huddle', query: { id: huddle.id } });
            } else {
                this.toast.error('Invalid huddle code!');
            }
        },
        editHuddle(huddle) {
            // Only the owner should be able to edit
            if (this.currentUser && huddle.owner === this.currentUser) {
                this.router.push({ path: '/create-huddle', query: { id: huddle.id } });
            } else {
                this.toast.error('You must be the owner to edit this huddle.');
            }
        },
        deleteHuddle(id) {
            const huddleToDelete = this.allHuddles.find(huddle => huddle.id === id);
            if (!huddleToDelete) return;

            // Only the owner should be able to delete
            if (this.currentUser && huddleToDelete.owner === this.currentUser) {
                this.confirmAction = 'delete';
                this.confirmHuddle = huddleToDelete;
                this.showDeleteModal = true;
            } else {
                this.toast.error('You must be the owner to delete this huddle.');
            }
        },
        leaveHuddle(huddle) {
            this.confirmAction = 'leave';
            this.confirmHuddle = huddle;
            this.showDeleteModal = true;
        },
        executeConfirmAction() {
            if (this.confirmAction === 'delete') {
                this.allHuddles = this.allHuddles.filter(huddle => huddle.id !== this.confirmHuddle.id);
                localStorage.setItem('huddles', JSON.stringify(this.allHuddles));
                this.toast.success('Huddle deleted successfully!');
            } else if (this.confirmAction === 'leave') {
                const huddle = this.confirmHuddle;
                if (huddle.participants) {
                    huddle.participants = huddle.participants.filter(id => id !== this.currentUser);
                    if (!huddle.messages) huddle.messages = [];
                    huddle.messages.push({
                        user: 'System',
                        text: `${this.currentUser} left the huddle.`,
                        time: new Date().toLocaleTimeString(),
                        system: true
                    });
                    this.toast.info(`You have left "${huddle.name}".`);
                }
                localStorage.setItem('huddles', JSON.stringify(this.allHuddles));
            }
            this.showDeleteModal = false;
            this.confirmAction = null;
            this.confirmHuddle = null;
        },
        toggleMyHuddles() {
            this.showMyHuddlesOnly = !this.showMyHuddlesOnly;
        },
        updateSearch(event) {
            this.searchQuery = event.target.value;
        }
    }
};
</script>
