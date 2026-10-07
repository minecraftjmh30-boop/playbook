const { createApp } = Vue;

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
        await this.loadUserData();
        await this.loadHuddleData();
        
        // Smooth scroll for navigation links - set up after Vue renders
        await this.$nextTick(() => {
            document.querySelectorAll('.profile-nav a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({behavior: 'smooth', block: 'start'});
                        window.history.pushState(null, '', `#${targetId}`);
                    }
                });
            });
        });
        
        // Handle initial hash in URL
        if (window.location.hash) {
            await this.$nextTick(() => {
                const targetEl = document.getElementById(window.location.hash.substring(1));
                if (targetEl) {
                    setTimeout(() => {
                        targetEl.scrollIntoView({behavior: 'smooth', block: 'start'});
                    }, 100);
                }
            });
        }
    },
    methods: {
        async loadUserData() {
            const userId = window.utils.getCookie('currentUser') || 'User1';
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
            const userId = window.utils.getCookie('currentUser') || 'User1';
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
                const userId = window.utils.getCookie('currentUser') || 'User1';
                if (!huddle.participants.includes(userId)) {
                    huddle.participants.push(userId);
                }
                localStorage.setItem('huddles', JSON.stringify(huddles));

                // Remove invitation
                this.removeInvitation(invitation);
                this.loadHuddleData();
                window.toast.success(`You accepted the invitation to "${huddle.name}".`);
            }
        },
        declineInvitation(invitation) {
            this.removeInvitation(invitation);
            this.loadHuddleData();
            window.toast.info('Invitation declined.');
        },
        removeInvitation(invitation) {
            const userId = window.utils.getCookie('currentUser') || 'User1';
            let invitations = JSON.parse(localStorage.getItem(`invitations_${userId}`)) || [];
            invitations = invitations.filter(inv => inv.id !== invitation.id);
            localStorage.setItem(`invitations_${userId}`, JSON.stringify(invitations));
        },
        joinHuddleFromProfile() {
            const code = window.utils.sanitizeInput(this.joinHuddleCode.trim());
            if (!code) {
                window.toast.error('Please enter a huddle code.');
                return;
            }

            const huddles = JSON.parse(localStorage.getItem('huddles')) || [];
            const huddle = huddles.find(h => h.code === code);
            if (huddle) {
                const userId = window.utils.getCookie('currentUser') || 'User1';
                if (!huddle.participants) {
                    huddle.participants = [huddle.owner];
                }
                if (!huddle.participants.includes(userId)) {
                    huddle.participants.push(userId);
                }
                localStorage.setItem('huddles', JSON.stringify(huddles));
                this.joinHuddleCode = '';
                this.loadHuddleData();
                window.toast.success(`Joined "${huddle.name}"!`);
            } else {
                window.toast.error('Invalid huddle code!');
            }
        },
        removeFriend(id) {
            if (confirm('Are you sure you want to remove this friend?')) {
                this.friends = this.friends.filter(f => f.id !== id);
                window.toast.info('Friend removed.');
            }
        },
        handlePendingRequest(id, action) {
            if (action === 'add') {
                const friend = this.pendingRequests.find(p => p.id === id);
                if (friend) {
                    this.friends.push({ id: friend.name, name: friend.name });
                    this.pendingRequests = this.pendingRequests.filter(p => p.id !== id);
                    window.toast.success(`Friend request from ${friend.name} accepted.`);
                }
            } else {
                this.pendingRequests = this.pendingRequests.filter(p => p.id !== id);
                window.toast.info('Friend request declined.');
            }
        },
        addFriend(code) {
            if (code && code.trim()) {
                const sanitizedCode = window.utils.sanitizeInput(code.trim());
                window.toast.success(`Friend request sent to: ${sanitizedCode}`);
            }
        }
    }
}).mount('#app');
