import serial
from time import sleep

arduino = serial.Serial('/dev/ttyUSB0', 115200)

while True:
    command = "r5.0 f10.0"
    arduino.write(command.encode())
    print("sent "+command+" to arduino")
    answer = arduino.read()
    print(answer.decode())
