function renderFooter() {
    const footer = document.querySelector('body > footer') || document.querySelector('footer');
    if (footer) {
        if (document.body) {
            document.body.classList.add('d-flex', 'flex-column', 'min-vh-100');
        }
        const date = new Date().getFullYear();
        footer.innerHTML = `<p class="mb-0">Jack Hackett | ${date}</p>`;
        footer.classList.remove('mt-5', 'mt-4');
        footer.classList.add('text-center', 'bg-primary-subtle', 'py-4', 'mt-auto');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter);
} else {
    renderFooter();
}