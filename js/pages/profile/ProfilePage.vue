<template>
    <div class="d-flex flex-column min-vh-100">
        <AppHeader></AppHeader>
        <main class="container my-5 flex-grow-1">
            <div class="row">
                <div class="col-md-3">
                    <nav class="profile-nav">
                        <ul class="nav flex-column">
                            <li class="nav-item"><a class="nav-link" href="#" @click.prevent="scrollToSection('profile-main')">Profile Info</a></li>
                            <li class="nav-item"><a class="nav-link" href="#" @click.prevent="scrollToSection('profile-huddles')">Huddle Invitations</a></li>
                            <li class="nav-item"><a class="nav-link" href="#" @click.prevent="scrollToSection('profile-friends')">Friends</a></li>
                            <li class="nav-item"><a class="nav-link" href="#" @click.prevent="scrollToSection('profile-settings')">Settings</a></li>
                        </ul>
                    </nav>
                </div>
                <div class="col-md-9">
                    <section ref="profile-main" class="profile-section mb-5">
                        <h4>Profile Information</h4>
                        <ProfileInfo :user-info="userInfo"></ProfileInfo>
                    </section>
                    <section ref="profile-huddles" class="profile-section mb-5">
                        <h4>Huddle Invitations</h4>
                        <div class="card mb-4">
                            <div class="card-header">Huddles I'm In</div>
                            <ul class="list-group list-group-flush">
                                <li v-for="huddle in myHuddles" :key="huddle.id" class="list-group-item d-flex justify-content-between align-items-center">
                                    <div><strong>{{ huddle.name }}</strong><p class="mb-0 small text-muted">{{ huddle.description }}</p></div>
                                    <router-link :to="{ path: '/huddle', query: { id: huddle.id } }" class="btn btn-primary btn-sm">Go to Huddle</router-link>
                                </li>
                            </ul>
                            <div v-if="myHuddles.length === 0" class="card-body text-muted text-center">You're not in any huddles yet.</div>
                        </div>
                        <div class="card mb-4">
                            <div class="card-header">Pending Invitations</div>
                            <ul class="list-group list-group-flush">
                                <li v-for="invitation in pendingInvitations" :key="invitation.id" class="list-group-item d-flex justify-content-between align-items-center">
                                    <div><strong>{{ invitation.huddleName }}</strong><p class="mb-0 small text-muted">Invited by {{ invitation.invitedBy }}</p></div>
                                    <div><button class="btn btn-success btn-sm me-1" @click="acceptInvitation(invitation)">Accept</button><button class="btn btn-secondary btn-sm" @click="declineInvitation(invitation)">Decline</button></div>
                                </li>
                            </ul>
                            <div v-if="pendingInvitations.length === 0" class="card-body text-muted text-center">No pending invitations.</div>
                        </div>
                        <div class="card">
                            <div class="card-header">Join a Huddle</div>
                            <div class="card-body">
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="Enter huddle code" v-model="joinHuddleCode" @keyup.enter="joinHuddleFromProfile">
                                    <button class="btn btn-primary" type="button" @click="joinHuddleFromProfile">Join</button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section ref="profile-friends" class="profile-section mb-5">
                        <h4>Friends</h4>
                        <ProfileFriends :friends="friends" :pending-requests="pendingRequests" :friend-code="friendCode" @remove-friend="removeFriend" @handle-request="handlePendingRequest" @add-friend="addFriend"></ProfileFriends>
                    </section>
                    <section ref="profile-settings" class="profile-section mb-5">
                        <h4>Settings</h4>
                        <ProfileSettings></ProfileSettings>
                    </section>
                </div>
            </div>
        </main>
        <AppFooter></AppFooter>
        <ToastComponent ref="toast" />
        <ConfirmModal ref="confirm" />
    </div>
</template>

<script>
import { getCookie, sanitizeInput } from '../../core/utils.js';
import { provide, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ToastKey } from '../../core/keys.js';
import { store } from '../../core/store.js';
import { User } from '../../models/User.js';
import { Invitation } from '../../models/Invitation.js';
import AppHeader from '../../components/main/AppHeader.vue';
import AppFooter from '../../components/main/AppFooter.vue';
import ProfileInfo from '../../components/profile/ProfileInfo.vue';
import ProfileFriends from '../../components/profile/ProfileFriends.vue';
import ProfileSettings from '../../components/profile/ProfileSettings.vue';
import ToastComponent from '../../components/ui/Toast.vue';
import ConfirmModal from '../../components/modals/ConfirmModal.vue';

