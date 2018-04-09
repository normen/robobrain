var wpi = require('node-wiring-pi');
var Encoder = require('./encoder.js')

function WpiEncoder(pin1, pin2, callback = null){
  this.pin1 = pin1;
  this.pin2 = pin2;
  this.callback = callback;
  this.encoder = new Encoder();
  this.value = 0;

  wpi.pinMode(pin1, wpi.INPUT);
  wpi.pullUpDnControl(pin1, wpi.PUD_UP);

  wpi.pinMode(pin2, wpi.INPUT);
  wpi.pullUpDnControl(pin2, wpi.PUD_UP);

  let self = this;

  wpi.wiringPiISR(pin1, wpi.INT_EDGE_BOTH, function(delta) {
    let _pin1 = wpi.digitalRead(pin1);
    let _pin2 = wpi.digitalRead(pin2);
    let dir = self.encoder.processPinChange(_pin1,_pin2);
    if(dir==0x10){
      self.changeHappened(1);
    }else if(dir==0x20){
      self.changeHappened(-1);
    }
  });

  wpi.wiringPiISR(pin2, wpi.INT_EDGE_BOTH, function(delta) {
    let _pin1 = wpi.digitalRead(pin1);
    let _pin2 = wpi.digitalRead(pin2);
    let dir = self.encoder.processPinChange(_pin1,_pin2);
    if(dir==0x10){
      self.changeHappened(1);
    }else if(dir==0x20){
      self.changeHappened(-1);
    }
  });
}

WpiEncoder.prototype = {
  changeHappened(delta){
    this.value+=delta;
    if(this.callback){
      this.callback(this.value, delta);
    }
  }
}

module.exports = WpiEncoder;
