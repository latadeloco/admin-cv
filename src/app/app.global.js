$(function() {
// Sidebar toggle behavior
    $('#sidebarCollapse').on('click', function() {
        if (screen.width < 768) {
            if ($('#sidebar').hasClass('active')) {
                $('.navegacion-derecha').show();
            } else {
                $('.navegacion-derecha').hide();
            }
        }
        
        $('#sidebar, #content').toggleClass('active');
    });

    var a = $('.nav-item > .nav-link');

    function activeOptMenu() {
        for (let i = 0; i < a.length; i++) {
            console.log(a[i].hash == window.location.hash)
            if (a[i].hash = window.location.hash) {
                $(a[i]).addClass('bg-light');
                break;
            }
        }
    }
});