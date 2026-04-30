(function () {
  function AudioManager(config) {
    this.config = config || {};
    this.audioContext = null;
    this.ambientSource = null;
    this.ambientStarted = false;
  }

  AudioManager.prototype.ensureContext = function () {
    if (!this.audioContext) {
      var Context = window.AudioContext || window.webkitAudioContext;
      if (Context) {
        this.audioContext = new Context();
      }
    }

    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    return this.audioContext;
  };

  AudioManager.prototype.startAmbient = function () {
    if (this.ambientStarted) {
      return;
    }

    var context = this.ensureContext();
    if (!context) {
      return;
    }

    var duration = 4;
    var frameCount = duration * context.sampleRate;
    var buffer = context.createBuffer(2, frameCount, context.sampleRate);

    for (var channel = 0; channel < 2; channel += 1) {
      var data = buffer.getChannelData(channel);
      var previous = 0;
      for (var index = 0; index < frameCount; index += 1) {
        previous = (previous + (Math.random() * 2 - 1) * 0.12) * 0.985;
        data[index] = previous;
      }
    }

    var source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    var filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;

    var gain = context.createGain();
    gain.gain.value = this.config.ambientVolume || 0.035;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();

    this.ambientSource = source;
    this.ambientStarted = true;
  };

  AudioManager.prototype.playUnlockSound = function () {
    var context = this.ensureContext();
    if (!context) {
      return;
    }

    var rootTime = context.currentTime;
    var notes = this.config.unlockChord || [523.25, 659.25, 783.99];

    notes.forEach(function (frequency, index) {
      var osc = context.createOscillator();
      var gain = context.createGain();
      var startTime = rootTime + index * 0.11;

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, startTime);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.085, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.68);

      osc.connect(gain);
      gain.connect(context.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.72);
    });
  };

  window.AudioManager = AudioManager;
})();
