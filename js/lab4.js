/**
 * ============================================================================
 * Лабораторна робота №4
 * Тема: РЕАЛІЗАЦІЯ КЛІЄНТСЬКИХ СКРИПТІВ ЗА ДОПОМОГОЮ JS ТА DOM
 * Варіант: 10
 * Студент: Іващук Артем Олександрович (Група ІПЗ-31/1)
 *
 * Усі сценарії реалізовано виключно засобами стандарту JavaScript (DOM Core / HTML DOM),
 * що описані у навчально-методичному посібнику:
 * - getElementById, getElementsByClassName, querySelectorAll
 * - innerHTML, getAttribute, setAttribute, style.властивість
 * - addEventListener (mouseover, mouseout, click, input, focus, blur)
 * - Window (setTimeout, clearTimeout, setInterval, clearInterval)
 * ============================================================================
 */

(function () {
  'use strict';

  // Ініціалізація після повного завантаження DOM (згідно зі стандартом DOMContentLoaded або defer)
  document.addEventListener('DOMContentLoaded', function () {
    initPurposeModal(); // Вимога 1: Модальне вікно (30 сек фокусу на меті)
    initTopicsSearch(); // Вимога 2: Пошук навчальної теми за назвою
    initTopicsAccordion(); // Вимога 3: Акордеон у верхньому лівому куті
    initFeedbackDetailsTooltip(); // Вимога 4: Ефект при наведенні на поле "Детально" та підказка
    initNightMode(); // Вимога 5: Нічний режим (21:00 - 06:00, фон на 50% темніший)
  });

  // ==========================================================================
  // ВИМОГА 1: Модальне вікно із "Золотими правилами навчання"
  // Умова: Користувач, який протягом 30 сек фокусується на розділі з описом
  //        мети на головній сторінці, бачить модальне вікно (з блокуванням)
  // ==========================================================================
  function initPurposeModal() {
    var purposeSection = document.getElementById('about');
    var modalOverlay = document.getElementById('rules-modal-overlay');
    var timerDisplay = document.getElementById('purpose-timer-counter');
    var statusWrap = document.getElementById('purpose-focus-status');
    var quickBtn = document.getElementById('force-rules-btn');
    var closeBtn = document.getElementById('rules-modal-close-btn');
    var closeIcon = document.getElementById('rules-modal-close-icon');

    if (!purposeSection || !modalOverlay) {
      return;
    }

    var FOCUS_REQUIRED_SECONDS = 30;
    var remainingSeconds = FOCUS_REQUIRED_SECONDS;
    var focusInterval = null;
    var isModalShown = false;

    // Оновлення лічильника в інтерфейсі
    function updateCounterDisplay(active) {
      if (!timerDisplay) return;
      if (active) {
        timerDisplay.textContent = remainingSeconds + ' с';
        if (statusWrap) {
          statusWrap.classList.add('active');
        }
      } else {
        timerDisplay.textContent = '30 с';
        if (statusWrap) {
          statusWrap.classList.remove('active');
        }
      }
    }

    // Відображення модального вікна поверх сторінки із блокуванням
    function showModal() {
      if (isModalShown) return;
      isModalShown = true;
      modalOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // блокування взаємодії зі сторінкою (скроллу)
      resetFocusTimer();
    }

    // Закриття модального вікна та відновлення роботи зі сторінкою
    function closeModal() {
      modalOverlay.style.display = 'none';
      document.body.style.overflow = ''; // розблокування сторінки
      isModalShown = false;
      resetFocusTimer();
    }

    // Скидання таймера фокусування
    function resetFocusTimer() {
      if (focusInterval) {
        window.clearInterval(focusInterval);
        focusInterval = null;
      }
      remainingSeconds = FOCUS_REQUIRED_SECONDS;
      updateCounterDisplay(false);
    }

    // Початок відліку при фокусуванні (підведення курсору або фокус всередині секції)
    function startFocusTimer() {
      if (isModalShown || focusInterval) return;

      updateCounterDisplay(true);
      focusInterval = window.setInterval(function () {
        remainingSeconds--;
        updateCounterDisplay(true);

        if (remainingSeconds <= 0) {
          window.clearInterval(focusInterval);
          focusInterval = null;
          showModal();
        }
      }, 1000);
    }

    // Завершення відліку при відведенні курсору / втраті фокусу
    function handleFocusEnd(event) {
      // Перевіряємо, чи курсор дійсно залишив межі блоку #about
      if (event && event.relatedTarget && purposeSection.contains(event.relatedTarget)) {
        return;
      }
      resetFocusTimer();
    }

    // Обробники подій для секції мети
    purposeSection.addEventListener('mouseover', startFocusTimer);
    purposeSection.addEventListener('mouseout', handleFocusEnd);
    purposeSection.addEventListener('focusin', startFocusTimer);
    purposeSection.addEventListener('focusout', handleFocusEnd);

    // Кнопка швидкого тестування (для перевірки викладачем без очікування 30 сек)
    if (quickBtn) {
      quickBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        showModal();
      });
    }

    // Закриття модального вікна
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    if (closeIcon) {
      closeIcon.addEventListener('click', closeModal);
    }

    // Закриття при кліку на затемнений оверлей за межами діалогового вікна
    modalOverlay.addEventListener('click', function (event) {
      if (event.target === modalOverlay) {
        closeModal();
      }
    });

    // Закриття клавішею Escape
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modalOverlay.style.display === 'flex') {
        closeModal();
      }
    });
  }

  // ==========================================================================
  // ВИМОГА 2: Пошук навчальної теми за назвою
  // Умова: На сторінці «Навчальні теми» користувач може здійснити пошук
  //        теми за назвою.
  // ==========================================================================
  function initTopicsSearch() {
    var searchInput = document.getElementById('topic-search-input');
    var searchBtn = document.getElementById('topic-search-btn');
    var resetBtn = document.getElementById('topic-search-reset-btn');
    var statsElement = document.getElementById('topic-search-stats');
    var topicCards = document.getElementsByClassName('topic-card');

    if (!searchInput || topicCards.length === 0) {
      return;
    }

    var totalTopics = topicCards.length;

    function applySearch() {
      var query = searchInput.value.toLowerCase().trim();
      var matchCount = 0;

      for (var i = 0; i < topicCards.length; i++) {
        var card = topicCards[i];
        var titleElement = card.getElementsByClassName('topic-name')[0];
        var titleText = titleElement ? titleElement.textContent.toLowerCase() : '';

        // Пошук підрядка у назві теми
        if (query === '' || titleText.indexOf(query) !== -1) {
          card.style.display = ''; // Показуємо картку (стандартне відображення)
          matchCount++;
        } else {
          card.style.display = 'none'; // Приховуємо картку
        }
      }

      // Виведення результатів пошуку
      if (statsElement) {
        if (query === '') {
          statsElement.innerHTML = 'Показано всі теми (' + totalTopics + ').';
        } else if (matchCount > 0) {
          statsElement.innerHTML = 'Знайдено тем: <strong>' + matchCount + '</strong> з ' + totalTopics + ' за запитом «' + escapeHtml(searchInput.value) + '».';
        } else {
          statsElement.innerHTML = 'За запитом «' + escapeHtml(searchInput.value) + '» нічого не знайдено.';
        }
      }
    }

    // Слухачі подій: під час введення тексту, натискання кнопки та скидання
    searchInput.addEventListener('input', applySearch);

    if (searchBtn) {
      searchBtn.addEventListener('click', applySearch);
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        searchInput.value = '';
        applySearch();
        searchInput.focus();
      });
    }

    // Початкове відображення статистики
    if (statsElement) {
      statsElement.innerHTML = 'Показано всі теми (' + totalTopics + ').';
    }
  }

  // ==========================================================================
  // ВИМОГА 3: Акордеон у верхньому куті ліворуч
  // Умова: На сторінці «Навчальні теми» у верхньому куті ліворуч реалізувати
  //        акордеон (розширюється і згортається, допомагає користувачу
  //        швидко переміщатись по інформації та включити великі обсяги в
  //        обмежений простір), що містить короткий опис навчальних тем.
  // ==========================================================================
  function initTopicsAccordion() {
    var accordionContainer = document.getElementById('topics-accordion');
    if (!accordionContainer) {
      return;
    }

    var headers = accordionContainer.getElementsByClassName('accordion-header');

    for (var i = 0; i < headers.length; i++) {
      headers[i].addEventListener('click', function () {
        var isCurrentlyActive = this.getAttribute('aria-expanded') === 'true';
        var currentContent = this.nextElementSibling;

        // Згортаємо всі інші відкриті панелі акордеона
        for (var j = 0; j < headers.length; j++) {
          headers[j].setAttribute('aria-expanded', 'false');
          headers[j].classList.remove('active');
          var icon = headers[j].getElementsByClassName('acc-icon')[0];
          if (icon) {
            icon.textContent = '+';
          }
          var otherContent = headers[j].nextElementSibling;
          if (otherContent) {
            otherContent.style.display = 'none';
          }
        }

        // Якщо поточна панель була закрита — розкриваємо її
        if (!isCurrentlyActive) {
          this.setAttribute('aria-expanded', 'true');
          this.classList.add('active');
          var currentIcon = this.getElementsByClassName('acc-icon')[0];
          if (currentIcon) {
            currentIcon.textContent = '−';
          }
          if (currentContent) {
            currentContent.style.display = 'block';
          }
        }
      });
    }
  }

  // ==========================================================================
  // ВИМОГА 4: Наведення на поле «Детально» та текст-підказка (tooltip)
  // Умова: На сторінці «Зворотній зв’язок» при наведені курсора миші
  //        користувачем на поле «Детально», воно змінює колір фону,
  //        з’являється рамка та тінь від неї, а праворуч нього з’являється
  //        текст - підказка (tooltip) «Ваша думка для нас важлива!
  //        Конкретизуйте мету звернення, будь ласка».
  // ==========================================================================
  function initFeedbackDetailsTooltip() {
    var detailsField = document.getElementById('details');
    var tooltip = document.getElementById('details-tooltip');

    if (!detailsField || !tooltip) {
      return;
    }

    // Запам'ятовуємо вихідні стилі поля для повернення при mouseout
    var defaultBg = detailsField.style.backgroundColor || '';
    var defaultBorder = detailsField.style.border || '';
    var defaultShadow = detailsField.style.boxShadow || '';

    // При наведенні курсора миші (onmouseover)
    detailsField.addEventListener('mouseover', function () {
      // 1. Зміна кольору фону
      detailsField.style.backgroundColor = '#faf5ff';
      // 2. З'являється рамка
      detailsField.style.border = '2px solid #885db0';
      // 3. З'являється тінь від рамки
      detailsField.style.boxShadow = '0 0 16px rgba(136, 93, 176, 0.45)';
      // 4. Праворуч з'являється підказка
      tooltip.style.display = 'block';
    });

    // При відведенні курсора миші (onmouseout)
    detailsField.addEventListener('mouseout', function () {
      detailsField.style.backgroundColor = defaultBg;
      detailsField.style.border = defaultBorder;
      detailsField.style.boxShadow = defaultShadow;
      tooltip.style.display = 'none';
    });
  }

  // ==========================================================================
  // ВИМОГА 5: Нічний режим (21:00 - 06:00, фон на 50% темніший)
  // Умова: Для користувача, що зайшов на головну сторінку в період з 21 год
  //        до 6 ранку, колір фону всіх елементів темніший на 50% за колір в інший час.
  // ==========================================================================
  function initNightMode() {
    var banner = document.getElementById('night-mode-status');
    var timeDisplay = document.getElementById('current-time-str');
    var badge = document.getElementById('night-status-badge');
    var toggleBtn = document.getElementById('night-mode-toggle-btn');

    // Перевірка, що ми на головній сторінці
    if (!document.querySelector('.home-main')) {
      return;
    }

    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var currentMinute = currentDate.getMinutes();

    // Період з 21:00 до 06:00
    var isNightPeriod = currentHour >= 21 || currentHour < 6;
    var isNightActive = isNightPeriod;

    function applyNightTheme(enable) {
      isNightActive = enable;

      if (enable) {
        document.body.classList.add('night-mode');
        // Безпосередня зміна властивості стилю через DOM API (згідно з методичкою)
        document.body.style.backgroundColor = '#120e1a';
      } else {
        document.body.classList.remove('night-mode');
        document.body.style.backgroundColor = '';
      }

      if (badge) {
        if (enable) {
          badge.textContent = 'Нічний час (-50% яскравості фону)';
          badge.className = 'night-status-badge night';
        } else {
          badge.textContent = 'Денний режим';
          badge.className = 'night-status-badge day';
        }
      }
    }

    // Форматування часу у вигляд HH:MM
    if (timeDisplay) {
      var formattedMinute = currentMinute < 10 ? '0' + currentMinute : currentMinute;
      var formattedHour = currentHour < 10 ? '0' + currentHour : currentHour;
      timeDisplay.textContent = formattedHour + ':' + formattedMinute;
    }

    // Застосовуємо автоматичний режим відповідно до поточного часу
    applyNightTheme(isNightPeriod);

    // Кнопка для ручного перемикання (для зручності перевірки викладачем)
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        applyNightTheme(!isNightActive);
      });
    }
  }

  // Допоміжна функція екранування тексту для безпечного innerHTML
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();
