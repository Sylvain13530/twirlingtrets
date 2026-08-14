(function () {

  function injectHeader() {

    var mount = document.getElementById('site-header');

    if (!mount) return;


    // 1) tente partials/header.html
    // 2) sinon header.html à la racine
    fetch('partials/header.html', { cache: 'no-cache' })

      .then(function (r) {

        if (!r.ok) {
          throw new Error('no-partials');
        }

        return r.text();

      })

      .then(function (html) {

        mount.innerHTML = html;

        afterHeaderInjected();

      })

      .catch(function () {

        fetch('header.html', { cache: 'no-cache' })

          .then(function (r) {
            return r.text();
          })

          .then(function (html) {

            mount.innerHTML = html;

            afterHeaderInjected();

          })

          .catch(function () {
            /* noop */
          });

      });

  }


  function afterHeaderInjected() {

    try {

      /*
       * ============================
       * BANDEAU GLOBAL
       * ============================
       */

      var banner = document.querySelector('.banner');
      var track = document.getElementById('marqueeTrack');


      // Bandeau masqué par défaut
      if (banner) {
        banner.style.display = 'none';
      }


      /*
       * Charge la configuration générale
       * depuis assets/site.json
       */

      fetch('assets/site.json', { cache: 'no-cache' })

        .then(function (response) {

          if (!response.ok) {

            throw new Error(
              'Impossible de charger assets/site.json'
            );

          }

          return response.json();

        })

        .then(function (data) {

          if (!banner || !track) {
            return;
          }


          /*
           * On conserve le comportement existant :
           * pas de bandeau sur buvette.html
           */

          var hideBanner =
            /(^|\/)buvette\.html$/i.test(
              location.pathname
            );


          if (
            data.bandeauActif !== true ||
            hideBanner
          ) {

            banner.style.display = 'none';

            return;

          }


          var text =
            String(
              data.bandeauTexte || ''
            ).trim();


          if (!text) {

            banner.style.display = 'none';

            return;

          }


          /*
           * Deux exemplaires du texte permettent
           * de créer le défilement continu.
           */

          track.innerHTML =
            '<span class="marquee__item"></span>' +
            '<span class="marquee__item"></span>';


          var items =
            track.querySelectorAll(
              '.marquee__item'
            );


          items.forEach(function (item) {

            item.textContent = text;

          });


          banner.style.display = 'block';


          /*
           * Fallback JS si l'animation CSS
           * n'est pas disponible
           */

          var cssAnimOn =
            getComputedStyle(track)
              .animationName !== 'none';


          if (!cssAnimOn) {

            var offset = 0;


            function tick() {

              offset -= 1;

              var half =
                track.scrollWidth / 2;


              if (
                Math.abs(offset) >= half
              ) {

                offset = 0;

              }


              track.style.transform =
                'translateX(' +
                offset +
                'px)';


              requestAnimationFrame(tick);

            }


            requestAnimationFrame(tick);

          }

        })

        .catch(function (error) {

          console.error(error);

          // En cas d'erreur :
          // le bandeau reste simplement masqué.

          if (banner) {
            banner.style.display = 'none';
          }

        });


      /*
       * ============================
       * LIEN ACTIF DANS LA NAV
       * ============================
       */

      var links =
        document.querySelectorAll(
          'header nav a[href]'
        );


      var current =
        location.pathname
          .split('/')
          .pop() ||
        'index.html';


      links.forEach(function (a) {

        if (
          a.getAttribute('href') === current
        ) {

          a.setAttribute(
            'data-active',
            'true'
          );

        }

      });


    } catch (e) {

      /* silence */

    }

  }


  document.addEventListener(
    'DOMContentLoaded',
    injectHeader
  );

})();
