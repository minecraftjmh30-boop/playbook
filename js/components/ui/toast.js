const ToastComponent = {
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
            const index = this.toasts.findIndex(t => t.id === id);
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
    },
    template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;">
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
    `
};

// Global toast instance
let toastInstance = null;

function initToast() {
    if (toastInstance) return toastInstance;
    
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    
    const app = Vue.createApp(ToastComponent);
    toastInstance = app.mount(container);
    
    return toastInstance;
}

// Make toast available globally
if (typeof window !== 'undefined') {
    window.toast = {
        show: function(message, type = 'info', duration = 3000) {
            if (!toastInstance) initToast();
            toastInstance.show(message, type, duration);
        },
        success: function(message, duration = 3000) {
            if (!toastInstance) initToast();
            toastInstance.success(message, duration);
        },
        error: function(message, duration = 3000) {
            if (!toastInstance) initToast();
            toastInstance.error(message, duration);
        },
        warning: function(message, duration = 3000) {
            if (!toastInstance) initToast();
            toastInstance.warning(message, duration);
        },
        info: function(message, duration = 3000) {
            if (!toastInstance) initToast();
            toastInstance.info(message, duration);
        }
    };
}

if (typeof Vue !== 'undefined' && Vue.createApp) {
    const originalCreateApp = Vue.createApp;
    Vue.createApp = function(...args) {
        const app = originalCreateApp.apply(this, args);
        app.component('toast-component', ToastComponent);
        return app;
    };
}
