export function setCookie(id, username, firstname, lastname) {
    const value = encodeURIComponent(JSON.stringify({ id, username, firstname, lastname }));
    const maxAge = 60 * 60 * 24 * 3; // 3 days in seconds
    document.cookie = `user=${value}; max-age=${maxAge}; path=/; SameSite=Strict`;
}

export function getCookie() {
    const match = document.cookie.split('; ').find(c => c.startsWith('user='));
    if (match) {
        return JSON.parse(decodeURIComponent(match.split('=')[1]));
    }
    return null;
}

function removeCookie() {
    document.cookie = 'user=; max-age=0; path=/; SameSite=Strict';
}
