var oled = require('oled-ssd1306-i2c');
var WpiEncoder = require('./wpi-encoder.js');

var opts = {
  width: 128,
  height: 64
};

var len = 1;

var oled = new oled(opts);
oled.turnOnDisplay();
oled.clearDisplay();
//oled.drawLine(1, 1, 128, 32, 1);

var font = require('oled-font-5x7');
oled.setCursor(0, 30);
oled.writeString(font, 1, 'Heyho', 1);
//oled.update();

var wpi = require('node-wiring-pi');
wpi.wiringPiSetupGpio();

var enc = new WpiEncoder(20,21,updateDisplay);

function updateDisplay(value, delta){
  len = len + (delta*10);
  if(len < 0) len = 0;
  if(len > 128) len = 127;
  oled.fillRect(0, 0, 127, 20, 0, false);
  oled.fillRect(0, 0, len, 20, 1);
}
