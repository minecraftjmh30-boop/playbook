const ProfileSettings = {
    name: 'ProfileSettings',
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
            window.toast.success('Username change requested (simulated).');
        },
        handlePasswordSubmit(values) {
            if (values.newPassword !== values.confirmNewPassword) {
                window.toast.error('New passwords do not match.');
                return;
            }
            console.log('Password change requested');
            window.toast.success('Password change requested (simulated).');
        },
        handleForgotSubmit(values) {
            if (values.resetNewPassword !== values.confirmResetNewPassword) {
                window.toast.error('New passwords do not match.');
                return;
            }
            console.log('Password reset requested with code:', values.resetCode);
            window.toast.success('Password reset requested (simulated).');
        }
    },
    template: `
    <div>
        <!-- Update Profile -->
        <div class="card mb-4">
            <div class="card-header">Account Settings</div>
            <div class="card-body d-flex flex-column gap-3">
                <button class="btn btn-outline-primary" @click="showUsernameModal = true">Change Username</button>
                <button class="btn btn-outline-primary" @click="showPasswordModal = true">Change Password</button>
                <button class="btn btn-outline-warning" @click="showForgotModal = true">Forgot Password?</button>
            </div>
        </div>

        <!-- Account Actions -->
        <div class="card">
            <div class="card-body d-flex justify-content-center gap-3">
                <a href="login.html" class="btn btn-outline-warning">Logout</a>
                <button class="btn btn-danger">Remove Account</button>
            </div>
        </div>

        <!-- Unified Modals -->
        <unified-modal
            v-model:show="showUsernameModal"
            title="Change Username"
            :fields="usernameFields"
            submit-text="Update Username"
            @submit="handleUsernameSubmit">
        </unified-modal>

        <unified-modal
            v-model:show="showPasswordModal"
            title="Change Password"
            :fields="passwordFields"
            submit-text="Update Password"
            @submit="handlePasswordSubmit">
        </unified-modal>

        <unified-modal
            v-model:show="showForgotModal"
            title="Reset Password"
            :fields="forgotFields"
            submit-text="Reset Password"
            @submit="handleForgotSubmit">
        </unified-modal>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.ProfileSettings = ProfileSettings;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('profile-settings', ProfileSettings);
        return app;
    };
}
