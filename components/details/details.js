(function () {
  var template = [
    '<section id="details" class="details section-shell">',
    '  <div class="section-inner">',
    '    <header class="section-header">',
    '      <span class="section-tag" data-details-tag></span>',
    '      <h2 class="section-title" data-details-title></h2>',
    "    </header>",
    '    <div class="details-stage">',
    '      <div class="details-aura" aria-hidden="true"></div>',
    '      <div class="details-cards" data-details-cards></div>',
    "    </div>",
    "  </div>",
    "</section>"
  ].join("");

  function DetailsComponent(options) {
    this.config = options.config.details;
  }

  DetailsComponent.prototype.mount = function (mount) {
    this.root = WeddingUtils.mountTemplate(mount, template);
    WeddingUtils.setText(this.root.querySelector("[data-details-tag]"), this.config.tag);
    this.root.querySelector("[data-details-title]").innerHTML = this.config.titleHtml;

    var list = this.root.querySelector("[data-details-cards]");
    var featuredIndex = typeof this.config.featuredIndex === "number" ? this.config.featuredIndex : 1;

    this.config.cards.forEach(function (card, index) {
      var shell = document.createElement("div");
      shell.className = "detail-card-shell";
      shell.setAttribute("data-reveal", "");
      shell.setAttribute("data-slot", index.toString());

      var article = document.createElement("article");
      article.className = "detail-card glass-panel";
      if (index === featuredIndex) {
        article.classList.add("detail-card--featured");
      }

      article.innerHTML =
        '<div class="detail-icon">' +
        WeddingUtils.iconMarkup[card.icon] +
        "</div>" +
        '<p class="detail-label">' +
        card.label +
        "</p>" +
        '<p class="detail-value">' +
        card.valueLines.join("<br>") +
        "</p>" +
        '<p class="detail-sub">' +
        card.sub +
        "</p>";

      shell.appendChild(article);
      list.appendChild(shell);
    });

    WeddingAnimations.createRevealObserver(this.root.querySelectorAll("[data-reveal]"), { threshold: 0.2 });
    return this;
  };

  window.WeddingComponents = window.WeddingComponents || {};
  window.WeddingComponents.details = {
    mount: function (options) {
      return new DetailsComponent(options).mount(options.mount);
    },
    template: template
  };
})();
