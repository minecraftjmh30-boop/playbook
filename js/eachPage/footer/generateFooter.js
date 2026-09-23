function renderFooter() {
    const footer = document.querySelector('body > footer') || document.querySelector('footer');
    if (footer) {
        const date = new Date().getFullYear();
        footer.innerHTML = `<p>Jack Hackett | ${date}</p>`;
        footer.classList.add('text-center', 'bg-primary-subtle');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter);
} else {
    renderFooter();
}