import serial
from time import sleep

arduino = serial.Serial('COM3', 115200)

arduino.reset_input_buffer()
arduino.reset_output_buffer()
##pulse_amount = 400
##current_phi = 0
##current_r = 0


##    r = 0.0025
##    phi = 0.0025
##    command = str(r)+"&"+str(phi)+"&"
##    print(command)
sleep(1)
arduino.write(b'0.5&1&')
##sleep(0.5)
##for i in range(5):
##    response = arduino.readline()
##    print(response)
arduino.close()
