let oscs = [];
let ftr;
let env;
let nse;
let waveMode = "triangle";

let isPlaying = false;
let noiseActive = false;

let keybrd = {
  range: 36,
  start: 48,
};

let blackKeys = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];

let pots = [
  {
    name: "LP Filter Frequency",
    min: 0,
    max: 20000,
    unit: "Hz",
  },
  {
    name: "Attack",
    min: 0,
    max: 1,
    unit: "%",
  },
  {
    name: "Delay",
    min: 0,
    max: 1,
    unit: "%",
  },
  {
    name: "Sustain",
    min: 0,
    max: 1,
    unit: "%",
  },
  {
    name: "Release",
    min: 0,
    max: 1,
    unit: "%",
  },
];

function setup() {
  createCanvas(windowWidth, windowHeight);

  ftr = new p5.Filter("lowpass");
  env = new p5.Envelope();
  nse = new p5.Noise();

  nse.disconnect();
  nse.amp(env);

  ftr.process(nse);

  let val;
  for (a = 0; a < pots.length; a++) {
    val = random(pots[a].min, pots[a].max);
    pots[a].sldr = createSlider(pots[a].min, pots[a].max, val, 0.01);
    pots[a].sldr.position(0, height / 2 + 30 * a);
  }

  let names = ["Sine", "Triangle", "Saw", "Square"];
  let funcs = [setToSine, setToTriangle, setToSawtooth, setToSquare];
  for (a = 0; a < 4; a++) {
    button = createButton(names[a]);
    button.position(0, a * 30);
    button.mousePressed(funcs[a]);
  }

  names = ["Noise"];
  funcs = [toggleNoise];
  for (a = 0; a < 1; a++) {
    bx = createCheckbox(names[a]);
    bx.position(width - 30, a * 20 + 20);
    bx.changed(funcs[a]);
  }

  stroke(0);
}

function draw() {
  background(0);

  for (i = 0; i < keybrd.range; i++) {
    fill(
      255 - blackKeys[i % 12] * 100,
      255 - blackKeys[i % 12] * 230,
      255 - blackKeys[i % 12] * 230
    );

    let x = (width / keybrd.range) * i;
    let y = 0;
    let w = width / keybrd.range;
    let h = height / 2 - blackKeys[i % 12] * 30;

    rect(x, y, w, h);
  }

  stroke(255, 0, 0);
  fill(55);
  rect((width / 3) * 2, height / 2, width / 3, height / 2);
  renderADSR();
  stroke(0);
  fill(255, 0, 0);

  for (a = 0; a < pots.length; a++) {
    text(
      pots[a].name + " : " + pots[a].sldr.value() + " " + pots[a].unit,
      180,
      height / 2 + (a + 0.5) * 30
    );
  }

  ftr.freq(pots[0].sldr.value());

  env.setADSR(
    pots[1].sldr.value(),
    pots[2].sldr.value(),
    pots[3].sldr.value(),
    pots[4].sldr.value()
  );
  
  for (i = oscs.length - 1; i > 0; i--) {
    osc = oscs[i];
    let ampli = osc.getAmp()
    if (ampli === 0) {
      oscs.splice(0, 1)
    }
  }
}

function getFreq() {
  x = mouseX;
  let m = map(x, 0, width, 0, keybrd.range);
  x = floor(m) + keybrd.start;
  return notesFreqs[x];
}

function setToSine() {
  waveMode = "sine"
}
function setToTriangle() {
  waveMode = "triangle"
}
function setToSawtooth() {
  waveMode = "sawtooth"
}
function setToSquare() {
  waveMode = "square"
}

function mousePressed() {
  if (mouseY < height / 2 &&  oscs.length < 2) {
    nse.stop();

    osc = new p5.Oscillator(waveMode, getFreq());
    oscs.push(osc)

    osc.disconnect();
    osc.amp(env);

    ftr.process(osc);

    osc.start();
    if (noiseActive) {
      nse.start();
    }
    env.play();
  }
}

function renderADSR() {
  line((width / 3) * 2, height, width, height / 2);
  line((width / 3) * 2, height / 2, width, height);
}

function toggleNoise() {
  if (noiseActive === false) {
    noiseActive = true;
  } else {
    noiseActive = false;
  }
}
