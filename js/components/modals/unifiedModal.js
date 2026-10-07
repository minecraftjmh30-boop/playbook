const UnifiedModal = {
    name: 'UnifiedModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'Modal'
        },
        fields: {
            type: Array,
            default: () => []
        },
        submitText: {
            type: String,
            default: 'Submit'
        }
    },
    emits: ['close', 'submit', 'update:show'],
    data() {
        const values = {};
        this.fields.forEach(f => { values[f.id] = ''; });
        return {
            values
        };
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.fields.forEach(f => { this.values[f.id] = f.default || ''; });
            }
        }
    },
    methods: {
        handleClose() {
            this.$emit('update:show', false);
            this.$emit('close');
        },
        handleSubmit() {
            // Validate required fields
            for (const field of this.fields) {
                if (field.required && !this.values[field.id].trim()) {
                    window.toast.error(`Please fill in ${field.label}.`);
                    return;
                }
            }
            this.$emit('submit', { ...this.values });
            this.handleClose();
        }
    },
    template: `
    <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button type="button" class="btn-close" @click="handleClose"></button>
                </div>
                <div class="modal-body">
                    <div v-for="field in fields" :key="field.id" class="mb-3">
                        <label class="form-label">{{ field.label }}</label>
                        <input 
                            v-if="field.type === 'text' || field.type === 'password' || field.type === 'email'"
                            :type="field.type" 
                            class="form-control" 
                            :placeholder="field.placeholder"
                            v-model="values[field.id]"
                            @keyup.enter="handleSubmit">
                        <textarea 
                            v-else-if="field.type === 'textarea'"
                            class="form-control"
                            :rows="field.rows || 3"
                            :placeholder="field.placeholder"
                            v-model="values[field.id]">
                        </textarea>
                        <select 
                            v-else-if="field.type === 'select'"
                            class="form-select"
                            v-model="values[field.id]">
                            <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="handleClose">Cancel</button>
                    <button type="button" class="btn btn-primary" @click="handleSubmit">{{ submitText }}</button>
                </div>
            </div>
        </div>
    </div>
    `
};

if (typeof window !== 'undefined') {
    window.UnifiedModal = UnifiedModal;
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('unified-modal', UnifiedModal);
        return app;
    };
}
