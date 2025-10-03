(function () {
  function injectHeader() {
    var mount = document.getElementById('site-header');
    if (!mount) return;

    fetch('partials/header.html', { cache: 'no-cache' })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        mount.innerHTML = html;
        afterHeaderInjected();
      })
      .catch(function () { /* noop */ });
  }

  function afterHeaderInjected() {
    try {
      // ----- Marquee: fallback JS si l'anim CSS est désactivée -----
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

      // ----- Bandeau: cacher UNIQUEMENT sur la page buvette.html -----
      var hideBanner = /(^|\/)buvette\.html$/i.test(location.pathname);
      if (hideBanner) {
        var banner = document.querySelector('.banner');
        if (banner) banner.style.display = 'none';
      }

      // ----- Popup auto (1er janv. -> 26 avril 2026), mémorisation fermeture -----
      var popup = document.getElementById('popup');
      var btnClose = document.getElementById('closePopup');
      if (popup && btnClose) {
        var today = new Date();
        var start = new Date('2026-01-01T00:00:00');
        var end = new Date('2026-04-26T23:59:59');
        var dismissed = localStorage.getItem('popupDismissed2026') === '1';
        if (!dismissed && today >= start && today <= end) {
          popup.style.display = 'flex';
        }
        btnClose.addEventListener('click', function () {
          popup.style.display = 'none';
          localStorage.setItem('popupDismissed2026', '1');
        });
      }

      // ----- Lien actif dans la nav -----
      var links = document.querySelectorAll('header nav a[href]');
      var current = location.pathname.split('/').pop() || 'index.html';
      links.forEach(function (a) {
        if (a.getAttribute('href') === current) {
          a.setAttribute('data-active', 'true');
        }
      });
    } catch (e) {
      // silence is golden :)
    }
  }

  document.addEventListener('DOMContentLoaded', injectHeader);
})();
