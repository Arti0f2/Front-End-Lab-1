/**
 * ============================================================================
 * Лабораторна робота №5
 * Тема: АДАПТИВНІСТЬ, КРОСБРАУЗЕРНІСТЬ ТА МЕТРИКИ ЕФЕКТИВНОСТІ ФРОНТЕНДУ
 * Студент: Іващук Артем Олександрович (Група ІПЗ-31/1)
 *
 * Сценарії для забезпечення:
 * 1. Адаптивного мобільного меню (hamburger-toggle для розширень <= 768px).
 * 2. Вимірювання та моніторингу метрик ефективності (Performance API / Core Web Vitals:
 *    LCP, CLS, FID/INP, DOMContentLoaded, Load Time) за допомогою вбудованого PerformanceObserver.
 * ============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initResponsiveNav();
    initPerformanceMonitoring();
  });

  /**
   * 1. Адаптивне мобільне меню
   */
  function initResponsiveNav() {
    var header = document.querySelector('header#top');
    if (!header) return;

    var nav = header.querySelector('nav');
    if (!nav) return;

    // Створюємо або знаходимо кнопку перемикання меню
    var toggleBtn = header.querySelector('.menu-toggle');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'menu-toggle';
      toggleBtn.setAttribute('aria-label', 'Перемкнути навігаційне меню');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = '&#9776;'; // Значок гамбургера ☰
      header.insertBefore(toggleBtn, nav);
    }

    toggleBtn.addEventListener('click', function () {
      var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      var willOpen = !isExpanded;

      toggleBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      if (willOpen) {
        nav.classList.add('open');
        toggleBtn.innerHTML = '&times;'; // Значок хрестика ✕ при відкритому меню
      } else {
        nav.classList.remove('open');
        toggleBtn.innerHTML = '&#9776;'; // Значок гамбургера ☰
      }
    });

    // Автоматичне закриття меню при виборі пункту навігації на мобільному
    var navLinks = nav.querySelectorAll('a');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          nav.classList.remove('open');
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.innerHTML = '&#9776;';
        }
      });
    }

    // Скидання відкритого мобільного стану при переході на десктоп
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.innerHTML = '&#9776;';
      }
    });
  }

  /**
   * 2. Заміри та логування метрик ефективності фронтенду (Task 4)
   * Використовує нативний Performance API (згаданий у методичці стор. 4-6)
   */
  function initPerformanceMonitoring() {
    window.addEventListener('load', function () {
      setTimeout(function () {
        if (window.performance && window.performance.timing) {
          var t = window.performance.timing;
          var pageLoadTime = (t.loadEventEnd - t.navigationStart) / 1000;
          var domReadyTime = (t.domContentLoadedEventEnd - t.navigationStart) / 1000;
          var responseTime = (t.responseEnd - t.requestStart) / 1000;

          console.log('%c[CodeNest Performance Metrics - Lab 5]', 'color: #885db0; font-weight: bold; font-size: 13px;');
          console.log('Час повної загрузки сторінки (Page Load): ' + pageLoadTime.toFixed(3) + ' с');
          console.log('Час формування DOM (DOMContentLoaded): ' + domReadyTime.toFixed(3) + ' с');
          console.log('Час відповіді сервера (Network Response): ' + responseTime.toFixed(3) + ' с');
        }

        // Спостереження за Core Web Vitals через PerformanceObserver
        if (typeof PerformanceObserver !== 'undefined') {
          try {
            // LCP (Largest Contentful Paint)
            var lcpObserver = new PerformanceObserver(function (entryList) {
              var entries = entryList.getEntries();
              var lastEntry = entries[entries.length - 1];
              console.log('LCP (Largest Contentful Paint): ' + (lastEntry.renderTime || lastEntry.loadTime).toFixed(2) + ' мс (Норма < 2500 мс)');
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

            // CLS (Cumulative Layout Shift)
            var clsValue = 0;
            var clsObserver = new PerformanceObserver(function (entryList) {
              var entries = entryList.getEntries();
              for (var i = 0; i < entries.length; i++) {
                if (!entries[i].hadRecentInput) {
                  clsValue += entries[i].value;
                }
              }
              console.log('CLS (Cumulative Layout Shift): ' + clsValue.toFixed(4) + ' (Норма < 0.1)');
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
          } catch (e) {
            // Старі версії браузерів або браузери без підтримки нових типів спостерігачів
          }
        }
      }, 0);
    });
  }
})();
