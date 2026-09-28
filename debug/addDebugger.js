/**
 * Debugger script to switch between users for testing purposes.
 * This script adds a dropdown menu to the page to switch between User1, User2, User3, and User4.
 * Switching users updates a cookie and the corresponding userInfo.json file.
 */

(function() {
    const users = [
        { id: 'User1', name: 'User 1', email: 'user1@example.com', dateJoined: '2026-01-01', friends: ['User2', 'User3'], friendCode: 'U1-ABC' },
        { id: 'User2', name: 'User 2', email: 'user2@example.com', dateJoined: '2026-02-01', friends: ['User1', 'User4'], friendCode: 'U2-DEF' },
        { id: 'User3', name: 'User 3', email: 'user3@example.com', dateJoined: '2026-03-01', friends: ['User1', 'User2'], friendCode: 'U3-GHI' },
        { id: 'User4', name: 'User 4', email: 'user4@example.com', dateJoined: '2026-04-01', friends: ['User2', 'User3'], friendCode: 'U4-JKL' }
    ];

    function createDebuggerUI() {
        const debuggerDiv = document.createElement('div');
        debuggerDiv.id = 'debug-user-switcher';
        debuggerDiv.style.position = 'fixed';
        debuggerDiv.style.top = '10px';
        debuggerDiv.style.right = '10px';
        debuggerDiv.style.zIndex = '9999';
        debuggerDiv.style.padding = '10px';
        debuggerDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        debuggerDiv.style.color = 'white';
        debuggerDiv.style.borderRadius = '5px';
        debuggerDiv.style.fontSize = '14px';

        const label = document.createElement('label');
        label.textContent = 'Switch User: ';
        label.style.marginRight = '5px';
        debuggerDiv.appendChild(label);

        const select = document.createElement('select');
        select.id = 'user-select';
        select.className = 'form-select form-select-sm';
        select.style.width = 'auto';
        select.style.display = 'inline-block';

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            switchUser(e.target.value);
        });

        debuggerDiv.appendChild(select);
        document.body.appendChild(debuggerDiv);

        // Initialize based on current cookie if exists
        const currentUserId = getCookie('currentUser');
        if (currentUserId && users.find(u => u.id === currentUserId)) {
            select.value = currentUserId;
        }
    }

    function switchUser(userId) {
        console.log(`Switching to user: ${userId}`);
        setCookie('currentUser', userId, 7);
        
        // In a real application, this might involve a fetch request to an API
        // to update the server-side state or reload the page.
        // For this debug task, we'll just log it and reload.
        location.reload();
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Initialize the UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDebuggerUI);
    } else {
        createDebuggerUI();
    }
})();
