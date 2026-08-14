(function () {
  function setFooterYear(mount) {
    var year = mount.querySelector('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  function injectFooter() {
    var mount = document.getElementById('site-footer');
    if (!mount) return;

    fetch('partials/footer.html', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('no-partials');
        return r.text();
      })
      .then(function (html) {
        mount.innerHTML = html;
        setFooterYear(mount);
      })
      .catch(function () {
        fetch('footer.html', { cache: 'no-cache' })
          .then(function (r) {
            if (!r.ok) throw new Error('no-root-footer');
            return r.text();
          })
          .then(function (html) {
            mount.innerHTML = html;
            setFooterYear(mount);
          })
          .catch(function () { /* noop */ });
      });
  }

  document.addEventListener('DOMContentLoaded', injectFooter);
})();
