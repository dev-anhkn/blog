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
      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        animateScrollToTop(500);
      }
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

  // TOC SIDEBAR - place the TOC in the left margin next to the content column,
  // measured from the actual rendered content box instead of a guessed
  // viewport calc() (which broke under scrollbars/zoom/rounding)
  var tocEl = document.querySelector('.toc');
  var tocAnchor = document.querySelector('.article-body');
  var tocTopAnchor = document.querySelector('.article-body > div') || tocAnchor;
  if (tocEl && tocAnchor) {
    var TOC_WIDTH = 240;
    var TOC_GAP = 56;
    var positionToc = function () {
      // Switch to fixed positioning first so it stops occupying flow space -
      // otherwise .article-body's measured position still reflects the TOC's
      // old in-flow height, and the sidebar ends up anchored to a stale spot.
      tocEl.classList.add('toc-sidebar');
      var left = tocAnchor.getBoundingClientRect().left - TOC_GAP - TOC_WIDTH;
      if (left >= 16) {
        // Use the anchor's absolute position in the document (rect.top + current
        // scroll), not its current on-screen position - otherwise reloading the
        // page mid-scroll (browsers restore scroll position before this runs)
        // reads a wildly negative rect.top and pins the sidebar to the very top.
        var top = Math.max(16, tocTopAnchor.getBoundingClientRect().top + getScrollY());
        tocEl.style.left = left + 'px';
        tocEl.style.top = top + 'px';
        tocEl.style.maxHeight = Math.max(120, window.innerHeight - top - 16) + 'px';
      } else {
        tocEl.classList.remove('toc-sidebar');
        tocEl.style.left = '';
        tocEl.style.top = '';
        tocEl.style.maxHeight = '';
      }
    };
    positionToc();
    window.addEventListener('resize', rafThrottle(positionToc));
  }

  // TOC SCROLLSPY - highlight the current section's link while scrolling
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
  }
})();
