// Shared utility functions to avoid code duplication

/**
 * Format a date string to a readable format
 * @param {string} dateStr - Date string in format "YYYY-M-D" or "YYYY-MM-DD"
 * @returns {string} Formatted date like "Jan 15, 2024"
 */
function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split(/[-/]/);
    if (parts.length >= 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        const date = new Date(year, month, day);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return dateStr;
}

/**
 * Sanitize input to prevent XSS attacks
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    // Remove HTML tags to prevent XSS
    // Note: Vue's {{ }} interpolation automatically escapes special characters,
    // so we only need to strip HTML tags here.
    return input.replace(/<[^>]*>/g, '');
}

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Make utilities available globally
if (typeof window !== 'undefined') {
    window.utils = {
        formatDate,
        sanitizeInput,
        getCookie
    };
}
