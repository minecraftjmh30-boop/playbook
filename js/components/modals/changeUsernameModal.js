const ChangeUsernameModal = {
    name: 'ChangeUsernameModal',
    data() {
        return {
            newUsername: '',
            currentPassword: ''
        };
    },
    methods: {
        handleUpdate() {
            if (!this.newUsername || !this.currentPassword) {
                alert("Please fill in all fields.");
                return;
            }
            console.log("Attempting to change username to:", this.newUsername);
            alert("Username change requested (simulated).");
            const modalEl = document.getElementById('changeUsernameModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modal.hide();
            }
            this.newUsername = '';
            this.currentPassword = '';
        }
    },
    template: `
    <div class="modal fade" id="changeUsernameModal" tabindex="-1" aria-labelledby="changeUsernameModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="changeUsernameModalLabel">Change Username</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="newUsername" class="form-label">New Username</label>
                        <input type="text" class="form-control" id="newUsername" v-model="newUsername">
                    </div>
                    <div class="mb-3">
                        <label for="currentPasswordUsername" class="form-label">Current Password</label>
                        <input type="password" class="form-control" id="currentPasswordUsername" v-model="currentPassword">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="updateUsernameBtn" @click="handleUpdate">Update Username</button>
                </div>
            </div>
        </div>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.ChangeUsernameModal = ChangeUsernameModal;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('change-username-modal', ChangeUsernameModal);
        return app;
    };
}
