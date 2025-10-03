(function () {
  function injectFooter() {
    var mount = document.getElementById('site-footer');
    if (!mount) return;

    fetch('partials/footer.html', { cache: 'no-cache' })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        mount.innerHTML = html;
      })
      .catch(function () { /* noop */ });
  }

  document.addEventListener('DOMContentLoaded', injectFooter);
})();
