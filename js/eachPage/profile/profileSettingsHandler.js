function initProfileSettings() {
    // Change Username Logic
    const updateUsernameBtn = document.getElementById('updateUsernameBtn');
    if (updateUsernameBtn) {
        updateUsernameBtn.addEventListener('click', function() {
            const newUsername = document.getElementById('newUsername')?.value;
            const currentPassword = document.getElementById('currentPasswordUsername')?.value;

            if (!newUsername || !currentPassword) {
                alert("Please fill in all fields.");
                return;
            }

            console.log("Attempting to change username to:", newUsername);
            // TODO: Implement actual API call
            alert("Username change requested (simulated).");
            const modalEl = document.getElementById('changeUsernameModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modal.hide();
            }
        });
    }

    // Change Password Logic
    const updatePasswordBtn = document.getElementById('updatePasswordBtn');
    if (updatePasswordBtn) {
        updatePasswordBtn.addEventListener('click', function() {
            const currentPassword = document.getElementById('currentPasswordPassword')?.value;
            const newPassword = document.getElementById('newPassword')?.value;
            const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;

            if (!currentPassword || !newPassword || !confirmNewPassword) {
                alert("Please fill in all fields.");
                return;
            }

            if (newPassword !== confirmNewPassword) {
                alert("New passwords do not match.");
                return;
            }

            console.log("Attempting to change password...");
            // TODO: Implement actual API call
            alert("Password change requested (simulated).");
            const modalEl = document.getElementById('changePasswordModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modal.hide();
            }
        });
    }

    // Forgot Password Logic
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', function() {
            const resetCode = document.getElementById('resetCode')?.value;
            const newPassword = document.getElementById('resetNewPassword')?.value;
            const confirmNewPassword = document.getElementById('confirmResetNewPassword')?.value;

            if (!resetCode || !newPassword || !confirmNewPassword) {
                alert("Please fill in all fields.");
                return;
            }

            if (newPassword !== confirmNewPassword) {
                alert("New passwords do not match.");
                return;
            }

            console.log("Attempting to reset password with code:", resetCode);
            // TODO: Implement actual API call
            alert("Password reset requested (simulated).");
            const modalEl = document.getElementById('forgotPasswordModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modal.hide();
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileSettings);
} else {
    initProfileSettings();
}
