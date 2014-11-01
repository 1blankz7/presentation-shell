
var Shell = function(opt) {
    var defaults = {
        server_url: '',
        prompt: '$> '
    };
    var history = new Array();
    var history_idx = 0;

    /**
     * Returns the current working directory of the server
     */
    this.cwd = function(callback) {
        var cmd = 'pwd';
        return call(pwd, callback);
    };

    var call = function(cmd, callback) {
        // create request
        // use promise
        $.post('/', {'cmd': cmd}, function(data) {
            callback(data.result);
        });
    };
    this.init = function() {
        $('form').submit(function(e) {
            e.preventDefault();
            var cmd = $('.cmd input').val();
            call(cmd, function(result) {
                console.log(result);
            });
        });
    };
} 

function fullScreen() {
    document.fullscreenEnabled = document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.documentElement.webkitRequestFullScreen;

    function requestFullscreen( element ) {
        if ( element.requestFullscreen ) {
            element.requestFullscreen();
        } else if ( element.mozRequestFullScreen ) {
            element.mozRequestFullScreen();
        } else if ( element.webkitRequestFullScreen ) {
            element.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
        }
    }
    if ( document.fullscreenEnabled ) {
        requestFullscreen( document.documentElement );
    }
}

(function($) {
    var shell = new Shell();
    shell.init();
})(jQuery);