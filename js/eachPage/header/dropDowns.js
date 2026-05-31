$(document).ready(function() {
    $('#roomMenu').click(function() {
        $('.roomDropDown').slideToggle();
    });

    $('#profileMenu').click(function() {
        $('.profileDropDown').slideToggle();
    });

    $(document).click(function(e) {
        if (!$(e.target).closest('.roomDropDown, #roomMenu').length) {
            $('.roomDropDown').slideUp();
        }
        if (!$(e.target).closest('.profileDropDown, #profileMenu').length) {
            $('.profileDropDown').slideUp();
        }
    });
});