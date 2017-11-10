import serial
from time import sleep

arduino = serial.Serial('/dev/ttyUSB0', 115200)

phi_real = 0
r_real = 0

global phi_loss
phi_loss = 0
global r_loss
r_loss = 0

global phi_absolute
phi_absolute = 0
global r_absolute
r_absolute = 0

pulse_width = 200
pulse_time = 100000
r_gear = 2
r_microstepping = 8
phi_gear = 3
phi_microstepping = 8

r_pulses_per_revolution = 200 * r_microstepping * r_gear
phi_pulses_per_revolution = 200 * phi_microstepping * phi_gear



def send_coords(phi_input, r_input):
    global phi_absolute
    global r_absolute
    global phi_loss
    global r_loss

    command = str(phi_input+phi_loss)+"&"+str(r_input+r_loss)+"&"
    arduino.write(command.encode())
    for i in range(3):
        print(arduino.readline().decode().strip())

    phi_pulse = int(arduino.readline().decode().replace("\r\n", ""))
    phi_real = phi_pulse/phi_pulses_per_revolution
    phi_loss = phi_input - phi_real
    phi_absolute += phi_real

    print("phi_pulse = "+str(phi_pulse))
    print("phi_real  = "+str(phi_real))
    print("phi_loss  = "+str(phi_loss))
    print("\nphi_absolute = "+str(phi_absolute)+"\n")

    r_pulse = int(arduino.readline().decode().replace("\r\n", ""))
    r_real = r_pulse/r_pulses_per_revolution
    r_loss = r_input - r_real
    r_absolute += r_real
    
    print("r_pulse   = "+str(r_pulse))
    print("r_real    = "+str(r_real))
    print("r_loss    = "+str(r_loss))
    print("\nr_absolute   = "+str(r_absolute)+"\n")
