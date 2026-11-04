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
import { ToastKey } from '../../core/keys.js';
import { store } from '../../core/store.js';
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

            const list = this.showMyHuddlesOnly
                ? store.huddles.ownedBy(this.currentUser)
                : store.huddles.forMember(this.currentUser);

            return list.filter(huddle => huddle.matches(this.searchQuery));
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

            const { huddle, joined } = store.huddles.joinByCode(code, this.currentUser);
            if (huddle) {
                if (joined) {
                    this.toast.success(`Successfully joined "${huddle.name}"!`);
                } else {
                    this.toast.info('You are already a member of this huddle.');
                }
                this.showJoinModal = false;
                this.joinCode = '';
                this.router.push({ path: '/huddle', query: { id: huddle.id } });
            } else {
                this.toast.error('Invalid huddle code!');
            }
        },
        editHuddle(huddle) {
            // Only the owner should be able to edit
            if (huddle.isOwner(this.currentUser)) {
                this.router.push({ path: '/create-huddle', query: { id: huddle.id } });
            } else {
                this.toast.error('You must be the owner to edit this huddle.');
            }
        },
        deleteHuddle(id) {
            const huddleToDelete = store.huddles.findById(id);
            if (!huddleToDelete) return;

            // Only the owner should be able to delete
            if (huddleToDelete.isOwner(this.currentUser)) {
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
                store.huddles.removeById(this.confirmHuddle.id);
                this.toast.success('Huddle deleted successfully!');
            } else if (this.confirmAction === 'leave') {
                this.confirmHuddle.removeParticipant(this.currentUser);
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
