const { createApp } = Vue;

createApp({
    data() {
        return {
            // Remove static huddles - only load from localStorage
            allHuddles: JSON.parse(localStorage.getItem('huddles')) || [],
            showChoiceModal: false,
            showJoinModal: false,
            joinCode: '',
            currentUser: window.utils.getCookie('currentUser') || null,
            showMyHuddlesOnly: false
        };
    },
    computed: {
        huddles() {
            // Filter to only show huddles the user is a part of (owner or participant)
            if (!this.currentUser) {
                return [];
            }
            
            return this.allHuddles.filter(h =>
                h.owner === this.currentUser ||
                (h.participants && h.participants.includes(this.currentUser))
            );
        }
    },
    methods: {
        openJoinModal() {
            this.showJoinModal = true;
        },
        joinHuddle() {
            // Sanitize and trim the join code
            const code = window.utils.sanitizeInput(this.joinCode.trim());
            if (!code) {
                window.toast.error('Please enter a huddle code.');
                return;
            }
            
            const huddle = this.allHuddles.find(r => r.code === code);
            if (huddle) {
                // Add current user as participant if not already
                if (!huddle.participants) {
                    huddle.participants = [huddle.owner];
                }
                if (this.currentUser && !huddle.participants.includes(this.currentUser)) {
                    huddle.participants.push(this.currentUser);
                    // Add join system message to chat
                    if (!huddle.messages) huddle.messages = [];
                    huddle.messages.push({
                        user: 'System',
                        text: `${this.currentUser} joined the huddle.`,
                        time: new Date().toLocaleTimeString(),
                        system: true
                    });
                    window.toast.success(`Successfully joined "${huddle.name}"!`);
                } else {
                    window.toast.info('You are already a member of this huddle.');
                }
                localStorage.setItem('huddles', JSON.stringify(this.allHuddles));
                this.showJoinModal = false;
                this.joinCode = '';
                window.location.href = `huddle.html?id=${huddle.id}`;
            } else {
                window.toast.error('Invalid huddle code!');
            }
        },
        editHuddle(huddle) {
            // Only the owner should be able to edit
            if (this.currentUser && huddle.owner === this.currentUser) {
                const newName = prompt('Edit huddle name:', huddle.name);
                if (newName !== null && newName.trim() !== '') {
                    // Sanitize the new name
                    huddle.name = window.utils.sanitizeInput(newName.trim());
                    localStorage.setItem('huddles', JSON.stringify(this.allHuddles));
                    window.toast.success('Huddle name updated successfully!');
                }
            } else {
                window.toast.error('You must be the owner to edit this huddle.');
            }
        },
        deleteHuddle(id) {
            const huddleToDelete = this.allHuddles.find(h => h.id === id);
            if (!huddleToDelete) return;

            // Only the owner should be able to delete
            if (this.currentUser && huddleToDelete.owner === this.currentUser) {
                if (confirm('Are you sure you want to delete this huddle?')) {
                    this.allHuddles = this.allHuddles.filter(huddle => huddle.id !== id);
                    localStorage.setItem('huddles', JSON.stringify(this.allHuddles));
                    window.toast.success('Huddle deleted successfully!');
                }
            } else {
                window.toast.error('You must be the owner to delete this huddle.');
            }
        },
        leaveHuddle(huddle) {
            if (confirm(`Leave "${huddle.name}"?`)) {
                if (huddle.participants) {
                    huddle.participants = huddle.participants.filter(id => id !== this.currentUser);
                    // Add leave system message to chat
                    if (!huddle.messages) huddle.messages = [];
                    huddle.messages.push({
                        user: 'System',
                        text: `${this.currentUser} left the huddle.`,
                        time: new Date().toLocaleTimeString(),
                        system: true
                    });
                    window.toast.info(`You have left "${huddle.name}".`);
                }
                localStorage.setItem('huddles', JSON.stringify(this.allHuddles));
            }
        },
        toggleMyHuddles() {
            this.showMyHuddlesOnly = !this.showMyHuddlesOnly;
        },
        createHuddle(name, description, location) {
            // Create a new huddle with owner as the only participant
            const newHuddle = {
                id: Date.now(),
                name: name || 'New Huddle',
                description: description || '',
                location: location || 'Virtual',
                status: 'Planning',
                owner: this.currentUser,
                code: Math.floor(1000 + Math.random() * 9000).toString(),
                startDate: null,
                endDate: null,
                participants: [this.currentUser],
                messages: [],
                selectedDates: []
            };

            this.allHuddles.push(newHuddle);
            localStorage.setItem('huddles', JSON.stringify(this.allHuddles));
            window.location.href = `huddle.html?id=${newHuddle.id}`;
        }
    }
}).mount('#app');
