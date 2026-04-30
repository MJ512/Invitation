(function () {
  var template = [
    '<section id="hero" class="hero section-shell">',

    '  <div class="hero-cloud hero-cloud--left" aria-hidden="true"></div>',
    '  <div class="hero-cloud hero-cloud--right" aria-hidden="true"></div>',

    '  <div class="hero-characters" aria-hidden="true">',
    '    <img src="assets/images/boy.png" class="hero-character hero-left" alt="Boy" />',
    '    <img src="assets/images/girl.png" class="hero-character hero-right" alt="Bride" />',
    '  </div>',

    '  <div class="section-inner">',
    '    <div class="hero-content" data-hero-content>',
    '      <p class="hero-eyebrow" data-hero-eyebrow></p>',
    '      <h1 class="hero-names" data-hero-names></h1>',
    '      <p class="hero-date" data-hero-date></p>',
    '      <div class="hero-line" aria-hidden="true"></div>',
    '      <p class="hero-scroll-hint" data-hero-scroll></p>',
    '    </div>',
    '  </div>',

    '</section>'
  ].join("");

  function HeroComponent(options) {
    this.config = options.config;
  }

  HeroComponent.prototype.mount = function (mount) {
    this.root = WeddingUtils.mountTemplate(mount, template);
    this.content = this.root.querySelector("[data-hero-content]");

    WeddingUtils.setText(this.root.querySelector("[data-hero-eyebrow]"), this.config.couple.eyebrow);
    this.root.querySelector("[data-hero-names]").innerHTML =
      '<span class="hero-name-line">' +
      this.config.couple.partnerOne +
      '</span><span class="hero-amp">&amp;</span><span class="hero-name-line">' +
      this.config.couple.partnerTwo +
      "</span>";
    WeddingUtils.setText(
      this.root.querySelector("[data-hero-date]"),
      this.config.event.dateDisplay +
      (this.config.hero.dateSeparator || " · ") +
      (this.config.event.venueName || "")
    );
    WeddingUtils.setText(this.root.querySelector("[data-hero-scroll]"), this.config.hero.scrollHint);

    this.parallax = WeddingAnimations.createParallax(this.content, { speed: 0.08, limit: 36 });
    return this;
  };

  HeroComponent.prototype.animateIn = function () {
    this.root.classList.add("animate-in");
  };

  window.WeddingComponents = window.WeddingComponents || {};
  window.WeddingComponents.hero = {
    mount: function (options) {
      return new HeroComponent(options).mount(options.mount);
    },
    template: template
  };
})();
