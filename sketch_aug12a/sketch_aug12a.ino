#include <Keyboard.h>

void setup() {
  Keyboard.begin();
  delay(500);
}

void loop() {
  Keyboard.press(KEY_RIGHT_GUI);
  Keyboard.press('r');
  Keyboard.releaseAll();
  delay(500);
  Keyboard.print("notepad");
  delay(500);    
  Keyboard.press(KEY_RETURN);
  Keyboard.release(KEY_RETURN);
  delay(800);
  Keyboard.print("Y0UR C0MPU73R 1S H4XED");
  delay(90000);
}