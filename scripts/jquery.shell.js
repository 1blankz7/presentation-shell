(function($) {
    $.fn.shell = function(options) {
        var opt = $.extend(true, {}, $.fn.shell.defaults, options),
            $this = $(this),
            history = new Array(),
            history_idx = 0,
            write_idx = 0,
            current_line = "",
            input = null,
            prompt_line = null,
            history_window = null;

        var call = function(cmd, callback) {
            // create request
            $.post(opt.server_url, {'cmd': cmd}, function(data) {
                callback(data);
            });
        };

        var onkeydown = function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.cancelBubble = true;
            
            switch(e.which) {
                case 8: // backspace
                    backspace(e.key);
                    break;
                case 13: // enter
                    enter(e.key);
                    break;
                case 37: // left
                    left(e.key);
                    break;
                case 38: // up
                    up(e.key);
                    break;
                case 39: // right
                    right(e.key);
                    break;
                case 40: // down
                    down(e.key);
                    break;
                case 27: // esc
                    esc(e.key);
                    break;
                case 224:
                case 18:
                case 17:
                case 16:
                case 9:
                case 20:
                    break;
                default:
                    key_default(e.key);
            }
            $(this).val(current_line);
            input.setCursorPosition(write_idx);
        }

        var send_to_server = function() {
            var cmd = current_line;
            current_line = "";
            
            history.push(cmd);

            call(cmd, function(data) {
                var old_cmd = history[history.length-1];
                set_prompt(data.cwd.result);
                var processed_result = nl_to_br(data.result.result);
                var el = '<p><span class="cmd">'+opt.prompt+old_cmd+'</span><br>'+processed_result+'</p>';  
                history_window.append(el);
                history_window.scrollTop(history_window[0].scrollHeight);
            });
        };

        var nl_to_br = function(text) {
            return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
        };

        var set_prompt = function(cwd) {
            $('.prompt', prompt_line).text(cwd+" "+opt.prompt);
        };

        var backspace = function(key) {
            current_line = current_line.slice(0, write_idx>0?write_idx-1:0) 
                + current_line.slice(write_idx);
            write_idx--;
            if(write_idx < 0) {
                write_idx = 0;
            }
        };

        var enter = function(key) {
            send_to_server();
            history_idx = history.length;
            write_idx = current_line.length;
        };

        var left = function(key) {
            write_idx--;
            if(write_idx < 0) {
                write_idx = 0;
            }
        };

        var up = function(key) {
            history_idx--;
            if(history_idx < 0) {
                history_idx = 0;
                current_line = history.length > 0 ? history[history_idx] : current_line;
            } else {
                current_line = history[history_idx];
            }
            write_idx = current_line.length;
        };

        var right = function(key) {
            write_idx++;
            if(write_idx > current_line.length) {
                write_idx = current_line.length;
            }
        };

        var down = function(key) {
            history_idx++;
            if(history_idx < history.length) {
                current_line = history[history_idx];
            } else {
                history_idx = history.length;
                current_line = "";
            }
            write_idx = current_line.length;
        };

        var esc = function(key) {
            write_idx = current_line.length
            input.blur();
        };

        var key_default = function(key) {
            current_line = current_line.slice(0, write_idx) 
                + key + current_line.slice(write_idx);
            write_idx++;
        };

        var init = function() {
            $this.html($.fn.shell.markup);
            input = $('.cmd input', $this);
            prompt_line = $('.prompt-line', $this);
            history_window = $('.history', $this);
            // add event handler to input
            input.keydown(onkeydown);
            // delete value in shell
            input.val("");

            return false;
        };

        init();
        return this;
    };

    $.fn.shell.defaults = {
        server_url: '/',
        prompt: '$> '
    };
    $.fn.shell.markup = '<div><div class="history"></div><div class="prompt-line"><div class="prompt"></div><div class="cmd"><input type="text"></div></div></div>'

    $.fn.setCursorPosition = function(pos) {
        this.each(function(index, elem) {
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        });
        return this;
    };

})(jQuery);