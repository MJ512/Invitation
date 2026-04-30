(function () {
  var template = [
    '<section id="closing" class="closing section-shell">',
    '  <div class="closing-symbols" data-closing-symbols aria-hidden="true"></div>',
    '  <div class="section-inner closing-inner">',
    '    <div class="closing-message glass-panel" data-reveal>',
    '      <p class="closing-pre" data-closing-pre></p>',
    '      <h2 class="closing-quote" data-closing-quote></h2>',
    '      <p class="closing-sub" data-closing-sub></p>',
    '      <div class="closing-date-badge glass-panel" data-closing-badge></div>',
    '      <div class="closing-names-footer" data-closing-names></div>',
    "    </div>",
    "  </div>",
    "</section>"
  ].join("");

  function ClosingComponent(options) {
    this.config = options.config;
  }

  ClosingComponent.prototype.mount = function (mount) {
    this.root = WeddingUtils.mountTemplate(mount, template);
    var closingConfig = this.config.closing;

    WeddingUtils.setText(this.root.querySelector("[data-closing-pre]"), closingConfig.preface);
    this.root.querySelector("[data-closing-quote]").innerHTML = closingConfig.quoteHtml;
    WeddingUtils.setText(this.root.querySelector("[data-closing-sub]"), closingConfig.subtext);
    this.root.querySelector("[data-closing-names]").innerHTML =
      this.config.couple.partnerOne + ' <span class="and">&amp;</span> ' + this.config.couple.partnerTwo;

    var badge = this.root.querySelector("[data-closing-badge]");
    closingConfig.badgeItems.forEach(function (item, index) {
      var text = document.createElement("span");
      text.className = "closing-badge-item";
      text.textContent = item;
      badge.appendChild(text);

      if (index < closingConfig.badgeItems.length - 1) {
        var dot = document.createElement("span");
        dot.className = "closing-badge-dot";
        dot.setAttribute("aria-hidden", "true");
        badge.appendChild(dot);
      }
    });

    /* ===============================
   FAMILY SECTION
================================ */
if (closingConfig.family && Array.isArray(closingConfig.family)) {
  var familyContainer = document.createElement("div");
  familyContainer.className = "closing-family";

  closingConfig.family.forEach(function (group) {
    var block = document.createElement("div");
    block.className = "family-block";

    var title = document.createElement("h4");
    title.className = "family-title";
    title.textContent = group.title || "";

    var names = document.createElement("p");
    names.className = "family-names";
    names.innerHTML = (group.names || []).join("<br>");

    block.appendChild(title);
    block.appendChild(names);
    familyContainer.appendChild(block);
  });

  this.root.querySelector(".closing-message").appendChild(familyContainer);
}

/* ===============================
   CONTACT
================================ */
if (closingConfig.contact && Array.isArray(closingConfig.contact)) {
  var contact = document.createElement("p");
  contact.className = "closing-contact";
  contact.innerHTML = closingConfig.contact.join(" &nbsp; | &nbsp; ");
  this.root.querySelector(".closing-message").appendChild(contact);
}

    var symbols = this.root.querySelector("[data-closing-symbols]");
    closingConfig.symbols.forEach(function (symbol) {
      var node = document.createElement("span");
      node.className = "closing-symbol";
      node.textContent = symbol.char;
      node.style.top = symbol.top || "auto";
      node.style.left = symbol.left || "auto";
      node.style.right = symbol.right || "auto";
      node.style.bottom = symbol.bottom || "auto";
      node.style.fontSize = symbol.size || "5rem";
      node.style.animationDelay = symbol.delay || "0s";
      symbols.appendChild(node);
    });

    WeddingAnimations.createRevealObserver(this.root.querySelectorAll("[data-reveal]"), { threshold: 0.3 });
    return this;
  };

  window.WeddingComponents = window.WeddingComponents || {};
  window.WeddingComponents.closing = {
    mount: function (options) {
      return new ClosingComponent(options).mount(options.mount);
    },
    template: template
  };
})();
