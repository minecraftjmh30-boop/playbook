const { createApp } = Vue;

// Helper to get cookie
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

createApp({
    data() {
        return {
            userInfo: {
                name: 'Loading...',
                email: '',
                dateJoined: ''
            },
            friends: [],
            pendingRequests: [],
            friendCode: ''
        };
    },
    async mounted() {
        this.activateTabFromHash();
        window.addEventListener('hashchange', () => this.activateTabFromHash());
        await this.loadUserData();
    },
    methods: {
        activateTabFromHash() {
            const hash = window.location.hash;
            if (hash) {
                const tabId = hash.substring(1);
                const tabTriggerEl = document.querySelector(`#${tabId}`);
                if (tabTriggerEl && typeof bootstrap !== 'undefined') {
                    const tab = bootstrap.Tab.getOrCreateInstance(tabTriggerEl);
                    tab.show();
                }
            }
        },
        async loadUserData() {
            const userId = getCookie('currentUser') || 'User1'; // Default to User1 if no cookie
            try {
                const response = await fetch(`/debug/debugLogins/${userId}/userInfo.json`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                }
                const data = await response.json();
                
                this.userInfo = {
                    name: data.name,
                    email: data.email,
                    dateJoined: data.dateJoined
                };
                this.friendCode = data.friendCode;
                this.friends = data.friends.map(fName => ({ id: fName, name: fName }));
                
            } catch (error) {
                console.error('Error loading user data:', error);
                this.userInfo = {
                    name: 'Error loading user',
                    email: '',
                    dateJoined: ''
                };
            }
        },
        removeFriend(id) {
            if (confirm('Are you sure you want to remove this friend?')) {
                this.friends = this.friends.filter(f => f.id !== id);
            }
        },
        handlePendingRequest(id, action) {
            if (action === 'add') {
                const friend = this.pendingRequests.find(p => p.id === id);
                if (friend) {
                    this.friends.push({ id: friend.name, name: friend.name });
                    this.pendingRequests = this.pendingRequests.filter(p => p.id !== id);
                }
            } else {
                this.pendingRequests = this.pendingRequests.filter(p => p.id !== id);
            }
        },
        addFriend(code) {
            if (code && code.trim()) {
                alert(`Friend request sent to: ${code.trim()}`);
            }
        }
    }
}).mount('#app');
