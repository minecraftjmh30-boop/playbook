<template>
    <div class="d-flex flex-column min-vh-100">
        <AppHeader></AppHeader>
        <header class="bg-primary text-white py-3 mb-4">
            <div class="container"><h1 v-if="isEditMode">Edit Huddle</h1><h1 v-else>Create a New Huddle</h1></div>
        </header>
        <main class="container flex-grow-1">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card shadow">
                        <div class="card-body">
                            <form @submit.prevent="handleSubmit" novalidate>
                                <div class="mb-3">
                                    <label for="name" class="form-label">Huddle Name</label>
                                    <input type="text" class="form-control" :class="{'is-invalid': submitted && formErrors.name, 'is-valid': submitted && !formErrors.name && huddle.name}" id="name" v-model="huddle.name" required minlength="3" placeholder="Enter huddle name">
                                    <div class="invalid-feedback">{{ formErrors.name }}</div>
                                </div>
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description</label>
                                    <textarea class="form-control" :class="{'is-invalid': submitted && formErrors.description, 'is-valid': submitted && !formErrors.description && huddle.description}" id="description" rows="3" v-model="huddle.description" required placeholder="Enter huddle description"></textarea>
                                    <div class="invalid-feedback">{{ formErrors.description }}</div>
                                </div>
                                <div class="mb-3">
                                    <label for="location" class="form-label">Location</label>
                                    <input type="text" class="form-control" :class="{'is-invalid': submitted && formErrors.location, 'is-valid': submitted && !formErrors.location && huddle.location}" id="location" v-model="huddle.location" required placeholder="Enter location">
                                    <div class="invalid-feedback">{{ formErrors.location }}</div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3"><label for="startDate" class="form-label">Time Frame Start (Optional)</label><input type="datetime-local" class="form-control" id="startDate" v-model="huddle.startDate"></div>
                                    <div class="col-md-6 mb-3"><label for="endDate" class="form-label">Time Frame End (Optional)</label><input type="datetime-local" class="form-control" id="endDate" v-model="huddle.endDate"></div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <a href="#" @click.prevent="cancel" class="btn btn-secondary">Cancel</a>
                                    <button v-if="isEditMode" type="submit" class="btn btn-warning">Update Huddle</button>
                                    <button v-else type="submit" class="btn btn-success">Create Huddle</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <AppFooter></AppFooter>
        <ToastComponent ref="toast" />
    </div>
</template>

<script>
import { getCookie, sanitizeInput } from '../../core/utils.js';
import { provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const ToastKey = Symbol('toast');
import AppHeader from '../../components/main/AppHeader.vue';
import AppFooter from '../../components/main/AppFooter.vue';
import ToastComponent from '../../components/ui/Toast.vue';

export default {
    name: 'CreateHuddlePage',
    components: { AppHeader, AppFooter, ToastComponent },
    setup() {
        const toast = ref(null);
        const route = useRoute();
        const router = useRouter();
        provide(ToastKey, toast);
        return { toast, route, router };
    },
    data() {
        const editId = this.route.query.id;
        
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
                this.toast.error('Please fill in all required fields correctly.');
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
                    this.toast.success(`Huddle "${sanitizedName}" updated successfully!`);
                    setTimeout(() => {
                        this.router.push({ path: '/huddle', query: { id: this.editId } });
                    }, 1000);
                } else {
                    this.toast.error('You can only edit huddles you own.');
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
                
                this.toast.success(`Huddle "${sanitizedName}" created successfully!`);
                setTimeout(() => {
                    this.router.push('/');
                }, 1000);
            }
        },
        cancel() {
            this.router.push('/');
        }
    }
};
</script>