<template>
    <div>
        <div class="card mb-4">
            <div class="card-header">Account Settings</div>
            <div class="card-body d-flex flex-column gap-3">
                <button class="btn btn-outline-primary" @click="showUsernameModal = true">Change Username</button>
                <button class="btn btn-outline-primary" @click="showPasswordModal = true">Change Password</button>
                <button class="btn btn-outline-warning" @click="showForgotModal = true">Forgot Password?</button>
            </div>
        </div>
        <div class="card">
            <div class="card-body d-flex justify-content-center gap-3">
                <a href="#" @click.prevent="handleLogout" class="btn btn-outline-warning">Logout</a>
                <button class="btn btn-danger">Remove Account</button>
            </div>
        </div>
        <UnifiedModal v-model:show="showUsernameModal" title="Change Username" :fields="usernameFields" submit-text="Update Username" @submit="handleUsernameSubmit"></UnifiedModal>
        <UnifiedModal v-model:show="showPasswordModal" title="Change Password" :fields="passwordFields" submit-text="Update Password" @submit="handlePasswordSubmit"></UnifiedModal>
        <UnifiedModal v-model:show="showForgotModal" title="Reset Password" :fields="forgotFields" submit-text="Reset Password" @submit="handleForgotSubmit"></UnifiedModal>
    </div>
</template>

<script>
import { inject } from 'vue';
import { useRouter } from 'vue-router';
const ToastKey = Symbol('toast');
import UnifiedModal from '../modals/UnifiedModal.vue';

export default {
    name: 'ProfileSettings',
    components: { UnifiedModal },
    setup() {
        const toast = inject(ToastKey);
        const router = useRouter();
        return { toast, router };
    },
    data() {
        return {
            showUsernameModal: false,
            showPasswordModal: false,
            showForgotModal: false
        };
    },
    computed: {
        usernameFields() {
            return [
                { id: 'newUsername', label: 'New Username', type: 'text', placeholder: 'Enter new username', required: true },
                { id: 'currentPassword', label: 'Current Password', type: 'password', placeholder: 'Enter current password', required: true }
            ];
        },
        passwordFields() {
            return [
                { id: 'currentPassword', label: 'Current Password', type: 'password', placeholder: 'Enter current password', required: true },
                { id: 'newPassword', label: 'New Password', type: 'password', placeholder: 'Enter new password', required: true },
                { id: 'confirmNewPassword', label: 'Confirm New Password', type: 'password', placeholder: 'Confirm new password', required: true }
            ];
        },
        forgotFields() {
            return [
                { id: 'resetCode', label: 'Reset Code', type: 'text', placeholder: 'Enter the code sent to your email', required: true },
                { id: 'resetNewPassword', label: 'New Password', type: 'password', placeholder: 'Enter new password', required: true },
                { id: 'confirmResetNewPassword', label: 'Confirm New Password', type: 'password', placeholder: 'Confirm new password', required: true }
            ];
        }
    },
    methods: {
        handleUsernameSubmit(values) {
            console.log('Username change requested:', values.newUsername);
            this.toast.success('Username change requested (simulated).');
        },
        handlePasswordSubmit(values) {
            if (values.newPassword !== values.confirmNewPassword) {
                this.toast.error('New passwords do not match.');
                return;
            }
            console.log('Password change requested');
            this.toast.success('Password change requested (simulated).');
        },
        handleForgotSubmit(values) {
            if (values.resetNewPassword !== values.confirmResetNewPassword) {
                this.toast.error('New passwords do not match.');
                return;
            }
            console.log('Password reset requested with code:', values.resetCode);
            this.toast.success('Password reset requested (simulated).');
        },
        handleLogout() {
            document.cookie = 'currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            this.router.push('/login');
        }
    },
};
</script>