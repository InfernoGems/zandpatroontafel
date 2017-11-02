from math import atan, sqrt, degrees, sin
#import serial

#PORT = '/dev/ttyUSB0'

def cartesian_to_polar(*args):
    # Accept both (x, y) as well as x, y
    if len(args) == 1:
        coord = args[0]
    else:
        coord = args

    # Calculate the r (distance) and phi (angle) 
    distance = sqrt(coord[0] ** 2 + coord[1] ** 2)
    angle = degrees(atan(coord[0] / coord[1]))
    output = distance, angle

    # Correct the angle for the four different quadrants
    if coord[1] >= 0:
        if coord[0] < 0:
            return output[0], 90-output[1]
    else:
        return output[0], 270-output[1]
    return output

def main():
    pass
    
##    CNCShield = serial.Serial(PORT, 115200, timeout=1)
##    start_x = 0
##    end_x = 100
##    step_x = 0.1
##    for x in range(int(start_x * (1/step_x)), int(end_x * (1/step_x)), int(step_x * (1/step_x))):
##        x /= 1 / step_x
##        y = sin(x)
##        print(cartesian_to_polar(x, y))

if __name__ == '__main__':
    main()
