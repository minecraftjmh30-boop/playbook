const ProfileSettings = {
    name: 'ProfileSettings',
    template: `
    <div>
        <!-- Update Profile -->
        <div class="card mb-4">
            <div class="card-header">Account Settings</div>
            <div class="card-body d-flex flex-column gap-3">
                <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#changeUsernameModal">Change Username</button>
                <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#changePasswordModal">Change Password</button>
                <button class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#forgotPasswordModal">Forgot Password?</button>
            </div>
        </div>

        <!-- Account Actions -->
        <div class="card">
            <div class="card-body d-flex justify-content-center gap-3">
                <a href="login.html" class="btn btn-outline-warning">Logout</a>
                <button class="btn btn-danger">Remove Account</button>
            </div>
        </div>
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
