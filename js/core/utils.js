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
 * Set a cookie with a given name and value
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration (default: 30)
 */
function setCookie(name, value, days = 30) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Format a Date object to a date key string "YYYY-M-D"
 * @param {Date} date - Date object
 * @returns {string} Date key string
 */
function getDateKey(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
}

/**
 * Check if two Date objects represent the same calendar day
 * @param {Date} dateOne - First date
 * @param {Date} dateTwo - Second date
 * @returns {boolean} True if same day
 */
function isSameDay(dateOne, dateTwo) {
    return dateOne.getFullYear() === dateTwo.getFullYear() &&
           dateOne.getMonth() === dateTwo.getMonth() &&
           dateOne.getDate() === dateTwo.getDate();
}

/**
 * Create a system message object for chat
 * @param {string} text - Message text
 * @returns {object} System message object
 */
function createSystemMessage(text) {
    return {
        user: 'System',
        text: text,
        time: new Date().toLocaleTimeString(),
        system: true
    };
}

/**
 * Rebuild participants display array from participant IDs
 * @param {Array<string>} participantIds - Array of participant IDs
 * @returns {Array<object>} Array of {name, id} objects
 */
function buildParticipantsDisplay(participantIds) {
    return (participantIds || []).map(id => ({
        name: id,
        id: id
    }));
}

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
    const cookies = document.cookie.split(';');
    const cookieName = `${name}=`;

    for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith(cookieName)) {
            return decodeURIComponent(trimmedCookie.slice(cookieName.length));
        }
    }
    return null;
}

/**
 * Detect the user's color scheme preference and return the Bootstrap theme value.
 * @returns {'dark'|'light'}
 */
function getTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export {
    formatDate,
    sanitizeInput,
    setCookie,
    getCookie,
    getDateKey,
    isSameDay,
    createSystemMessage,
    buildParticipantsDisplay,
    getTheme
};
