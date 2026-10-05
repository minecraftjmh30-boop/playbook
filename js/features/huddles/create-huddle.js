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
            huddle: {
                name: '',
                description: '',
                location: '',
                startDate: '',
                endDate: ''
            }
        };
    },
    methods: {
        handleSubmit() {
            if (this.huddle.name && this.huddle.description) {
                const currentUser = getCookie('currentUser') || 'Anonymous';
                const huddles = JSON.parse(localStorage.getItem('huddles')) || [];
                
                const newId = huddles.length > 0 ? Math.max(...huddles.map(h => h.id)) + 1 : 1;
                const newCode = Math.random().toString(36).substring(2, 7).toUpperCase();
                
                // Creating a new huddle with the owner as the only participant
                const newHuddle = {
                    id: newId,
                    name: this.huddle.name,
                    description: this.huddle.description,
                    location: this.huddle.location || 'Virtual',
                    status: 'Online',
                    code: newCode,
                    owner: currentUser,
                    startDate: this.huddle.startDate || null,
                    endDate: this.huddle.endDate || null,
                    participants: [currentUser] // Owner is the only participant initially (task #9)
                };
                
                huddles.push(newHuddle);
                localStorage.setItem('huddles', JSON.stringify(huddles));
                
                alert(`Huddle "${this.huddle.name}" created successfully!`);
                window.location.href = 'index.html';
            } else {
                alert('Please fill in all fields.');
            }
        }
    }
}).mount('#app');