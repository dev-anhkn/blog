/*
 * Shared header/nav + footer for dev.anhkn.
 * Requires two placeholder elements in the page: <header id="site-header"></header>
 * and <footer id="site-footer"></footer>. Add data-tagline="..." on the footer
 * element for page-specific extra text before the GitHub link (used on the homepage).
 * Edit this ONE file to change nav links or footer markup site-wide.
 */
(function () {
  var scriptEl = document.currentScript;
  var src = scriptEl.getAttribute('src');
  var prefix = src.replace(/shared\/site\.js(\?.*)?$/, '');

  var section = 'home';
  if (/\/camunda\//.test(location.pathname) || /\/camunda\/?$/.test(location.pathname)) {
    section = 'camunda';
  } else if (/\/about\.html$/.test(location.pathname)) {
    section = 'about';
  }

  var logoHtml = section === 'home'
    ? '<span class="nav-logo">dev<span>.</span>anhkn</span>'
    : '<a href="' + prefix + 'index.html" class="nav-logo">dev<span>.</span>anhkn</a>';

  function link(href, label, key) {
    var cls = section === key ? ' class="active"' : '';
    return '<li><a href="' + prefix + href + '"' + cls + '>' + label + '</a></li>';
  }

  var headerEl = document.getElementById('site-header');
  if (headerEl) {
    headerEl.innerHTML =
      '<nav>' +
      logoHtml +
      '<ul class="nav-links">' +
      link('index.html', 'Home', 'home') +
      link('camunda/index.html', 'Camunda', 'camunda') +
      link('about.html', 'About', 'about') +
      '</ul>' +
      '</nav>';
  }

  var footerEl = document.getElementById('site-footer');
  if (footerEl) {
    var tagline = footerEl.dataset.tagline || '';
    footerEl.innerHTML =
      '<p>© 2026 dev.anhkn · ' + tagline +
      '<a href="https://github.com/dev-anhkn" target="_blank">GitHub</a></p>';
  }
})();
