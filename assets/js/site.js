(function () {
  'use strict';

  var root = document.documentElement;
  var menuButton = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-nav]');
  var translations = document.querySelectorAll('[data-fr][data-en]');
  var translatedImages = document.querySelectorAll('[data-alt-fr][data-alt-en]');
  var translatedLabels = document.querySelectorAll('[data-aria-fr][data-aria-en]');
  var descriptions = {
    fr: 'Des jeux prêts à jouer pour les familles, les amis et les rassemblements. Sakidoo prépare les jeux; vous profitez du monde autour de vous.',
    en: 'Ready-to-play games for families, friends, and gatherings. Sakidoo prepares the games; you enjoy the people around you.'
  };
  var titles = {
    fr: 'Sakidoo Studio | Du fun prêt à jouer',
    en: 'Sakidoo Studio | Ready-to-play fun'
  };

  function setLanguage(lang) {
    if (lang !== 'fr' && lang !== 'en') return;
    root.lang = lang;
    translations.forEach(function (element) {
      element.textContent = element.getAttribute('data-' + lang);
    });
    translatedImages.forEach(function (image) {
      image.alt = image.getAttribute('data-alt-' + lang);
    });
    translatedLabels.forEach(function (element) {
      element.setAttribute('aria-label', element.getAttribute('data-aria-' + lang));
    });
    document.querySelectorAll('[data-lang]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    });
    document.title = titles[lang];
    document.querySelector('meta[name="description"]').content = descriptions[lang];
    document.querySelector('meta[property="og:title"]').content = titles[lang];
    document.querySelector('meta[property="og:description"]').content = descriptions[lang];
    document.querySelector('meta[property="og:locale"]').content = lang === 'fr' ? 'fr_CA' : 'en_CA';
    menuButton.querySelector('.sr-only').textContent = lang === 'fr' ? 'Ouvrir le menu' : 'Open menu';
    try { localStorage.setItem('sakidoo-language', lang); } catch (error) { /* Storage is optional. */ }
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }

  menuButton.addEventListener('click', function () {
    var open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
    }
  });

  document.querySelectorAll('[data-lang]').forEach(function (button) {
    button.addEventListener('click', function () { setLanguage(button.dataset.lang); });
  });

  var initialLanguage = 'fr';
  try { initialLanguage = localStorage.getItem('sakidoo-language') || 'fr'; } catch (error) { /* Use French. */ }
  setLanguage(initialLanguage);
  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (element) { observer.observe(element); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (element) { element.classList.add('is-visible'); });
  }
})();
