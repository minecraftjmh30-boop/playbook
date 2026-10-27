<template>
    <section class="row justify-content-center gap-2 mb-4" id="tools">
        <button type="button" id="freeBtn" class="btn btn-success col-auto px-4 rounded-pill" :class="{ active: mode === 'free' }" @click="$emit('set-mode', 'free')">Quick Free</button>
        <button type="button" id="busyBtn" class="btn btn-danger col-auto px-4 rounded-pill" :class="{ active: mode === 'busy' }" @click="$emit('set-mode', 'busy')">Quick Busy</button>
        <button type="button" id="removeBtn" class="btn btn-secondary col-auto px-4 rounded-pill" :class="{ active: mode === 'remove' }" @click="$emit('set-mode', 'remove')">Quick Remove</button>
    </section>
</template>

<script>
export default {
    name: 'ScheduleTools',
    props: {
        mode: {
            type: String,
            default: null
        }
    },
    emits: ['set-mode'],
};
</script>

<style lang="scss" scoped>
#freeBtn.active { box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.5); }
#busyBtn.active { box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.5); }
#removeBtn.active { box-shadow: 0 0 0 0.25rem rgba(108, 117, 125, 0.5); }
</style>