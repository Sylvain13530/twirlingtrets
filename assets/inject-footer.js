(function () {
  function setFooterYear(mount) {
    var year = mount.querySelector('#year');
    if (year) {
      year.textContent = new Date().getFullYear();
    }
  }

  function loadGoatCounter() {
    if (document.querySelector('script[data-goatcounter]')) {
      return;
    }

    var goatcounter = document.createElement('script');

    goatcounter.setAttribute(
      'data-goatcounter',
      'https://tbt.goatcounter.com/count'
    );

    goatcounter.async = true;
    goatcounter.src = 'https://gc.zgo.at/count.js';

    document.body.appendChild(goatcounter);
  }

  function injectFooter() {
    var mount = document.getElementById('site-footer');
    if (!mount) {
      return;
    }

    fetch('partials/footer.html', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) {
          throw new Error('no-partials');
        }

        return r.text();
      })
      .then(function (html) {
        mount.innerHTML = html;
        setFooterYear(mount);
        loadGoatCounter();
      })
      .catch(function () {
        fetch('footer.html', { cache: 'no-cache' })
          .then(function (r) {
            if (!r.ok) {
              throw new Error('no-root-footer');
            }

            return r.text();
          })
          .then(function (html) {
            mount.innerHTML = html;
            setFooterYear(mount);
            loadGoatCounter();
          })
          .catch(function () {
            /* noop */
          });
      });
  }

  document.addEventListener(
    'DOMContentLoaded',
    injectFooter
  );
})();
