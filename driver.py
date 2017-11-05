from serial import Serial
from time import sleep
import read_code


class Driver(Serial):
    def __init__(self, port, queue, wait_time=None):
        super().__init__(port, 115200, timeout=1)
        self.stop = False
        self.queue = queue
        self.current = None
        self.wait_time = wait_time
        if wait_time is None:
            self.wait_time = .1
    
    def start(self):
        self.write(b'\r\n\r\n')
        sleep(2)
        self.flushInput()
        while True:
            if self.queue:
                file = self.queue[0]
                del self.queue[0]
                g_code = read_code.create_gcode(read_code.import_path(file))
                self.current = g_code
                for line in g_code.split('\n'):
                    print(line)
                    if self.stop:
                        break
                    self.write(line.encode() + b'\n')
                    self.readline()
                    sleep(self.wait_time)
                    

    def stop_driver(self):
        self.close()
        

			
def main():
    driver = Driver('/dev/ttyUSB0', ['code.py'], wait_time=.2)
    try:
        driver.start()
    except KeyboardInterrupt:
        driver.stop_driver()

if __name__ == '__main__':
    main()
