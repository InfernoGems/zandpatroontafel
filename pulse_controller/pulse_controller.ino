// Defines pin numbers
const int pin_r_step = 3; // The pulse that goes to the motor (on / off)
const int pin_r_dir = 6; // Direction: toggle (positive / negative)
const int pin_phi_step = 2; 
const int pin_phi_dir = 5; 

// Set pulse time variables
int r_pulse_width = 200;
long int r_pulse_time = 100000;
int r_pulse_delay = r_pulse_time - r_pulse_width;

int phi_pulse_width = 200;
long int phi_pulse_time = 100000;
int phi_pulse_delay = phi_pulse_time - phi_pulse_width;

long int r_target = 0;
long int phi_target = 0;
long int abs_r_target = 0;
long int abs_phi_target = 0;

int r_compensation_interval = 30;

boolean finished = true;

// Get the delta phi and delta r from the raspberry and convert that to pulses
void get_target() {
  // GET THE delta PHI AND delta R FROM THE RASPBERRY PI
  String input_r = Serial.readStringUntil('&');
  String input_phi = Serial.readStringUntil('&');
 
  r_target = input_r.toInt();
  phi_target = input_phi.toInt();
  abs_r_target = abs(r_target);
  abs_phi_target = abs(phi_target);
  
  // Set direction of r
  if (r_target > 0) {
    digitalWrite(pin_r_dir, LOW);
  } else if (r_target < 0) {
    digitalWrite(pin_r_dir, HIGH);
  }

  // Set direction of phi
  if (phi_target > 0) {
    digitalWrite(pin_phi_dir, HIGH);
  } else if (phi_target < 0) {
    digitalWrite(pin_phi_dir, LOW);
  }
  
  finished = false;
}

// Let the motors go to the desired position
void goto_target() {
  
  long int l = max(abs_r_target, abs_phi_target);

  int c = r_compensation_interval;
  for (long int i = 0; i < l; i++){
    if (i < abs_r_target){
      digitalWrite(pin_r_step, HIGH);
      delayMicroseconds(r_pulse_width);
      digitalWrite(pin_r_step, LOW);
      delayMicroseconds(r_pulse_delay);
    }
    
    if (c > 0) {
      if (abs_phi_target > 0) {
        c --;
      }
    } else {
      if (phi_target > 0) {
        digitalWrite(pin_r_dir, HIGH);
      } else {
        digitalWrite(pin_r_dir, LOW);
      }
      digitalWrite(pin_r_step, HIGH);
      delayMicroseconds(r_pulse_width);
      digitalWrite(pin_r_step, LOW);
      delayMicroseconds(r_pulse_delay); 
      c = r_compensation_interval;
      
      if (r_target > 0) {
        digitalWrite(pin_r_dir, LOW);
      } else if (r_target < 0) {
        digitalWrite(pin_r_dir, HIGH);
      }
    }
    
    if (i < abs_phi_target) {
      digitalWrite(pin_phi_step, HIGH);
      delayMicroseconds(phi_pulse_width);
      digitalWrite(pin_phi_step, LOW);
      delayMicroseconds(phi_pulse_delay); 
    }
  }
  
  finished = true;
  
  Serial.println("OK");
  
}


void move_to_zero(){
   
}


void setup() {
  Serial.begin(115200);
  Serial.flush();
  pinMode(pin_phi_step, OUTPUT); 
  pinMode(pin_phi_dir, OUTPUT);
  pinMode(pin_r_step, OUTPUT); 
  pinMode(pin_r_dir, OUTPUT);
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
