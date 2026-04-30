(function () {
  var iconMarkup = {
    calendar: [
      '<svg viewBox="0 0 52 52" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">',
      '<rect x="8" y="12" width="36" height="32" rx="5" stroke="currentColor" stroke-width="1.5"/>',
      '<path d="M8 22H44" stroke="currentColor" stroke-width="1.5"/>',
      '<path d="M18 8V16M34 8V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      '<circle cx="26" cy="33" r="4.5" fill="rgba(201,168,76,0.18)" stroke="currentColor" stroke-width="1.2"/>',
      "</svg>"
    ].join(""),
    clock: [
      '<svg viewBox="0 0 52 52" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">',
      '<circle cx="26" cy="26" r="18" stroke="currentColor" stroke-width="1.5"/>',
      '<path d="M26 16V26L32 30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      '<circle cx="26" cy="26" r="2.25" fill="currentColor"/>',
      "</svg>"
    ].join(""),
    pin: [
      '<svg viewBox="0 0 52 52" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">',
      '<path d="M26 8C18.82 8 13 13.82 13 21C13 30.75 26 45 26 45S39 30.75 39 21C39 13.82 33.18 8 26 8Z" stroke="currentColor" stroke-width="1.5"/>',
      '<circle cx="26" cy="21" r="4.75" stroke="currentColor" stroke-width="1.5"/>',
      "</svg>"
    ].join("")
  };

  function createFragment(html) {
    var template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.cloneNode(true);
  }

  function mountTemplate(target, html) {
    target.innerHTML = "";
    target.appendChild(createFragment(html));
    return target.firstElementChild;
  }

  function linesToHtml(lines, className) {
    return lines
      .map(function (line) {
        return className ? '<span class="' + className + '">' + line + "</span>" : "<span>" + line + "</span>";
      })
      .join("<br>");
  }

  function setText(node, value) {
    if (node) {
      node.textContent = value;
    }
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function createImageWithFallback(item, className, fallbackClassName) {
    var wrapper = document.createElement("div");
    wrapper.className = className;

    var img = document.createElement("img");
    img.addEventListener("load", function () {
      wrapper.classList.add("is-loaded");
    });

    img.addEventListener("error", function () {
      wrapper.classList.add("is-fallback");
    });

    img.alt = item.alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = item.src;

    var fallback = document.createElement("div");
    fallback.className = fallbackClassName;
    fallback.setAttribute("aria-hidden", "true");

    wrapper.appendChild(img);
    wrapper.appendChild(fallback);
    return wrapper;
  }

  function applyVideoSources(video, videoConfig) {
    if (!video || !videoConfig) {
      return;
    }

    video.innerHTML = "";

    if (videoConfig.poster) {
      video.poster = videoConfig.poster;
    }

    (videoConfig.sources || []).forEach(function (sourceConfig) {
      var source = document.createElement("source");
      source.src = sourceConfig.src;
      source.type = sourceConfig.type;
      video.appendChild(source);
    });
  }

  function getInitials(name) {
    return (name || "")
      .split(/\s+/)
      .filter(Boolean)
      .map(function (part) {
        return part.charAt(0).toUpperCase();
      })
      .join("");
  }

  window.WeddingUtils = {
    applyVideoSources: applyVideoSources,
    clamp: clamp,
    createFragment: createFragment,
    createImageWithFallback: createImageWithFallback,
    getInitials: getInitials,
    iconMarkup: iconMarkup,
    linesToHtml: linesToHtml,
    mountTemplate: mountTemplate,
    setText: setText
  };
})();
