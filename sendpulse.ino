// Defines pin numbers
const int pin_phi_step = 2;
const int pin_phi_dir = 5;
const int pin_r_step = 3;
const int pin_r_dir = 6;

const int pulse_amount = 200;
const int phi_compensation = 10;


const int pulse_width = 200;
const int pulse_time = 100000;
const int pulse_delay = pulse_time - pulse_width;

float target_phi = -0.05;
float target_r = 0.0;

int target_phi_pulse = abs(target_phi * pulse_amount);
int target_r_pulse = abs((target_r * pulse_amount) - (target_phi_pulse / phi_compensation));


void setup() {
  pinMode(pin_phi_step, OUTPUT); 
  pinMode(pin_phi_dir, OUTPUT);
  pinMode(pin_r_step, OUTPUT); 
  pinMode(pin_r_dir, OUTPUT);
  
  if (target_phi > 0) {
    digitalWrite(pin_phi_dir, HIGH);
  } else if (target_phi < 0) {
    digitalWrite(pin_phi_dir, LOW);
  }
  if (target_r > 0) {
    digitalWrite(pin_r_dir, HIGH);
  } else if (target_r < 0) {
    digitalWrite(pin_r_dir, LOW);
  }
  
  for (int i = 0; i < target_phi_pulse; i++) {
    digitalWrite(pin_phi_step, HIGH);
    delayMicroseconds(pulse_width);
    digitalWrite(pin_phi_step, LOW);
    delayMicroseconds(pulse_delay);
  }
  
  for (int i = 0; i < target_r_pulse; i++) {
    digitalWrite(pin_r_step, HIGH);
    delayMicroseconds(pulse_width);
    digitalWrite(pin_r_step, LOW);
    delayMicroseconds(pulse_delay);
  }
}

void loop() {
  
  
}
