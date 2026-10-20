const AppFooter = {
    name: 'AppFooter',
    template: `
    <footer class="text-center bg-primary-subtle py-4 mt-auto">
        <p class="mb-0">Jack Hackett | {{ currentYear }}</p>
    </footer>
    `,
    data() {
        return {
            currentYear: new Date().getFullYear()
        };
    }
};
export { AppFooter };