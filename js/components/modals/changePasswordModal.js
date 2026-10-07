const ChangePasswordModal = {
    name: 'ChangePasswordModal',
    data() {
        return {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        };
    },
    methods: {
        handleUpdate() {
            if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
                window.toast.error("Please fill in all fields.");
                return;
            }
            if (this.newPassword !== this.confirmNewPassword) {
                window.toast.error("New passwords do not match.");
                return;
            }
            console.log("Attempting to change password...");
            window.toast.success("Password change requested (simulated).");
            const modalEl = document.getElementById('changePasswordModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modal.hide();
            }
            this.currentPassword = '';
            this.newPassword = '';
            this.confirmNewPassword = '';
        }
    },
    template: `
    <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="changePasswordModalLabel">Change Password</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="currentPasswordPassword" class="form-label">Current Password</label>
                        <input type="password" class="form-control" id="currentPasswordPassword" v-model="currentPassword">
                    </div>
                    <div class="mb-3">
                        <label for="newPassword" class="form-label">New Password</label>
                        <input type="password" class="form-control" id="newPassword" v-model="newPassword">
                    </div>
                    <div class="mb-3">
                        <label for="confirmNewPassword" class="form-label">Confirm New Password</label>
                        <input type="password" class="form-control" id="confirmNewPassword" v-model="confirmNewPassword">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="updatePasswordBtn" @click="handleUpdate">Update Password</button>
                </div>
            </div>
        </div>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.ChangePasswordModal = ChangePasswordModal;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('change-password-modal', ChangePasswordModal);
        return app;
    };
}

// Note: This modal has been replaced by unifiedModal.js. Keeping for backward compatibility.
