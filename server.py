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


if __name__ == '__main__':
    PORT = 1338
    Handler = ServerHandler

    httpd = socketserver.TCPServer(("", PORT), Handler)
    httpd.serve_forever()
