from http.server import BaseHTTPRequestHandler, HTTPServer
from threading import Thread
from shutil import move
import json, os, base64, driver

HOST = '192.168.0.150'
PORT = 80
PIN = '0000'

load_library = lambda: [i for i in os.listdir('Patterns') if i.endswith('.py')]
queue = []
d = driver.DummyDriver(queue)

print('SERVER HOSTED ON: ' + HOST + ':' + str(PORT))

def handle_json(json_data):
	print(json_data)
	global queue
	try:

		#Check pin
		if json_data['pin'] != PIN:
			return {'status': 'failed', 'message': 'Incorrect pin. '}

		# Upload file to library
		if json_data['action'] == 'upload':
			if not json_data['filename'].endswith('.py'):
				return {'status': 'failed', 'message': 'Dit bestandstype wordt niet ondersteund. '}
			file_data = base64.b64decode(json_data['file_data'])
			with open('Patterns/' + json_data['filename'], 'wb') as f:
				f.write(file_data)
			return {'status': 'success'}

		# Get file contents from library
		elif json_data['action'] == 'get_file':
			try:
				with open('Patterns/' + json_data['filename'], 'rb') as f:
					return {'status': 'success', 'file_data': base64.b64encode(f.read()).decode()}
			except FileNotFoundError:
				return {'status': 'failed', 'message': 'Dit bestand is niet meer beschikbaar. '}

		# Upload file to library
		elif json_data['action'] == 'get_library':
			return {'status': 'success', 'library': load_library()}

		# Get queue contents
		elif json_data['action'] == 'get_queue':
			return {'status': 'success', 'queue': queue}
		
		elif json_data['action'] == 'get_current':
			if d.current is None:
				return {'status': 'success', 'current_available': False}
			return {'status': 'success', 'current_available': True, 'filename': d.current.filename, 'percentage': d.current.percentage, 'time_left': d.current.time_left, 'elapsed_time': d.current.elapsed_time}


		elif json_data['action'] == 'pause':
			d.pause = True
			return {'status': 'success'}

		elif json_data['action'] == 'play':
			d.pause = False
			return {'status': 'success'}

		elif json_data['action'] == 'get_paused':
			return {'status': 'success', 'paused': d.pause}

		# Send the updated queue content back to the server
		elif json_data['action'] == 'send_queue':
			while queue:
				del queue[0]
			for q in json_data['queue']:
				queue.append(q) #This is to keep the object and not overwrite it. The connection with driver.py will otherwise be lost
			return {'status': 'success'}

		# Terminate the currently active pattern
		# elif json_data['action'] == 'kill_current':
		# 	d.stop = True
		# 	t = Thread(target = d.start)
		# 	t.daemon = True
		# 	t.start()
		# 	return {'status': 'success'}

		# Delete pattern from library
		elif json_data['action'] == 'delete_from_library':
			if not os.path.exists('Patterns/' + json_data['filename']):
				return {'status': 'failed', 'message': 'Dit bestand bestaat niet (meer).  '}
			move('Patterns/' + json_data['filename'], 'Wastebin/' + json_data['filename'])
			return {'status': 'success'}

	except KeyError:
		pass
	return {'status': 'failed', 'message': 'Something went wrong. '}

class RequestHandler(BaseHTTPRequestHandler):
	def do_GET(self):
		file = self.path
		if file == '/':
			file = 'index.html'
		fi = file.split('/')[-1]
		print(file)
		try:
			if file.startswith('/Patterns/'):
				with open('Patterns/' + fi, 'rb') as f: #This is to prevent path traversal
					self.send_response(200)
					self.send_header('Content-type', 'application/octet-stream')
					self.end_headers()
					self.wfile.write(f.read())
			else:
				with open(fi, 'rb') as f:
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
	t = Thread(target = d.start)
	t.daemon = True
	t.start()
	try:
		server = HTTPServer((HOST, PORT), RequestHandler)
		server.serve_forever()
	except KeyboardInterrupt:
		pass

if __name__ == '__main__':
	main()
