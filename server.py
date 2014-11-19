import http.server
import socketserver
import cgi
import json
from shell import Shell


class ServerHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST',
                     'CONTENT_TYPE': self.headers['Content-Type'],
                     })

        shell = Shell()
        message = shell.execude(form.getvalue('cmd'))
        cwd = shell.pwd
        self.send_response(200)
        self.send_header("Content-type", "text/json")
        self.end_headers()
        s = json.dumps({'result': message, 'cwd': cwd})
        self.wfile.write(bytes(s, 'UTF-8'))

    def do_QUIT(self):
        """send 200 OK response, and set server.stop to True"""
        self.send_response(200)
        self.end_headers()
        self.server.stop = True


class StoppableHttpServer(http.server.HTTPServer):
    """http server that reacts to self.stop flag"""
    STOP = False

    def serve_forever(self):
        """Handle one request at a time until stopped."""
        StoppableHttpServer.STOP = False
        while not StoppableHttpServer.STOP:
            self.handle_request()


if __name__ == '__main__':
    import signal
    import sys

    def signal_handler(sig, frame):
        print('You pressed Ctrl+C!')
        StoppableHttpServer.STOP = False
        print('Server shutdown!')
        sys.exit(0)

    if len(sys.argv) > 1:
        PORT = int(sys.argv[1])
    else:
        PORT = 1338

    Handler = ServerHandler
    httpd = StoppableHttpServer(("127.0.0.1", PORT), Handler)
    print("Server serves on %s:%s" % httpd.server_address)
    signal.signal(signal.SIGINT, signal_handler)
    print('Press Ctrl+C')
    httpd.serve_forever()
