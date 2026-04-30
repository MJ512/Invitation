(function () {
  var template = [
    '<section id="gallery" class="gallery section-shell">',
    '  <div class="gallery-wrapper" data-gallery-track></div>',
    '</section>'
  ].join("");

  function Component(options) {
    this.config = options.config.gallery;
    this.speed = 0.4; // 🔥 tweak speed (0.3–0.5 best)
  }

  Component.prototype.mount = function (mount) {
    this.root = WeddingUtils.mountTemplate(mount, template);
    this.wrapper = this.root.querySelector("[data-gallery-track]");

    // 🔥 duplicate items for seamless loop
    var items = this.config.items.concat(this.config.items);

    items.forEach((item) => {
      var card = document.createElement("div");
      card.className = "gallery-card";

      var img = document.createElement("img");
      img.src = item.src;
      img.className = "gallery-img";

      var caption = document.createElement("div");
      caption.className = "gallery-caption";
      caption.textContent = item.caption || "";

      card.appendChild(img);
      card.appendChild(caption);
      this.wrapper.appendChild(card);
    });

    this.initScroll();
    return this;
  };

  Component.prototype.initScroll = function () {
    const wrapper = this.wrapper;
    const speed = this.speed;

    let isInteracting = false;
    let scrollPos = 0;

    // 🔥 force scroll start
    wrapper.scrollLeft = 1;

    function animate() {
      if (!isInteracting) {
        scrollPos += speed;
        wrapper.scrollLeft = scrollPos;

        // 🔥 infinite loop reset
        if (wrapper.scrollLeft >= wrapper.scrollWidth / 2) {
          scrollPos = 0;
          wrapper.scrollLeft = 0;
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    /* =========================
       TOUCH (MOBILE)
    ========================= */
    wrapper.addEventListener("touchstart", () => {
      isInteracting = true;
    });

    wrapper.addEventListener("touchend", () => {
      setTimeout(() => {
        isInteracting = false;
      }, 800);
    });

    /* =========================
       MOUSE DRAG (DESKTOP)
    ========================= */
    let isDown = false;
    let startX;
    let scrollLeft;

    wrapper.addEventListener("mousedown", (e) => {
      isDown = true;
      isInteracting = true;
      startX = e.pageX - wrapper.offsetLeft;
      scrollLeft = wrapper.scrollLeft;
    });

    wrapper.addEventListener("mouseup", () => {
      isDown = false;
      setTimeout(() => {
        isInteracting = false;
      }, 800);
    });

    wrapper.addEventListener("mouseleave", () => {
      isDown = false;
      isInteracting = false;
    });

    wrapper.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - wrapper.offsetLeft;
      const walk = (x - startX) * 1.5;
      wrapper.scrollLeft = scrollLeft - walk;
    });
  };

  window.WeddingComponents = window.WeddingComponents || {};
  window.WeddingComponents.gallery = {
    mount: function (options) {
      return new Component(options).mount(options.mount);
    }
  };
})();