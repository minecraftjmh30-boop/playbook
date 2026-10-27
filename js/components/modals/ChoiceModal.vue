<template>
    <div v-if="show" class="modal fade show d-block modal-overlay" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">What would you like to do?</h5>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>
                <div class="modal-body text-center">
                    <p>Choose an option to proceed.</p>
                    <div class="d-flex justify-content-center gap-3">
                        <router-link to="/create-huddle" class="btn btn-primary">Create Huddle</router-link>
                        <button class="btn btn-secondary" @click="$emit('open-join')">Join Huddle</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChoiceModal',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close', 'open-join'],
};
</script>

<style scoped>
.modal-overlay {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>