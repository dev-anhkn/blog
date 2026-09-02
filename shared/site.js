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
  // Wrap a handler so it runs at most once per animation frame - shared by
  // every scroll/resize listener below instead of each rolling its own
  // ticking flag.
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

  // Animates the scroll position to the top over `duration` ms with easing,
  // rather than relying on native `behavior: 'smooth'` (inconsistent across
  // browsers - jumps instantly in some).
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
      var docEl = document.documentElement;
      var scrollable = docEl.scrollHeight - docEl.clientHeight;
      var pct = scrollable > 0 ? Math.min(100, Math.max(0, (getScrollY() / scrollable) * 100)) : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', rafThrottle(updateProgress), { passive: true });
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
    var scheduleBackToTopUpdate = rafThrottle(updateBackToTop);
    window.addEventListener('scroll', scheduleBackToTopUpdate, { passive: true });
    window.addEventListener('resize', scheduleBackToTopUpdate);
    updateBackToTop();
  }

  // SCROLL REVEAL - cards and accordion tiles fade/slide in as they enter view
  // (skip disabled "coming soon" cards - their inline opacity:0.5 would conflict
  // with the .reveal fade, leaving the transform running but opacity stuck)
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

  // TOC SIDEBAR LAYOUT - group everything that comes after the TOC
  // (.article-body, .article-nav) under one wrapper, once, at load. This lets
  // shared/theme.css lay .toc and that wrapper out as two ordinary grid cells
  // sharing a single row (see main:has(> .toc)), instead of making .toc span
  // multiple auto-placed rows - a combination with position: sticky that
  // several browsers get wrong (see the comment there for why that ran the
  // sidebar straight into the footer).
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
  // (Sidebar placement itself is pure CSS now - see main:has(> .toc) in
  // shared/theme.css - so this is only responsible for the .active class.)
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

    // The -70% bottom margin above means a heading only counts as "active" once
    // it reaches the top 30% of the viewport - if the last section is short,
    // the page runs out of room to scroll before that ever happens, so it
    // never gets highlighted. Force it active once the page is scrolled to
    // (near) the very bottom.
    var lastTocHeading = tocHeadings[tocHeadings.length - 1];
    if (lastTocHeading) {
      var checkTocBottom = function () {
        var docEl = document.documentElement;
        if (getScrollY() + window.innerHeight >= docEl.scrollHeight - 2) {
          setActiveTocLink(lastTocHeading.id);
        }
      };
      window.addEventListener('scroll', rafThrottle(checkTocBottom), { passive: true });
      checkTocBottom();
    }
  }
})();
