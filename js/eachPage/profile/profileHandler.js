function activateTabFromHash() {
    const hash = window.location.hash;
    if (hash) {
        // Remove the '#' from the hash to get the element ID
        const tabId = hash.substring(1);
        const tabTriggerEl = document.querySelector(`#${tabId}`);
        
        if (tabTriggerEl && typeof bootstrap !== 'undefined') {
            const tab = bootstrap.Tab.getOrCreateInstance(tabTriggerEl);
            tab.show();
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        activateTabFromHash();
        window.addEventListener('hashchange', activateTabFromHash);
    });
} else {
    activateTabFromHash();
    window.addEventListener('hashchange', activateTabFromHash);
}
