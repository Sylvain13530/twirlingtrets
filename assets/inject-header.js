(function () {
  function injectHeader() {
    var mount = document.getElementById('site-header');
    if (!mount) return;

    // 1) tente partials/header.html, 2) sinon header.html (racine)
    fetch('partials/header.html', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('no-partials');
        return r.text();
      })
      .then(function (html) {
        mount.innerHTML = html;
        afterHeaderInjected();
      })
      .catch(function () {
        fetch('header.html', { cache: 'no-cache' })
          .then(function (r) { return r.text(); })
          .then(function (html) {
            mount.innerHTML = html;
            afterHeaderInjected();
          })
          .catch(function () { /* noop */ });
      });
  }

  function afterHeaderInjected() {
    try {
      // Marquee fallback JS si anim CSS off
      var track = document.getElementById('marqueeTrack');
      if (track) {
        var cssAnimOn = getComputedStyle(track).animationName !== 'none';
        if (!cssAnimOn) {
          var offset = 0;
          function tick() {
            offset -= 1;
            var half = track.scrollWidth / 2;
            if (Math.abs(offset) >= half) offset = 0;
            track.style.transform = 'translateX(' + offset + 'px)';
            requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      }

      // Cacher bandeau UNIQUEMENT sur buvette.html
      var hideBanner = /(^|\/)buvette\.html$/i.test(location.pathname);
      if (hideBanner) {
        var banner = document.querySelector('.banner');
        if (banner) banner.style.display = 'none';
      }

      // Lien actif dans la nav
      var links = document.querySelectorAll('header nav a[href]');
      var current = location.pathname.split('/').pop() || 'index.html';
      links.forEach(function (a) {
        if (a.getAttribute('href') === current) {
          a.setAttribute('data-active', 'true');
        }
      });
    } catch (e) { /* silence */ }
  }

  document.addEventListener('DOMContentLoaded', injectHeader);
})();
