
var Shell = function(opt) {
    var defaults = {
        server_url: '',
        prompt: '$> '
    };
    var history = new Array();
    var history_idx = 0;
    var write_idx = 0;
    var current_line = "";
    var input = null;
    var prompt_line = null;
    var history_window = null;

    /**
     * Returns the current working directory of the server
     */
    this.cwd = function(callback) {
        var cmd = 'pwd';
        return call(pwd, callback);
    };

    var call = function(cmd, callback) {
        // create request
        $.post('/', {'cmd': cmd}, function(data) {
            callback(data);
        });
    };

    var send_to_server = function() {
        var cmd = current_line;
        current_line = "";
        
        history.push(cmd);

        call(cmd, function(result) {
            var old_cmd = history[history.length-1];
            $('.prompt', prompt_line).text(result.cwd+" "+defaults.prompt);
            var processed_result = result.result.replace(/(?:\r\n|\r|\n)/g, '<br />');
            var el = '<p><span class="cmd">'+defaults.prompt+old_cmd+'</span><br>'+processed_result+'</p>';
            
            history_window.append(el);
            history_window.scrollTop(history_window[0].scrollHeight);
        });
    };

    this.init = function() {
        input = $('.cmd input');
        prompt_line = $('.prompt-line');
        history_window = $('.history');

        // add event handler to input
        input.keydown(function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.cancelBubble = true
            
            switch(e.which) {
                case 8: // backspace
                    current_line = current_line.slice(0, write_idx>0?write_idx-1:0) 
                        + current_line.slice(write_idx);
                    write_idx--;
                    if(write_idx < 0) {
                        write_idx = 0;
                    }
                    break;
                case 13: // enter
                    // send to server
                    console.log('enter')
                    send_to_server();
                    break;
                case 37: // left
                    write_idx--;
                    if(write_idx < 0) {
                        write_idx = 0;
                    }
                    break;
                case 38: // up
                    history_idx--;
                    if(history_idx < 0) {
                        history_idx = 0;
                    }
                    current_line = history[history_idx];
                    break;
                case 39: // right
                    write_idx++;
                    if(write_idx > current_line.length) {
                        write_idx = current_line.length;
                    }
                    break;
                case 40: // down
                    history_idx++;
                    if(history_idx < history.length) {
                        current_line = history[history_idx];
                    } else {
                        history_idx = history.length-1;
                    }
                    break;
                case 27: // esc
                    input.blur();
                    break;
                case 224:
                case 18:
                case 17:
                case 16:
                case 9:
                case 20:
                    break;
                default:
                    current_line = current_line.slice(0, write_idx) 
                        + e.key + current_line.slice(write_idx);
                    write_idx++;
            }
            $(this).val(current_line);
        });

        // delete value in shell
        input.val("");

        return false;
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