
// Values returned by 'process'
// No complete step yet.
let DIR_NONE = 0x0
// Clockwise step.
let DIR_CW = 0x10
// Anti-clockwise step.
let DIR_CCW = 0x20

let R_START = 0x0

/*#ifdef HALF_STEP
// Use the half-step state table (emits a code at 00 and 11)
#define R_CCW_BEGIN 0x1
#define R_CW_BEGIN 0x2
#define R_START_M 0x3
#define R_CW_BEGIN_M 0x4
#define R_CCW_BEGIN_M 0x5
const unsigned char ttable[6][4] = {
  // R_START (00)
  {R_START_M,            R_CW_BEGIN,     R_CCW_BEGIN,  R_START},
  // R_CCW_BEGIN
  {R_START_M | DIR_CCW, R_START,        R_CCW_BEGIN,  R_START},
  // R_CW_BEGIN
  {R_START_M | DIR_CW,  R_CW_BEGIN,     R_START,      R_START},
  // R_START_M (11)
  {R_START_M,            R_CCW_BEGIN_M,  R_CW_BEGIN_M, R_START},
  // R_CW_BEGIN_M
  {R_START_M,            R_START_M,      R_CW_BEGIN_M, R_START | DIR_CW},
  // R_CCW_BEGIN_M
  {R_START_M,            R_CCW_BEGIN_M,  R_START_M,    R_START | DIR_CCW},
};
#else*/

// Use the full-step state table (emits a code at 00 only)
let R_CW_FINAL = 0x1
let R_CW_BEGIN = 0x2
let R_CW_NEXT = 0x3
let R_CCW_BEGIN = 0x4
let R_CCW_FINAL = 0x5
let R_CCW_NEXT = 0x6

let ttable = [
  // R_START
  [R_START,    R_CW_BEGIN,  R_CCW_BEGIN, R_START],
  // R_CW_FINAL
  [R_CW_NEXT,  R_START,     R_CW_FINAL,  R_START | DIR_CW],
  // R_CW_BEGIN
  [R_CW_NEXT,  R_CW_BEGIN,  R_START,     R_START],
  // R_CW_NEXT
  [R_CW_NEXT,  R_CW_BEGIN,  R_CW_FINAL,  R_START],
  // R_CCW_BEGIN
  [R_CCW_NEXT, R_START,     R_CCW_BEGIN, R_START],
  // R_CCW_FINAL
  [R_CCW_NEXT, R_CCW_FINAL, R_START,     R_START | DIR_CCW],
  // R_CCW_NEXT
  [R_CCW_NEXT, R_CCW_FINAL, R_CCW_BEGIN, R_START],
];


function Encoder(){
  this.state = R_START;
}

Encoder.prototype = {
  processPinChange(pin1, pin2){
    let pinstate = (pin2 << 1) | pin1;
    // Determine new state from the pins and state table.
    this.state = ttable[this.state & 0xf][pinstate];
    // Return emit bits, ie the generated event.
    return this.state & 0x30;
  }
}

module.exports = Encoder;
