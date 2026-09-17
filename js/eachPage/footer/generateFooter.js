$(document).ready(function(){
    let $footer = $('body > footer')
    let date = new Date().getFullYear()
    $footer.html(``)
    $footer.html(`<p>Jack Hackett | ${date}</p>`)
    $footer.addClass('text-center bg-primary-subtle')
})