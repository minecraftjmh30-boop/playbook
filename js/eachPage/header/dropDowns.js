$(document).on('click', '#roomMenu', function() {
    $('.roomDropDown').slideToggle();
});

$(document).on('click', '#profileMenu', function() {
    $('.profileDropDown').slideToggle();
});

$(document).on('click', function(e) {
    if (!$(e.target).closest('.roomDropDown, #roomMenu').length) {
        $('.roomDropDown').slideUp();
    }
    if (!$(e.target).closest('.profileDropDown, #profileMenu').length) {
        $('.profileDropDown').slideUp();
    }
});