const { createApp } = Vue;

createApp({
    data() {
        return {
            huddle: {
                name: '',
                description: '',
                location: '',
                startDate: '',
                endDate: ''
            },
            formErrors: {
                name: '',
                description: '',
                location: ''
            },
            submitted: false
        };
    },
    methods: {
        validateForm() {
            let isValid = true;
            this.formErrors = { name: '', description: '', location: '' };
            
            // Validate name
            if (!this.huddle.name || !this.huddle.name.trim()) {
                this.formErrors.name = 'Huddle name is required.';
                isValid = false;
            } else if (this.huddle.name.trim().length < 3) {
                this.formErrors.name = 'Name must be at least 3 characters.';
                isValid = false;
            }
            
            // Validate description
            if (!this.huddle.description || !this.huddle.description.trim()) {
                this.formErrors.description = 'Description is required.';
                isValid = false;
            }
            
            // Validate location
            if (!this.huddle.location || !this.huddle.location.trim()) {
                this.formErrors.location = 'Location is required.';
                isValid = false;
            }
            
            return isValid;
        },
        handleSubmit() {
            this.submitted = true;
            
            if (!this.validateForm()) {
                window.toast.error('Please fill in all required fields correctly.');
                return;
            }
            
            const currentUser = window.utils.getCookie('currentUser') || 'Anonymous';
            const huddles = JSON.parse(localStorage.getItem('huddles')) || [];
            
            const newId = huddles.length > 0 ? Math.max(...huddles.map(h => h.id)) + 1 : 1;
            const newCode = Math.random().toString(36).substring(2, 7).toUpperCase();
            
            // Sanitize inputs
            const sanitizedName = window.utils.sanitizeInput(this.huddle.name.trim());
            const sanitizedDescription = window.utils.sanitizeInput(this.huddle.description.trim());
            const sanitizedLocation = window.utils.sanitizeInput(this.huddle.location.trim());
            
            // Creating a new huddle with the owner as the only participant
            const newHuddle = {
                id: newId,
                name: sanitizedName,
                description: sanitizedDescription,
                location: sanitizedLocation || 'Virtual',
                status: 'Online',
                code: newCode,
                owner: currentUser,
                startDate: this.huddle.startDate || null,
                endDate: this.huddle.endDate || null,
                participants: [currentUser],
                messages: [],
                selectedDates: []
            };
            
            huddles.push(newHuddle);
            localStorage.setItem('huddles', JSON.stringify(huddles));
            
            window.toast.success(`Huddle "${sanitizedName}" created successfully!`);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }
}).mount('#app');