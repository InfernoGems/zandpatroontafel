// Defines pin numbers
const int pin_phi_step = 2; // The pulse that goes to the motor (on / off)
const int pin_phi_dir = 5; // Direction: toggle (positive / negative)
const int pin_r_step = 3;
const int pin_r_dir = 6;

const int pulse_amount = 200; // Amount of pulses per revolution
const float phi_compensation = 0.25; // Compensation factor for r when phi gets changed

// Define pulse speed
const int pulse_width = 200;
const int pulse_time = 100000;
const int pulse_delay = pulse_time - pulse_width;

int target_phi_pulse = 0;
int target_r_pulse = 0;

boolean finished = true;

// Get the delta phi and delta r from the raspberry and convert that to pulses
void get_target() {
  // GET THE delta PHI AND delta R FROM THE RASPBERRY PI
  float target_phi = 10.0;
  float target_r = 10.0;

  // Compensate the target_r for the rotation of phi
  target_r -= target_phi * phi_compensation;
  
  // Calculate the pulses
  target_phi_pulse = abs(target_phi * pulse_amount);
  target_r_pulse = abs(target_r * pulse_amount);
  
  // Set direction of phi
  if (target_phi > 0) {
    digitalWrite(pin_phi_dir, HIGH);
  } else if (target_phi < 0) {
    digitalWrite(pin_phi_dir, LOW);
  }
  
  // Set direction of r
  if (target_r > 0) {
    digitalWrite(pin_r_dir, HIGH);
  } else if (target_r < 0) {
    digitalWrite(pin_r_dir, LOW);
  }
  finished = false;
}

// Let the motors go to the desired position
void goto_target() {
  
  String test = Serial.readString();
  
  Serial.print(test);
  
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

void setup() {
  Serial.begin(115200);
  pinMode(pin_phi_step, OUTPUT); 
  pinMode(pin_phi_dir, OUTPUT);
  pinMode(pin_r_step, OUTPUT); 
  pinMode(pin_r_dir, OUTPUT);
}

void loop() {
  if (finished) {
    get_target();
  }
  
  goto_target();
  
}
