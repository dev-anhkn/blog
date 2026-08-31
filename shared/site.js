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

  var THEME_KEY = 'theme';
  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function setStoredTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
  function toggleIcon(currentTheme) {
    return currentTheme === 'light' ? '🌙' : '☀️';
  }

  var headerEl = document.getElementById('site-header');
  if (headerEl) {
    var initialTheme = getStoredTheme() === 'light' ? 'light' : 'dark';
    headerEl.innerHTML =
      '<nav>' +
      logoHtml +
      '<ul class="nav-links">' +
      link('index.html', 'Home', 'home') +
      link('camunda/index.html', 'Camunda', 'camunda') +
      link('about.html', 'About', 'about') +
      '</ul>' +
      '<button type="button" class="theme-toggle" id="theme-toggle" aria-label="Chuyển giao diện sáng/tối">' +
      toggleIcon(initialTheme) +
      '</button>' +
      '</nav>';

    var toggleBtn = document.getElementById('theme-toggle');
    toggleBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      setStoredTheme(next);
      toggleBtn.textContent = toggleIcon(next);
    });
  }

  var footerEl = document.getElementById('site-footer');
  if (footerEl) {
    var tagline = footerEl.dataset.tagline || '';
    footerEl.innerHTML =
      '<p>© 2026 dev.anhkn · ' + tagline +
      '<a href="https://github.com/dev-anhkn" target="_blank">GitHub</a></p>';
  }

  // READING PROGRESS BAR - article pages only
  var articleBody = document.querySelector('.article-body');
  if (articleBody) {
    var progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    document.body.insertBefore(progressBar, document.body.firstChild);

    var updateProgress = function () {
      var docEl = document.documentElement;
      var scrollTop = window.scrollY || docEl.scrollTop;
      var scrollable = docEl.scrollHeight - docEl.clientHeight;
      var pct = scrollable > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollable) * 100)) : 0;
      progressBar.style.width = pct + '%';
    };
    var progressTicking = false;
    window.addEventListener('scroll', function () {
      if (progressTicking) return;
      progressTicking = true;
      requestAnimationFrame(function () {
        updateProgress();
        progressTicking = false;
      });
    }, { passive: true });
    updateProgress();
  }

  // SCROLL REVEAL - cards and accordion tiles fade/slide in as they enter view
  // (skip disabled "coming soon" cards - their inline opacity:0.5 would conflict
  // with the .reveal fade, leaving the transform running but opacity stuck)
  var revealTargets = Array.prototype.filter.call(
    document.querySelectorAll('.card, .task-card, .info-card, .spotlight-card'),
    function (el) { return el.style.pointerEvents !== 'none'; }
  );
  if (revealTargets.length && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }
})();
