/*
 * Header Parallax
 * Shared by all project pages. Makes the header background image scroll up
 * more slowly than the page content (vertical parallax).
 *
 * How it works: the header backgrounds are fixed to the window in style.css
 * (background-attachment: fixed), so on their own they stay still while the
 * content slides over them. This script moves the image up at a fraction of
 * the scroll speed (SPEED), so it drifts slowly instead of standing still.
 * When a header is taller than the window, the image is scaled up just enough
 * that its bottom edge never shows while it moves.
 *
 * It only runs where fixed backgrounds work and motion is welcome: screens
 * 768px and wider, with a mouse or trackpad, and when the visitor has not
 * asked their system to reduce motion. Everywhere else the header looks and
 * behaves exactly as before. Pages without a project header are unaffected.
 */
(function () {
  var SPEED = 0.4; // 0 = image stands still, 1 = image scrolls with the page

  var header = document.getElementById('project_header');
  if (!header || !window.matchMedia) return;

  var layers = Array.prototype.slice.call(
    header.querySelectorAll('[class*="project_intro_"]')
  ).map(function (el) { return { el: el, w: 0, h: 0 }; });
  if (!layers.length) return;

  var enabledQuery = window.matchMedia(
    '(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
  );
  var ticking = false;

  // Read each layer's image size so it can be scaled like "cover".
  layers.forEach(function (layer) {
    var match = /url\(["']?(.*?)["']?\)/.exec(getComputedStyle(layer.el).backgroundImage);
    if (!match) return;
    var img = new Image();
    img.onload = function () {
      layer.w = img.naturalWidth;
      layer.h = img.naturalHeight;
      requestUpdate();
    };
    img.src = match[1];
  });

  function reset() {
    layers.forEach(function (layer) {
      layer.el.style.backgroundSize = '';
      layer.el.style.backgroundPosition = '';
    });
  }

  function update() {
    ticking = false;
    if (!enabledQuery.matches) { reset(); return; }

    var y = window.pageYOffset;
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var headerHeight = header.offsetHeight;
    if (header.getBoundingClientRect().bottom <= 0) return; // out of view

    // Area the image must cover: the window, plus a little extra when the
    // header is taller than the window, so the image never runs short.
    var boxHeight = vh + SPEED * Math.max(0, headerHeight - vh);
    var shift = y * SPEED;

    layers.forEach(function (layer) {
      if (!layer.w || !layer.h) return; // image not loaded yet
      var scale = Math.max(vw / layer.w, boxHeight / layer.h);
      var w = layer.w * scale;
      var h = layer.h * scale;
      var top = (boxHeight - h) / 2 - shift;
      layer.el.style.backgroundSize = w.toFixed(1) + 'px ' + h.toFixed(1) + 'px';
      layer.el.style.backgroundPosition = 'center ' + top.toFixed(1) + 'px';
    });
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  if (enabledQuery.addEventListener) {
    enabledQuery.addEventListener('change', requestUpdate);
  } else if (enabledQuery.addListener) {
    enabledQuery.addListener(requestUpdate);
  }
  update();
})();
