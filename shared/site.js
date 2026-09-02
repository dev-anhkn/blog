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

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function getScrollY() { return window.scrollY || document.documentElement.scrollTop; }
  function getScrollableHeight() {
    var docEl = document.documentElement;
    return docEl.scrollHeight - docEl.clientHeight;
  }
  // Sections below push per-scroll work here; one shared listener drains it.
  var scrollCallbacks = [];
  // Runs fn at most once per animation frame.
  function rafThrottle(fn) {
    var ticking = false;
    return function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        fn();
        ticking = false;
      });
    };
  }

  // Animates scroll to top over `duration` ms - native smooth scroll is
  // inconsistent across browsers.
  function animateScrollToTop(duration) {
    var start = getScrollY();
    if (start <= 0) return;
    var startTime = null;
    function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min(1, (timestamp - startTime) / duration);
      window.scrollTo(0, Math.round(start * (1 - easeInOutQuad(progress))));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

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
      var scrollable = getScrollableHeight();
      var pct = scrollable > 0 ? Math.min(100, Math.max(0, (getScrollY() / scrollable) * 100)) : 0;
      progressBar.style.width = pct + '%';
    };
    scrollCallbacks.push(updateProgress);
    updateProgress();

    // BACK TO TOP - floating button, article pages only
    var backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.type = 'button';
    backToTop.setAttribute('aria-label', 'Lên đầu trang');
    backToTop.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', function () {
      animateScrollToTop(500);
    });

    var updateBackToTop = function () {
      backToTop.classList.toggle('is-visible', getScrollY() > 400);
      // Keep the button clear of the footer once it scrolls into view,
      // instead of floating on top of it.
      if (footerEl) {
        var footerVisible = window.innerHeight - footerEl.getBoundingClientRect().top;
        backToTop.style.bottom = 'calc(1.5rem + ' + Math.max(0, footerVisible) + 'px)';
      }
    };
    scrollCallbacks.push(updateBackToTop);
    window.addEventListener('resize', rafThrottle(updateBackToTop));
    updateBackToTop();
  }

  // SCROLL REVEAL - cards fade in as they enter view (skip disabled
  // "coming soon" cards, whose inline opacity:0.5 would fight the fade).
  var revealTargets = Array.prototype.filter.call(
    document.querySelectorAll('.card, .task-card, .info-card, .spotlight-card'),
    function (el) { return el.style.pointerEvents !== 'none'; }
  );
  if (revealTargets.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
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

  // TOC SIDEBAR LAYOUT - wrap everything after the TOC into one element so
  // CSS can lay it out as a single grid row with .toc (see main:has(> .toc)
  // in shared/theme.css).
  var tocEl = document.querySelector('.toc');
  if (tocEl && tocEl.parentNode) {
    var tocContentWrap = document.createElement('div');
    tocContentWrap.className = 'toc-content-wrap';
    var tocSibling = tocEl.nextSibling;
    while (tocSibling) {
      var nextTocSibling = tocSibling.nextSibling;
      tocContentWrap.appendChild(tocSibling);
      tocSibling = nextTocSibling;
    }
    tocEl.parentNode.insertBefore(tocContentWrap, tocEl.nextSibling);
  }

  // TOC SCROLLSPY - highlight the current section's link while scrolling.
  var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var tocLinkById = {};
    tocLinks.forEach(function (a) {
      tocLinkById[a.getAttribute('href').slice(1)] = a;
    });
    var tocHeadings = Object.keys(tocLinkById)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    var setActiveTocLink = function (id) {
      tocLinks.forEach(function (a) { a.classList.remove('active'); });
      var activeLink = tocLinkById[id];
      if (activeLink) activeLink.classList.add('active');
    };
    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveTocLink(entry.target.id);
      });
    }, { rootMargin: '-96px 0px -70% 0px', threshold: 0 });
    tocHeadings.forEach(function (h) { tocObserver.observe(h); });

    // A short last section may never reach the -70% band above, so it'd
    // never activate - force it active once scrolled to the bottom instead.
    var lastTocHeading = tocHeadings[tocHeadings.length - 1];
    if (lastTocHeading) {
      var checkTocBottom = function () {
        if (getScrollY() >= getScrollableHeight() - 2) {
          setActiveTocLink(lastTocHeading.id);
        }
      };
      scrollCallbacks.push(checkTocBottom);
      checkTocBottom();
    }
  }

  if (scrollCallbacks.length) {
    window.addEventListener('scroll', rafThrottle(function () {
      scrollCallbacks.forEach(function (fn) { fn(); });
    }), { passive: true });
  }
})();
