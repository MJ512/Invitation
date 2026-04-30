(function () {
  var template = [
    '<section class="intro" data-intro>',
    '  <div class="intro-media" data-intro-media>',
    '    <video class="intro-video" data-intro-video autoplay muted loop playsinline preload="metadata"></video>',
    '    <div class="intro-poster" data-intro-poster aria-hidden="true"></div>',
    '    <div class="intro-overlay" aria-hidden="true"></div>',
    '    <div class="intro-glow" data-intro-glow aria-hidden="true"></div>',
    '    <div class="intro-particles" data-intro-particles aria-hidden="true"></div>',
    "  </div>",
    '  <div class="intro-card glass-panel glass-panel--luminous" data-intro-card>',
    '    <div class="intro-reflection" aria-hidden="true"></div>',
    '    <div class="intro-monogram" data-intro-monogram></div>',
    '    <div class="intro-divider" aria-hidden="true"></div>',
    '    <p class="intro-subtitle" data-intro-subtitle></p>',
    '    <div class="intro-slider" data-intro-slider>',
    '      <div class="intro-slider-fill" data-slider-fill aria-hidden="true"></div>',
    '      <div class="intro-slider-label" data-slider-label></div>',
    '      <button type="button" class="intro-slider-thumb" data-slider-thumb aria-label="">',
    '        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">',
    '          <path d="M8 5L16 12L8 19" stroke="rgba(42,31,20,0.86)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "        </svg>",
    "      </button>",
    "    </div>",
    "  </div>",
    "</section>"
  ].join("");

  function IntroComponent(options) {
    this.config = options.config;
    this.audioManager = options.audioManager;
    this.onUnlock = options.onUnlock || function () {};
    this.progress = 0;
    this.dragging = false;
    this.unlocked = false;
    this.travel = 0;
    this.pointerTargetX = window.innerWidth * 0.5;
    this.pointerTargetY = window.innerHeight * 0.5;
    this.pointerCurrentX = this.pointerTargetX;
    this.pointerCurrentY = this.pointerTargetY;
    this.glowRafId = 0;
  }

  IntroComponent.prototype.mount = function (mount) {
    this.root = WeddingUtils.mountTemplate(mount, template);
    this.video = this.root.querySelector("[data-intro-video]");
    this.poster = this.root.querySelector("[data-intro-poster]");
    this.card = this.root.querySelector("[data-intro-card]");
    this.glow = this.root.querySelector("[data-intro-glow]");
    this.particles = this.root.querySelector("[data-intro-particles]");
    this.slider = this.root.querySelector("[data-intro-slider]");
    this.thumb = this.root.querySelector("[data-slider-thumb]");
    this.label = this.root.querySelector("[data-slider-label]");
    this.monogram = this.root.querySelector("[data-intro-monogram]");
    this.subtitle = this.root.querySelector("[data-intro-subtitle]");

    this.renderContent();
    this.setupVideo();
    this.createParticles();
    this.setupPointerLight();
    this.setupSlider();

    return this;
  };

  IntroComponent.prototype.renderContent = function () {
    var introConfig = this.config.intro;
    var monogram =
      this.config.couple.monogram ||
      WeddingUtils.getInitials(this.config.couple.partnerOne) + " & " + WeddingUtils.getInitials(this.config.couple.partnerTwo);

    WeddingUtils.setText(this.monogram, monogram);
    WeddingUtils.setText(this.subtitle, introConfig.subtitle);
    WeddingUtils.setText(this.label, introConfig.swipeLabel);
    this.thumb.setAttribute("aria-label", introConfig.unlockAriaLabel || "Unlock");

    if (introConfig.video.poster) {
      this.poster.style.backgroundImage = "url('" + introConfig.video.poster + "')";
    }
  };

  IntroComponent.prototype.setupVideo = function () {
    var self = this;
    WeddingUtils.applyVideoSources(this.video, this.config.intro.video);

    function revealVideo() {
      self.root.classList.add("has-video");
    }

    this.video.addEventListener("canplay", revealVideo, { once: true });
    this.video.addEventListener("playing", revealVideo, { once: true });
    this.video.addEventListener("error", function () {
      self.root.classList.remove("has-video");
    });

    if (this.video.children.length > 0) {
      var playResult = this.video.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(function () {});
      }
    }
  };

  IntroComponent.prototype.createParticles = function () {
    var count = this.config.intro.particleCount || 24;

    for (var index = 0; index < count; index += 1) {
      var particle = document.createElement("span");
      var size = 1 + Math.random() * 2.5;
      particle.className = "intro-particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
      particle.style.animationDuration = 8 + Math.random() * 8 + "s";
      particle.style.animationDelay = Math.random() * 6 + "s";
      particle.style.setProperty("--drift-x", (Math.random() * 60 - 30).toFixed(2) + "px");
      this.particles.appendChild(particle);
    }
  };

  IntroComponent.prototype.setupPointerLight = function () {
    var self = this;

    function updateGlow() {
      self.glowRafId = 0;
      self.pointerCurrentX += (self.pointerTargetX - self.pointerCurrentX) * 0.14;
      self.pointerCurrentY += (self.pointerTargetY - self.pointerCurrentY) * 0.14;
      self.glow.style.transform =
        "translate3d(" + self.pointerCurrentX.toFixed(2) + "px, " + self.pointerCurrentY.toFixed(2) + "px, 0)";

      var cardRect = self.card.getBoundingClientRect();
      var cardX = WeddingUtils.clamp(((self.pointerTargetX - cardRect.left) / cardRect.width) * 100, 0, 100);
      var cardY = WeddingUtils.clamp(((self.pointerTargetY - cardRect.top) / cardRect.height) * 100, 0, 100);
      self.card.style.setProperty("--reflect-x", cardX.toFixed(2) + "%");
      self.card.style.setProperty("--reflect-y", cardY.toFixed(2) + "%");

      if (!self.unlocked) {
        self.glowRafId = requestAnimationFrame(updateGlow);
      }
    }

    function onPointerMove(event) {
      self.pointerTargetX = event.clientX;
      self.pointerTargetY = event.clientY;
      if (!self.glowRafId) {
        self.glowRafId = requestAnimationFrame(updateGlow);
      }
    }

    this.root.addEventListener("pointermove", onPointerMove);
    this.root.addEventListener("pointerdown", onPointerMove);
    this.glowRafId = requestAnimationFrame(updateGlow);
  };

  IntroComponent.prototype.setupSlider = function () {
    var self = this;

    function computeMetrics() {
      var sliderStyle = window.getComputedStyle(self.slider);
      var padLeft = parseFloat(sliderStyle.paddingLeft) || 0;
      var padRight = parseFloat(sliderStyle.paddingRight) || 0;
      self.travel = Math.max(self.slider.clientWidth - self.thumb.offsetWidth - padLeft - padRight, 1);
      self.slider.style.setProperty("--slider-travel", self.travel.toFixed(2) + "px");
    }

    function renderProgress(progress) {
      self.progress = WeddingUtils.clamp(progress, 0, 1);
      self.slider.style.setProperty("--progress", self.progress.toFixed(4));
      self.label.style.opacity = Math.max(0.06, 1 - self.progress * 1.8).toFixed(2);
    }

    function pointerToProgress(clientX) {
      var rect = self.slider.getBoundingClientRect();
      var style = window.getComputedStyle(self.slider);
      var padLeft = parseFloat(style.paddingLeft) || 0;
      var thumbHalf = self.thumb.offsetWidth / 2;
      var raw = clientX - rect.left - padLeft - thumbHalf;
      return raw / self.travel;
    }

    function snapTo(value) {
      self.slider.classList.add("is-animating");
      renderProgress(value);
      window.setTimeout(function () {
        self.slider.classList.remove("is-animating");
      }, 380);
    }

    function unlock() {
      if (self.unlocked) {
        return;
      }

      self.unlocked = true;
      WeddingUtils.setText(self.label, self.config.intro.successLabel || "Welcome");
      snapTo(1);
      self.audioManager.playUnlockSound();
      self.audioManager.startAmbient();
      self.root.classList.add("is-hidden");
      window.setTimeout(self.onUnlock, 560);
    }

    function onPointerDown(event) {
      if (self.unlocked) {
        return;
      }

      self.dragging = true;
      self.slider.classList.remove("is-animating");
      if (event.pointerId !== undefined) {
        self.slider.setPointerCapture(event.pointerId);
      }
      renderProgress(pointerToProgress(event.clientX));
    }

    function onPointerMove(event) {
      if (!self.dragging || self.unlocked) {
        return;
      }

      renderProgress(pointerToProgress(event.clientX));
      if (self.progress >= 0.98) {
        self.dragging = false;
        unlock();
      }
    }

    function onPointerEnd() {
      if (!self.dragging || self.unlocked) {
        return;
      }

      self.dragging = false;
      if (self.progress >= 0.96) {
        unlock();
      } else {
        snapTo(0);
      }
    }

    this.thumb.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        unlock();
      }
    });

    this.slider.addEventListener("pointerdown", onPointerDown);
    this.slider.addEventListener("pointermove", onPointerMove);
    this.slider.addEventListener("pointerup", onPointerEnd);
    this.slider.addEventListener("pointercancel", onPointerEnd);
    window.addEventListener("resize", computeMetrics);

    computeMetrics();
    renderProgress(0);
  };

  window.WeddingComponents = window.WeddingComponents || {};
  window.WeddingComponents.intro = {
    mount: function (options) {
      return new IntroComponent(options).mount(options.mount);
    },
    template: template
  };
})();
