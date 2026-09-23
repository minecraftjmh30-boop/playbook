
let isDarkMode;

function initDarkMode() {
    isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}
