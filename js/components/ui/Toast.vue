<template>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div v-for="toast in toasts" :key="toast.id"
             class="toast show align-items-center border-0 mb-2"
             :class="'bg-' + toast.type"
             role="alert"
             aria-live="assertive"
             aria-atomic="true">
            <div class="d-flex">
                <div class="toast-text text-white">
                    {{ toast.message }}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="hide(toast.id)"></button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ToastComponent',
    data() {
        return {
            toasts: []
        };
    },
    methods: {
        show(message, type = 'info', duration = 3000) {
            const id = Date.now();
            this.toasts.push({ id, message, type });

            if (duration > 0) {
                setTimeout(() => {
                    this.hide(id);
                }, duration);
            }
        },
        hide(id) {
            const index = this.toasts.findIndex(toast => toast.id === id);
            if (index !== -1) {
                this.toasts.splice(index, 1);
            }
        },
        success(message, duration = 3000) {
            this.show(message, 'success', duration);
        },
        error(message, duration = 3000) {
            this.show(message, 'danger', duration);
        },
        warning(message, duration = 3000) {
            this.show(message, 'warning', duration);
        },
        info(message, duration = 3000) {
            this.show(message, 'info', duration);
        }
    }
};
</script>

<style scoped>
.toast-container {
    z-index: 9999;
}
</style>