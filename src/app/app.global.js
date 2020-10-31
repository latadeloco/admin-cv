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

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
            document.exitFullscreen(); 
            }
        }
    }

    $('#fullscreen').on('click', () => {
        toggleFullScreen();
    });
});