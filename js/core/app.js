const { createApp } = Vue;

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

createApp({
    data() {
        return {
            allHuddles: JSON.parse(localStorage.getItem('huddles')) || [
                { id: 1, name: 'Virtual Huddle #123', description: 'This is a huddle where users can collaborate and chat. The schedule shows upcoming events for this huddle.', status: 'Planning', location: 'Virtual', friends: '', code: '123', owner: 'User1', participants: ['User1'], messages: [], selectedDates: [] },
                { id: 2, name: 'Design Workshop', description: 'Collaborative design session for the upcoming project.', status: 'Completed', location: 'Workshop', friends: '', code: '456', owner: 'User2', participants: ['User2'], messages: [], selectedDates: [] }
            ],
            showChoiceModal: false,
            showJoinModal: false,
            joinCode: '',
            currentUser: getCookie('currentUser') || null,
            showMyHuddlesOnly: false
        };
    },
    computed: {
        huddles() {
            if (this.showMyHuddlesOnly && this.currentUser) {
                return this.allHuddles.filter(h =>
                    h.owner === this.currentUser ||
                    (h.participants && h.participants.includes(this.currentUser))
                );
            }
            return this.allHuddles;
        }
    },
    methods: {
        openJoinModal() {
            this.showJoinModal = true;
        },
        joinHuddle() {
            const huddle = this.allHuddles.find(r => r.code === this.joinCode);
            if (huddle) {
                // Add current user as participant if not already
                if (!huddle.participants) {
                    huddle.participants = [huddle.owner];
                }
                if (this.currentUser && !huddle.participants.includes(this.currentUser)) {
                    huddle.participants.push(this.currentUser);
                }
                localStorage.setItem('huddles', JSON.stringify(this.allHuddles));
                this.showJoinModal = false;
                this.joinCode = '';
                window.location.href = `huddle.html?id=${huddle.id}`;
            } else {
                alert('Invalid huddle code!');
            }
        },
        editHuddle(huddle) {
            // Only the owner should be able to edit
            if (this.currentUser && huddle.owner === this.currentUser) {
                const newName = prompt('Edit huddle name:', huddle.name);
                if (newName !== null && newName.trim() !== '') {
                    huddle.name = newName.trim();
                    localStorage.setItem('huddles', JSON.stringify(this.allHuddles));
                }
            } else {
                alert('You must be the owner to edit this huddle.');
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
                }
            } else {
                alert('You must be the owner to delete this huddle.');
            }
        },
        leaveHuddle(huddle) {
            if (confirm(`Leave "${huddle.name}"?`)) {
                if (huddle.participants) {
                    huddle.participants = huddle.participants.filter(id => id !== this.currentUser);
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
