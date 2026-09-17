
let isDarkMode;

$(document).ready(function() {
    isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    $('html').attr('data-theme', isDarkMode ? 'dark' : 'light');
});
