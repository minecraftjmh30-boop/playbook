const ForgotPasswordModal = {
    name: 'ForgotPasswordModal',
    data() {
        return {
            resetCode: '',
            resetNewPassword: '',
            confirmResetNewPassword: ''
        };
    },
    methods: {
        handleReset() {
            if (!this.resetCode || !this.resetNewPassword || !this.confirmResetNewPassword) {
                alert("Please fill in all fields.");
                return;
            }
            if (this.resetNewPassword !== this.confirmResetNewPassword) {
                alert("New passwords do not match.");
                return;
            }
            console.log("Attempting to reset password with code:", this.resetCode);
            alert("Password reset requested (simulated).");
            const modalEl = document.getElementById('forgotPasswordModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modal.hide();
            }
            this.resetCode = '';
            this.resetNewPassword = '';
            this.confirmResetNewPassword = '';
        }
    },
    template: `
    <div class="modal fade" id="forgotPasswordModal" tabindex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="forgotPasswordModalLabel">Reset Password</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="resetCode" class="form-label">Reset Code</label>
                        <input type="text" class="form-control" id="resetCode" v-model="resetCode" placeholder="Enter the code sent to your email">
                    </div>
                    <div class="mb-3">
                        <label for="resetNewPassword" class="form-label">New Password</label>
                        <input type="password" class="form-control" id="resetNewPassword" v-model="resetNewPassword">
                    </div>
                    <div class="mb-3">
                        <label for="confirmResetNewPassword" class="form-label">Confirm New Password</label>
                        <input type="password" class="form-control" id="confirmResetNewPassword" v-model="confirmResetNewPassword">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="resetPasswordBtn" @click="handleReset">Reset Password</button>
                </div>
            </div>
        </div>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.ForgotPasswordModal = ForgotPasswordModal;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('forgot-password-modal', ForgotPasswordModal);
        return app;
    };
}
