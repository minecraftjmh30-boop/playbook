<template>
    <BaseModal :show="show" :title="title" @close="close">
        <p>{{ message }}</p>
        <template #footer>
            <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
            <button type="button" :class="confirmButtonClass" @click="confirm">{{ confirmText }}</button>
        </template>
    </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue';

/**
 * Generic confirmation dialog built on BaseModal.
 *
 * Controlled programmatically via a ref: call `open({ title, message, confirmText, variant, onConfirm })`
 * to display the dialog, and listen for the `confirm` event or use the callback.
 *
 * Replaces the duplicated confirm-modal markup and state in HomePage, HuddlePage, and ProfilePage.
 *
 * Usage in a parent component:
 *   <ConfirmModal ref="confirm" />
 *   this.$refs.confirm.open({ title, message, onConfirm });
 */
export default {
    name: 'ConfirmModal',
    components: { BaseModal },
    data() {
        return {
            show: false,
            title: '',
            message: '',
            confirmText: 'Confirm',
            /** Button variant: 'danger', 'primary', etc. Defaults to 'danger'. */
            variant: 'danger',
            /** Callback invoked when the user confirms. */
            onConfirm: null
        };
    },
    computed: {
        confirmButtonClass() {
            return `btn btn-${this.variant}`;
        }
    },
    emits: ['confirm'],
    methods: {
        /**
         * Display the confirmation dialog.
         * @param {object} options
         * @param {string} options.title - Dialog title.
         * @param {string} options.message - Body text.
         * @param {string} [options.confirmText='Confirm'] - Label on the confirm button.
         * @param {string} [options.variant='danger'] - Button color variant (e.g. 'danger', 'primary').
         * @param {Function} [options.onConfirm] - Callback when the user clicks confirm.
         */
        open({ title, message, confirmText = 'Confirm', variant = 'danger', onConfirm = null } = {}) {
            this.title = title;
            this.message = message;
            this.confirmText = confirmText;
            this.variant = variant;
            this.onConfirm = onConfirm;
            this.show = true;
        },
        close() {
            this.show = false;
            this.onConfirm = null;
        },
        confirm() {
            if (this.onConfirm) {
                this.onConfirm();
            }
            this.$emit('confirm');
            this.close();
        }
    }
};
</script>
