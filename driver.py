from serial import Serial
from . import read_code

class Driver(Serial):
    def __init__(self, port, queue):
        super().__init__(port, 115200, timeout=1)
        self.stop = False
        self.queue = queue
        self.current = None
    
    def start(self):
        while True:
            if self.queue:
                file = self.queue[0]
                del self.queue[0]
                g_code = read_code.create_gcode(read_code.import_path(file))
                self.current = g_code
                for line in g_code.split('\n'):
                    if self.stop:
                        break
                    self.write(line + '\n')
                    value = self.readline()
                    print(value)

			
def main():
    pass