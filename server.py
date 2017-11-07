try:
    import driver
except ImportError:
    pass

from http.server import BaseHTTPRequestHandler, HTTPServer
from threading import Thread
import json

HOST = '192.168.2.47'
PORT = 80
PIN = '0000'
SETTINGS_FILE = 'settings.json'
with open(SETTINGS_FILE) as f:
    settings = json.loads(f.read())
queue = []
#d = driver.Driver('path')


def handle_json(json_data):
    try:
        if json_data['pin'] != PIN:
            return {'status': 'failed', 'message': 'Incorrect pin. '}

        if json_data['action'] == 'upload':
            pass

        elif json_data['action'] == 'get_library':
            return settings['library']

        elif json_data['action'] == 'add_to_queue':
            queue.append(json_data['filename']) #Filename is not checked yet
            return {'status': 'success'}

        elif json_data['action'] == 'delete_from_queue':
            queue.remove(json_data['filename'])
            return {'status': 'success'}

        elif json_data['action'] == 'move_up':
            index = queue.index(json_data['filename'])
            queue[index], queue[index - 1] = queue[index - 1], queue[index]
            return {'status': 'success'}

        elif json_data['action']== 'move_down':
            index = queue.index(json_data['filename'])
            queue[index], queue[index + 1] = queue[index + 1], queue[index]
            return {'status': 'success'}

        elif json_data['action'] == 'kill_current':
            d.stop = True
            t = Thread(target = d.start)
            t.daemon = True
            t.start()
            return {'status': 'success'}

        elif json_data['action'] == 'delete_from_library':
            try:
                del settings['library'][settings['library'].index(json_data['filename'])]
            except ValueError:
                return {'status': 'This file does not exist in our library. '}
            return {'status': 'success'}

    except KeyError:
        pass
    return {'status': 'failed', 'message': 'Something went wrong. '}

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        file = self.path
        if file.endswith('/'):
            file += 'index.html'
        file = file.lstrip('/')
        try:
            with open(file, 'rb') as f:
                self.send_response(200)
                self.send_header('Content-type', 'text/' + file.split('/')[-1].split('.')[-1])
                self.end_headers()
                self.wfile.write(f.read())
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        data_string = self.rfile.read(int(self.headers['Content-Length']))
        json_data = json.loads(data_string.decode())
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(handle_json(json_data)).encode())

    def log_message(self, format, *args):
        pass

def main():
    #t = Thread(target = d.start)
    #t.daemon = True
    #t.start()
    try:
        server = HTTPServer((HOST, PORT), RequestHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    with open(SETTINGS_FILE, 'w') as f:
        f.write(json.dumps(settings))

if __name__ == '__main__':
    main()
