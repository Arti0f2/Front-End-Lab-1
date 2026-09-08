const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const details = document.querySelector('#details');
const characterCount = document.querySelector('#char-count');
if (details && characterCount) {
  details.addEventListener('input', () => {
    characterCount.textContent = details.value.length;
  });
}

const feedbackForm = document.querySelector('#feedback-form');
const formMessage = document.querySelector('#form-message');
if (feedbackForm && formMessage) {
  feedbackForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formMessage.textContent = 'Дякуємо! Повідомлення успішно надіслано.';
    feedbackForm.reset();
    if (characterCount) characterCount.textContent = '0';
  });
}
