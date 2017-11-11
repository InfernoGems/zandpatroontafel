from serial import Serial
from time import sleep
import importlib
import read_code


class Driver(Serial):
    PULSE_WIDTH = 200
    PULSE_TIME = 100000
    R_GEAR = 2
    PHI_GEAR = 3
    R_MICROSTEPPING = 8
    PHI_MICROSTEPPING = 8
    R_PULSES_PER_REVOLUTION = 200 * R_MICROSTEPPING * R_GEAR
    PHI_PULSES_PER_REVOLUTION = 200 * PHI_MICROSTEPPING * PHI_GEAR
    OK = 'OK'
    
    def __init__(self, port, queue):
        super().__init__(port, 115200, timeout=1)
        self.stop = False
        self.queue = queue
        self.current = None
        self.phi_absolute = 0
        self.r_absolute = 0

    def send_relative(self, r, phi):
        r, phi = round(r, 6), round(phi, 6)
        print(r, phi)
        command = '{r}&{phi}&'.format(r = r, phi = phi)
        self.write(command.encode())
        while True:
            output = self.readline().decode().strip()
            if output == self.OK:
                break
        self.phi_absolute += phi
        self.r_absolute += r

    def send_absolute(self, r_absolute, phi_absolute):
        self.send_relative(r_absolute - self.r_absolute, phi_absolute - self.phi_absolute)
        
         
    def start(self):
        while True:
            if self.queue:
                file = self.queue[0]
                del self.queue[0]
                self.current = file
                module = importlib.import_module(file.rstrip('.py').replace('/', '.'))
                for r, phi in module.path:
                    self.send_absolute(r, phi)


    def stop_driver(self):
        self.close()
        

class DummyDriver(Driver):
    def write(self, data):
        print(data)

    def readline(self):
        return b'OK'

			
def main():
    driver = Driver('/dev/ttyUSB0', ['Patterns/code.py'])
    try:
        driver.start()
    except KeyboardInterrupt:
        driver.stop_driver()

if __name__ == '__main__':
    main()