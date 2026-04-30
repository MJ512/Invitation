(function () {
  function CursorManager() {
    this.cursor = document.querySelector(".cursor");
    this.halo = document.querySelector(".cursor-halo");
    this.pointerX = 0;
    this.pointerY = 0;
    this.haloX = 0;
    this.haloY = 0;
    this.rafId = 0;
  }

  CursorManager.prototype.init = function () {
    if (!this.cursor || !this.halo || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    var self = this;
    document.addEventListener("pointermove", function (event) {
      self.pointerX = event.clientX;
      self.pointerY = event.clientY;
      self.cursor.style.left = self.pointerX + "px";
      self.cursor.style.top = self.pointerY + "px";
      if (!self.rafId) {
        self.rafId = requestAnimationFrame(self.animate.bind(self));
      }
    });
  };

  CursorManager.prototype.animate = function () {
    this.rafId = 0;
    this.haloX += (this.pointerX - this.haloX) * 0.16;
    this.haloY += (this.pointerY - this.haloY) * 0.16;
    this.halo.style.left = this.haloX + "px";
    this.halo.style.top = this.haloY + "px";
    this.rafId = requestAnimationFrame(this.animate.bind(this));
  };

  function WeddingApp(config) {
    this.config = config;
    this.audioManager = new AudioManager(config.audio);
    this.mainSite = document.getElementById("main-site");
    this.components = {};
    this.cursorManager = new CursorManager();
  }

  WeddingApp.prototype.initMeta = function () {
    document.title = this.config.meta.title;
    var description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", this.config.meta.description);
    }
  };

  WeddingApp.prototype.mountComponents = function () {
    this.components.hero = window.WeddingComponents.hero.mount({
      mount: document.getElementById("hero-root"),
      config: this.config
    });


    this.components.details = window.WeddingComponents.details.mount({
      mount: document.getElementById("details-root"),
      config: this.config
    });

    this.components.gallery = window.WeddingComponents.gallery.mount({
      mount: document.getElementById("gallery-root"),
      config: this.config
    });

    this.components.closing = window.WeddingComponents.closing.mount({
      mount: document.getElementById("closing-root"),
      config: this.config
    });

    this.components.intro = window.WeddingComponents.intro.mount({
      mount: document.getElementById("intro-root"),
      config: this.config,
      audioManager: this.audioManager,
      onUnlock: this.onUnlock.bind(this)
    });
  };

  WeddingApp.prototype.onUnlock = function () {
    this.mainSite.classList.add("is-visible");
    this.mainSite.dataset.siteState = "unlocked";
    this.mainSite.removeAttribute("aria-hidden");

    if (this.components.hero && this.components.hero.animateIn) {
      this.components.hero.animateIn();
    }
  };

  WeddingApp.prototype.init = function () {
    this.initMeta();
    this.cursorManager.init();
    this.mountComponents();
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.WEDDING_CONFIG) {
      throw new Error("Missing wedding configuration.");
    }

    new WeddingApp(window.WEDDING_CONFIG).init();
  });
})();