export default {
    name: 'ProfilePage',
    components: { AppHeader, AppFooter, ProfileInfo, ProfileFriends, ProfileSettings, ToastComponent, ConfirmModal },
    setup() {
        const toast = ref(null);
        const route = useRoute();
        provide(ToastKey, toast);
        return { toast, route };
    },
    data() {
        return {
            userInfo: {
                name: 'Loading...',
                email: '',
                dateJoined: ''
            },
            friends: [],
            pendingRequests: [],
            friendCode: '',
            // Huddle invitations
            myHuddles: [],
            pendingInvitations: [],
            joinHuddleCode: '',
            // Confirmation modal (handled by ConfirmModal component)
        };
    },
    async mounted() {
        await this.loadUserData();
        await this.loadHuddleData();
        
        // Handle initial hash in URL
        if (this.route.hash) {
            const targetId = this.route.hash.substring(1);
            this.$nextTick(() => {
                setTimeout(() => {
                    this.scrollToSection(targetId);
                }, 100);
            });
        }
    },
    methods: {
        async loadUserData() {
            const userId = getCookie('currentUser') || 'User1';
            try {
                const user = await User.load(userId);
                this.userInfo = {
                    name: user.name,
                    email: user.email,
                    dateJoined: user.dateJoined
                };
                this.friendCode = user.friendCode;
                this.friends = user.searchFriends('');
            } catch (error) {
                console.error('Error loading user data:', error);
                this.userInfo = {
                    name: 'Error loading user',
                    email: '',
                    dateJoined: ''
                };
            }
        },
        async loadHuddleData() {
            const userId = getCookie('currentUser') || 'User1';

            // Huddles where user is a participant
            this.myHuddles = store.huddles.forMember(userId);

            // Pending invitations for this user
            this.pendingInvitations = store.invitations.forUser(userId);
        },
        async acceptInvitation(invitation) {
            const huddle = store.huddles.findById(invitation.huddleId);
            if (huddle) {
                invitation.accept(store.huddles);
                this.removeInvitation(invitation);
                await this.loadHuddleData();
                this.toast.success(`You accepted the invitation to "${huddle.name}".`);
            }
        },
        async declineInvitation(invitation) {
            invitation.decline(store.huddles);
            this.removeInvitation(invitation);
            await this.loadHuddleData();
            this.toast.info('Invitation declined.');
        },
        removeInvitation(invitation) {
            store.invitations.removeById(invitation.id);
        },
        async joinHuddleFromProfile() {
            const code = sanitizeInput(this.joinHuddleCode.trim());
            if (!code) {
                this.toast.error('Please enter a huddle code.');
                return;
            }

            const userId = getCookie('currentUser') || 'User1';
            const { huddle, joined } = store.huddles.joinByCode(code, userId);
            if (huddle) {
                this.joinHuddleCode = '';
                await this.loadHuddleData();
                if (joined) {
                    this.toast.success(`Joined "${huddle.name}"!`);
                } else {
                    this.toast.info('You are already a member of this huddle.');
                }
            } else {
                this.toast.error('Invalid huddle code!');
            }
        },
        removeFriend(id) {
            this.$refs.confirm.open({
                title: 'Remove Friend',
                message: 'Are you sure you want to remove this friend?',
                onConfirm: () => {
                    this.friends = this.friends.filter(friend => friend.id !== id);
                    this.toast.info('Friend removed.');
                }
            });
        },
        handlePendingRequest(id, action) {
            if (action === 'add') {
                const friend = this.pendingRequests.find(pendingRequest => pendingRequest.id === id);
                if (friend) {
                    this.friends.push({ id: friend.name, name: friend.name });
                    this.pendingRequests = this.pendingRequests.filter(pendingRequest => pendingRequest.id !== id);
                    this.toast.success(`Friend request from ${friend.name} accepted.`);
                }
            } else {
                this.pendingRequests = this.pendingRequests.filter(pendingRequest => pendingRequest.id !== id);
                this.toast.info('Friend request declined.');
            }
        },
        addFriend(code) {
            if (code && code.trim()) {
                const sanitizedCode = sanitizeInput(code.trim());
                this.toast.success(`Friend request sent to: ${sanitizedCode}`);
            }
        },
        scrollToSection(sectionId) {
            const ref = this.$refs[sectionId];
            if (ref) {
                ref.scrollIntoView({behavior: 'smooth', block: 'start'});
                window.history.pushState(null, '', `#${sectionId}`);
            }
        }
    }
};
</script>

<style scoped>
.profile-nav { position: sticky; top: 1rem; }
.profile-nav .nav-link { cursor: pointer; white-space: nowrap; }
.profile-section { scroll-margin-top: 2rem; }

@media (max-width: 700px) {
    .profile-nav { display: none; }
    .col-md-9 { flex: 0 0 100%; max-width: 100%; }
}
</style>
