<template>
    <div v-if="show" class="modal fade show d-block modal-overlay" tabindex="-1" @click.self="close">
        <div class="modal-dialog" :class="dialogClass">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button type="button" class="btn-close" @click="close"></button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div v-if="$slots.footer" class="modal-footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * Reusable modal backdrop with header, close button, and slotted body/footer.
 * Replaces the repeated `modal-overlay` markup found in 7+ files.
 */
export default {
    name: 'BaseModal',
    props: {
        /** Whether the modal is currently visible. */
        show: {
            type: Boolean,
            default: false
        },
        /** Title text shown in the modal header. */
        title: {
            type: String,
            default: ''
        },
        /** Additional CSS classes for the modal-dialog element (e.g. 'modal-dialog-centered'). */
        dialogClass: {
            type: String,
            default: ''
        }
    },
    emits: ['close'],
    methods: {
        /** Close the modal by emitting the close event. */
        close() {
            this.$emit('close');
        }
    }
};
</script>
