(function () {
  function createRevealObserver(elements, options) {
    var config = options || {};
    var threshold = config.threshold || 0.18;
    var visibleClass = config.visibleClass || "is-visible";

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(elements, function (element) {
        element.classList.add(visibleClass);
      });
      return { disconnect: function () {} };
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
            if (!config.repeat) {
              observer.unobserve(entry.target);
            }
          } else if (config.repeat) {
            entry.target.classList.remove(visibleClass);
          }
        });
      },
      { threshold: threshold }
    );

    Array.prototype.forEach.call(elements, function (element) {
      observer.observe(element);
    });

    return observer;
  }

  function createParallax(element, options) {
    if (!element) {
      return { destroy: function () {} };
    }

    var config = options || {};
    var speed = config.speed || 0.14;
    var limit = config.limit || 48;
    var rafId = 0;

    function render() {
      rafId = 0;
      var offset = Math.max(Math.min(window.scrollY * speed, limit), -limit);
      element.style.setProperty("--parallax-y", offset.toFixed(2) + "px");
    }

    function onScroll() {
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    }

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return {
      destroy: function () {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      }
    };
  }

  function createMarquee(track, options) {
    if (!track) {
      return { destroy: function () {} };
    }

    var config = options || {};
    var speed = typeof config.speed === "number" ? config.speed : 18;
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isPaused = prefersReducedMotion;
    var offset = 0;
    var loopWidth = 0;
    var rafId = 0;
    var lastTime = 0;

    function measure() {
      var primarySet = track.querySelector("[data-gallery-set='primary']");
      loopWidth = primarySet ? primarySet.getBoundingClientRect().width : 0;
      track.style.transform = "translate3d(" + offset.toFixed(2) + "px, 0, 0)";
    }

    function tick(time) {
      if (!lastTime) {
        lastTime = time;
      }

      var delta = time - lastTime;
      lastTime = time;

      if (!isPaused && loopWidth > 0) {
        offset -= (speed * delta) / 1000;
        if (Math.abs(offset) >= loopWidth) {
          offset += loopWidth;
        }
        track.style.transform = "translate3d(" + offset.toFixed(2) + "px, 0, 0)";
      }

      rafId = requestAnimationFrame(tick);
    }

    function pause() {
      isPaused = true;
    }

    function resume() {
      if (!prefersReducedMotion) {
        isPaused = false;
      }
    }

    measure();
    rafId = requestAnimationFrame(tick);

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resume);
    track.addEventListener("focusin", pause);
    track.addEventListener("focusout", resume);
    window.addEventListener("resize", measure);

    return {
      destroy: function () {
        cancelAnimationFrame(rafId);
        track.removeEventListener("mouseenter", pause);
        track.removeEventListener("mouseleave", resume);
        track.removeEventListener("focusin", pause);
        track.removeEventListener("focusout", resume);
        window.removeEventListener("resize", measure);
      }
    };
  }

  window.WeddingAnimations = {
    createMarquee: createMarquee,
    createParallax: createParallax,
    createRevealObserver: createRevealObserver
  };
})();
