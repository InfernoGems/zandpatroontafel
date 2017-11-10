// Defines pin numbers
const int pin_phi_step = 2; // The pulse that goes to the motor (on / off)
const int pin_phi_dir = 5; // Direction: toggle (positive / negative)
const int pin_r_step = 3;
const int pin_r_dir = 6;

// Define default values
int r_pulses_per_revolution = 200*8*2;
int phi_pulses_per_revolution = 200*8*3;
const float phi_compensation = 0; // Compensation factor for r when phi gets changed
int pulse_width = 200;
long int pulse_time = 100000;
int pulse_delay = pulse_time - pulse_width;

int phi_pulse_target = 0;
int r_pulse_target = 0;

boolean finished = true;

// Get the delta phi and delta r from the raspberry and convert that to pulses
void get_target() {
  // GET THE delta PHI AND delta R FROM THE RASPBERRY PI
  String input_r = Serial.readStringUntil('&');
  String input_phi = Serial.readStringUntil('&');
  
  float phi_target = input_phi.toFloat();
  float r_target = input_r.toFloat();

  // Compensate the target_r for the rotation of phi
  r_target -= phi_target * phi_compensation;
  
  // Calculate the pulses
  phi_pulse_target = abs(phi_target * phi_pulses_per_revolution);
  r_pulse_target = abs(r_target * r_pulses_per_revolution);
  
  // Set direction of phi
  if (phi_target > 0) {
    digitalWrite(pin_phi_dir, HIGH);
  } else if (phi_target < 0) {
    digitalWrite(pin_phi_dir, LOW);
  }
  
  // Set direction of r
  if (r_target > 0) {
    digitalWrite(pin_r_dir, HIGH);
  } else if (r_target < 0) {
    digitalWrite(pin_r_dir, LOW);
  }
  finished = false;
}

// Let the motors go to the desired position
void goto_target() {
  
  for (int i = 0; i < phi_pulse_target; i++) {
    digitalWrite(pin_phi_step, HIGH);
    delayMicroseconds(pulse_width);
    digitalWrite(pin_phi_step, LOW);
    delayMicroseconds(pulse_delay);
  }
  
  for (int i = 0; i < r_pulse_target; i++) {
    digitalWrite(pin_r_step, HIGH);
    delayMicroseconds(pulse_width);
    digitalWrite(pin_r_step, LOW);
    delayMicroseconds(pulse_delay);
  }
  finished = true;
  Serial.println("OK");
}

void setup() {
  Serial.begin(115200);
  Serial.flush();
  pinMode(pin_phi_step, OUTPUT); 
  pinMode(pin_phi_dir, OUTPUT);
  pinMode(pin_r_step, OUTPUT); 
  pinMode(pin_r_dir, OUTPUT);
  Serial.write("OK");
}

void loop() {
  if (finished) {
    if (Serial.available() > 0) {
      get_target();
    }
  } else {
    goto_target();
  }
}
