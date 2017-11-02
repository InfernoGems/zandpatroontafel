from math import atan, sqrt, degrees, sin
import serial

PORT = '/dev/ttyUSB0'

def cartesian_to_polar(*args):
    coord = args[0] if len(args) == 1 else args
    try:
        output = sqrt(coord[0] ** 2 + coord[1] ** 2), degrees(atan(coord[0] / coord[1]))
    except ZeroDivisionError:
        output = 0,0
    if coord[1] > 0:
        if coord[0] > 0:
            return output
        return output[0], -output[1]
    else:
        if coord[1] > 0:
            return output
        return -output[0], output[1]
    

def main():
    CNCShield = serial.Serial(PORT, 115200, timeout=1)
    start_x = 0
    end_x = 100
    step_x = 0.1
    for x in range(int(start_x * (1/step_x)), int(end_x * (1/step_x)), int(step_x * (1/step_x))):
        x /= 1 / step_x
        y = sin(x)
        print(cartesian_to_polar(x, y))

if __name__ == '__main__':
    main()
