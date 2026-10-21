import { getCookie, sanitizeInput } from '../../core/utils.js';
import { toast } from '../../components/ui/toast.js';
import { AppHeader } from '../../components/main/header.js';
import { AppFooter } from '../../components/main/footer.js';

const { createApp } = Vue;

createApp({
    data() {
        const urlParams = typeof window !== 'undefined' && window.location ? new URLSearchParams(window.location.search) : null;
        const editId = urlParams ? urlParams.get('id') : null;
        
        const huddles = JSON.parse(localStorage.getItem('huddles')) || [];
        const existingHuddle = editId ? huddles.find(currentHuddle => currentHuddle.id === editId) : null;
        
        return {
            editId: editId,
            huddle: {
                name: existingHuddle ? existingHuddle.name : '',
                description: existingHuddle ? existingHuddle.description : '',
                location: existingHuddle ? existingHuddle.location : '',
                startDate: existingHuddle ? (existingHuddle.startDate || '') : '',
                endDate: existingHuddle ? (existingHuddle.endDate || '') : ''
            },
            formErrors: {
                name: '',
                description: '',
                location: ''
            },
            submitted: false
        };
    },
    computed: {
        isEditMode() {
            return this.editId !== null;
        }
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
                toast.error('Please fill in all required fields correctly.');
                return;
            }
            
            const currentUser = getCookie('currentUser') || 'Anonymous';
            const huddles = JSON.parse(localStorage.getItem('huddles')) || [];
            
            // Sanitize inputs
            const sanitizedName = sanitizeInput(this.huddle.name.trim());
            const sanitizedDescription = sanitizeInput(this.huddle.description.trim());
            const sanitizedLocation = sanitizeInput(this.huddle.location.trim());
            
            if (this.isEditMode) {
                // Update existing huddle
                const index = huddles.findIndex(huddle => huddle.id === this.editId);
                if (index !== -1 && huddles[index].owner === currentUser) {
                    huddles[index].name = sanitizedName;
                    huddles[index].description = sanitizedDescription;
                    huddles[index].location = sanitizedLocation || 'Virtual';
                    huddles[index].startDate = this.huddle.startDate || null;
                    huddles[index].endDate = this.huddle.endDate || null;
                    localStorage.setItem('huddles', JSON.stringify(huddles));
                    toast.success(`Huddle "${sanitizedName}" updated successfully!`);
                    setTimeout(() => {
                        window.location.href = `huddle.html?id=${this.editId}`;
                    }, 1000);
                } else {
                    toast.error('You can only edit huddles you own.');
                }
            } else {
                // Create a new huddle
                const newId = huddles.length > 0 ? Math.max(...huddles.map(huddle => huddle.id)) + 1 : 1;
                const newCode = Math.random().toString(36).substring(2, 7).toUpperCase();
                
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
                
                toast.success(`Huddle "${sanitizedName}" created successfully!`);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        }
    }
}).component('app-header', AppHeader)
  .component('app-footer', AppFooter)
  .mount('#app');