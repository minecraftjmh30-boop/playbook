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
            friendCode: '',
            // Huddle invitations
            myHuddles: [],
            pendingInvitations: [],
            joinHuddleCode: ''
        };
    },
    async mounted() {
        // Smooth scroll for navigation links
        document.querySelectorAll('.profile-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, '', `#${targetId}`);
                }
            });
        });
        await this.loadUserData();
        await this.loadHuddleData();
    },
    methods: {
        async loadUserData() {
            const userId = getCookie('currentUser') || 'User1';
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
        async loadHuddleData() {
            const userId = getCookie('currentUser') || 'User1';
            const huddles = JSON.parse(localStorage.getItem('huddles')) || [];
            const invitations = JSON.parse(localStorage.getItem(`invitations_${userId}`)) || [];

            // Huddles where user is a participant
            this.myHuddles = huddles.filter(h =>
                h.owner === userId ||
                (h.participants && h.participants.includes(userId))
            );

            // Pending invitations for this user
            this.pendingInvitations = invitations.filter(inv => inv.to === userId);
        },
        acceptInvitation(invitation) {
            const huddles = JSON.parse(localStorage.getItem('huddles')) || [];
            const huddle = huddles.find(h => h.id === invitation.huddleId);
            if (huddle) {
                if (!huddle.participants) {
                    huddle.participants = [huddle.owner];
                }
                const userId = getCookie('currentUser') || 'User1';
                if (!huddle.participants.includes(userId)) {
                    huddle.participants.push(userId);
                }
                localStorage.setItem('huddles', JSON.stringify(huddles));

                // Remove invitation
                this.removeInvitation(invitation);
                this.loadHuddleData();
            }
        },
        declineInvitation(invitation) {
            this.removeInvitation(invitation);
            this.loadHuddleData();
        },
        removeInvitation(invitation) {
            const userId = getCookie('currentUser') || 'User1';
            let invitations = JSON.parse(localStorage.getItem(`invitations_${userId}`)) || [];
            invitations = invitations.filter(inv => inv.id !== invitation.id);
            localStorage.setItem(`invitations_${userId}`, JSON.stringify(invitations));
        },
        joinHuddleFromProfile() {
            if (!this.joinHuddleCode.trim()) return;

            const huddles = JSON.parse(localStorage.getItem('huddles')) || [];
            const huddle = huddles.find(h => h.code === this.joinHuddleCode.trim());
            if (huddle) {
                const userId = getCookie('currentUser') || 'User1';
                if (!huddle.participants) {
                    huddle.participants = [huddle.owner];
                }
                if (!huddle.participants.includes(userId)) {
                    huddle.participants.push(userId);
                }
                localStorage.setItem('huddles', JSON.stringify(huddles));
                this.joinHuddleCode = '';
                this.loadHuddleData();
                alert(`Joined "${huddle.name}"!`);
            } else {
                alert('Invalid huddle code!');
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
