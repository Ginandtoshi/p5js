// VIS145B: Time and Process-Based Digital Media II
// Author: Jinying(Helen) Xie
// Date: 2024/11/03
// Description: pixel arts in reaction to sound input.
//              color would change based on the pitch, tempo, and volume.
//
// Reference: https://editor.p5js.org/Scatropolis/sketches/UJJR7OYcA
//            https://www.youtube.com/watch?v=vj9nDja8ZdQ
//            https://www.youtube.com/watch?v=j8fZFA7KrNQ


// Variables
var pxSize = 30;
let fft, pitch, amp, song, hue;
let prevPeak = 0;
let beatTime = 0;
let bpm = 0;
let delayCount = 0;
let delayTime = 30;

function preload(){
  // song = loadSound('jazz2.m4a');
  song = loadSound('music2.m4a');
}

// Set up
function setup() {
  createCanvas(800, 600);
  colorMode(HSL);
  
  song.play();

  amp = new p5.Amplitude();
  amp.setInput(song);

  fft = new p5.FFT();
  fft.setInput(song);
}


// Draw
function draw() {
  noStroke();
  let spectrum = fft.analyze();   // tempo
  let level = amp.getLevel();     // volume
  
  // Find the peak frequency and amplitude
  let peakAmp = 0;
  let peakFreq = 0;
  for (let i = 0; i < spectrum.length; i++) {
    if (spectrum[i] > peakAmp) {
      peakAmp = spectrum[i];
      peakFreq = i;
    }
  }

  // Detect onsets based on peak amplitude
  if (peakAmp > prevPeak * 1.5) {
    let currentTime = millis();
    let interval = currentTime - beatTime;
    beatTime = currentTime;


    // Calculate BPM based on the interval between beats
    bpm = 60000 / interval;
  }

  // Visualize the BPM
  // text("BPM: " + bpm, 10, 20);
  prevPeak = peakAmp;


  //draw pixels
  if (frameCount % delayTime === 0) {
    for (let y = 0; y < height; y += pxSize) {
      for (let x = 0; x < width; x += pxSize) {
        let H;
        // = map(peakFreq, 0, spectrum.length, 0, 360);
        // if (peakFreq > 10 && peakFreq < 75) {
        //   // red hue  
        //   H = map(peakFreq, 0, spectrum.length, 0, 120);       
        // } else if (peakFreq >= 75 && peakFreq < 100) {
        //   // green hue
        //   H = map(peakFreq, 0, spectrum.length, 120, 240);       
        // } else if (peakFreq >= 100) {
        //   // blue hue
        //   H = map(peakFreq, 0, spectrum.length, 240, 360);  
        // } else {
        //   H = random(360);
        // }

        if (peakFreq < 50 && peakFreq > 0) {
          H = random(0, 30); // Reddish hues
        } else if (peakFreq >= 50 && peakFreq < 100) {
          H = random(30, 60); // Orange hues
        } else if (peakFreq >= 100 && peakFreq < 150) {
          H = random(60, 120); // Yellowish hues
        } else if (peakFreq >= 150 && peakFreq < 200) {
          H = random(120, 180); // Greenish-yellow hues
        } else if (peakFreq >= 200 && peakFreq < 250) {
          H = random(180, 240); // Greenish-cyan hues
        } else {
          H = random(360);
        }

        let S = map(bpm, 60, 180, 0, 100);
        let L = map(level, 0, 1, 20, 100);     

        // hue change based on pitch.
        // saturation change based on tempo.
        // brightness change based on volume.
        fill(H,S,L);
        square(x, y, pxSize);
      }
    }
  }  
}