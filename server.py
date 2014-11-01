import http.server
import socketserver
import subprocess
import cgi
import json


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

        message = self._system_call(form.getvalue('cmd'))
        self.send_response(200)
        self.send_header("Content-type", "text/json")
        self.end_headers()
        s = json.dumps({'result': message})
        self.wfile.write(bytes(s, 'UTF-8'))

    def _system_call(self, command):
        """
        Execudes the given command if the user is on the same machine. Also
        filters requests, that contains a 'sudo' command. Returns the result
        after call is completed.
        """
        proc = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
        return proc.stdout.read().decode("utf-8")


if __name__ == '__main__':
    PORT = 1338
    Handler = ServerHandler

    httpd = socketserver.TCPServer(("", PORT), Handler)
    httpd.serve_forever()
