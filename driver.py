from serial import Serial

class Driver(Serial):
    def __init__(self, port):
        super().__init__(port, 115200, timeout=1)
    
    def start(self, gcode):
        for line in gcode.split('\n'):
            self.write(line + '\n')
            value = self.readline()
            print(value)


def main():
    driver = Driver('/dev/poep')
    driver.start()
