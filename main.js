let keyboard = {
  start: 48,
  range: 24,
}

let sliders = [];
let blackKeys = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]

function setup() {
  createCanvas(600, 300);

  sliders[0] = createSlider(20, 20000, 10000, 0.01);
  createP("Low-Pass Filter Cutoff")
  sliders[1] = createSlider(0, 5, 0, 0.01);
  createP("Attack")
  sliders[2] = createSlider(0, 1, 0, 0.01);
  createP("Decay")
  sliders[3] = createSlider(0, 1, 0, 0.01);
  createP("Sustain")
  sliders[4] = createSlider(0, 5, 0, 0.01);
  createP("Release")
}

function draw() {
  //background(220);

  for (i = 0; i < keyboard.range; i++) {

    let isBlack = blackKeys[i%12];
    fill(255 - isBlack * 200)

    let x = i * width / keyboard.range;
    let y = 0;
    let w = width / keyboard.range;
    let h = height - isBlack * 20;
    rect(x, y, w, h);

  }

  noLoop();
}

function mousePressed() {

  if (mouseX <= width && mouseY <= height / 2) {
    let k = floor(mouseX / (width / keyboard.range))
    k += keyboard.start

    playNote(k)
  }
}

function playNote(k) {
  VCO = new p5.Oscillator("sine", 20)
  VCA = new p5.Envelope(
    sliders[1].value(),
    sliders[2].value(),
    sliders[3].value(),
    sliders[4].value()
    )
  FTR = new p5.Filter("lowpass");

  VCO.freq(notesFreqs[k])
  FTR.freq(sliders[0].value())

  VCO.disconnect()
  VCO.connect(FTR)
  VCO.amp(VCA)

  VCO.start()
  VCA.play()
}
