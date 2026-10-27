<template>
    <footer class="text-center bg-primary-subtle py-4 mt-auto">
        <p class="mb-0">Jack Hackett | {{ currentYear }}</p>
    </footer>
</template>

<script>
export default {
    name: 'AppFooter',
    data() {
        return {
            currentYear: new Date().getFullYear()
        };
    }
};
</script>