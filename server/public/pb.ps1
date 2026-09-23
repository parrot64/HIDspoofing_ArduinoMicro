$Server = "http://192.168.31.85:3000"

$ComputerName = $env:COMPUTERNAME
$Username = $env:USERNAME

# Get IPv4 of first Ethernet adapter
$IP = (
    Get-NetIPConfiguration |
    Where-Object {
        $_.InterfaceAlias -like "*Ethernet*" -and
        $_.IPv4Address -ne $null
    } |
    Select-Object -First 1
).IPv4Address.IPAddress

# get Machine GUID
try {
    $GUID = (Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Cryptography").MachineGuid
}
catch {
    $GUID = "unknown"
}

$ComputerNameEncoded = [System.Uri]::EscapeDataString($ComputerName)
$UsernameEncoded     = [System.Uri]::EscapeDataString($Username)
$IPEncoded           = [System.Uri]::EscapeDataString($IP)
$GUIDEncoded         = [System.Uri]::EscapeDataString($GUID)

# endpoint URL to send data to server
$Url = "$Server/api/userInfo?pc=$ComputerNameEncoded&user=$UsernameEncoded&ip=$IPEncoded&guid=$GUIDEncoded"


$Dest = "$env:TEMP\wallpaper.jpg"

# downloading
(New-Object System.Net.WebClient).DownloadFile($Url, $Dest)

# set wallpapaer
if (Test-Path $Dest) {

    Add-Type @"
using System.Runtime.InteropServices;

public class Wallpaper {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SystemParametersInfo(
        uint uiAction,
        uint uiParam,
        string pvParam,
        uint fWinIni
    );
}
"@

    # SPI_SETDESKWALLPAPER = 20
    # SPIF_UPDATEINIFILE = 1
    # SPIF_SENDCHANGE = 2
    [Wallpaper]::SystemParametersInfo(20, 0, $Dest, 3)
}

