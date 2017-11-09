void setup() {
  Serial.begin(115200);

}

void loop() {
  if (Serial.available() > 0) {
    String r = Serial.readStringUntil('&');
    String p = Serial.readStringUntil('&');
    Serial.print("received r: ");
    Serial.println(r);
    Serial.print("received p: ");
    Serial.println(p);
    float r_float = r.toFloat();
    Serial.println(r_float);
  }
  
  
  
}
