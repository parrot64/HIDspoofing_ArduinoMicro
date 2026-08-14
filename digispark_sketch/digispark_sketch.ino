#include "DigiKeyboard.h"

void setup() 
{
    DigiKeyboard.sendKeyStroke(0);
    DigiKeyboard.delay(500);

    // Win+R
    DigiKeyboard.sendKeyStroke(KEY_R, MOD_GUI_LEFT);
    DigiKeyboard.delay(400);

    DigiKeyboard.print("notepad");
    DigiKeyboard.sendKeyStroke(KEY_ENTER);

    DigiKeyboard.delay(1000);
    DigiKeyboard.print("Y0UR C0MPU73R 1S H4XED");
}

void loop() {}