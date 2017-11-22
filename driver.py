try:
    from serial import Serial
except ImportError:
    Serial = object #This is for testing on windows. 
from time import sleep, time
from threading import Thread
import importlib


class CurrentQueueItem(object):
    def __init__(self, filename, path):
        self.length = len(path) #The object should implement the __len__ method
        self.filename = filename
        self.done = 0
        self.start_time = time()

    def push(self):
        self.done += 1

    @property
    def percentage(self):
        return round(self.done/self.length * 100, 1)

    @property
    def time_left(self):
        try:
            return (time() - self.start_time) / self.done * (self.length - self.done)
        except ZeroDivisionError:
            return 0


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
                module = importlib.import_module(file.rstrip('.py').replace('/', '.'))
                self.current = CurrentQueueItem(file, module.path)
                for r, phi in module.path:
                    self.send_absolute(r, phi)
                    self.current.push()


    def stop_driver(self):
        self.close()
        

class DummyDriver(Driver):
    def __init__(self, queue):
        self.stop = False
        self.queue = queue
        self.current = None
        self.phi_absolute = 0
        self.r_absolute = 0
        
    def write(self, data):
        print(data.decode())
        sleep(1)

    def readline(self):
        return b'OK'

			
def main():
    driver = DummyDriver(['Patterns/code.py'])
    Thread(target = driver.start).start()
    while True:
        try:
            print(driver.current.percentage)
            print(driver.current.time_left)
        except AttributeError:
            pass
    

if __name__ == '__main__':
    main()
