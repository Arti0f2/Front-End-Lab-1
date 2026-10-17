class UserRecord {
  constructor(surname, firstName, age, email, purpose, date, time) {
    this.surname = surname;
    this.firstName = firstName;
    this.age = age;
    this.email = email;
    this.purpose = purpose;
    this.date = date;
    this.time = time;
  }

  get fullName() {
    return `${this.surname} ${this.firstName}`;
  }

  get contactedAt() {
    return `${this.date}T${this.time}`;
  }

  classify() {
    const month = Number(this.date.slice(5, 7));
    if (this.age < 16 && month < 9) {
      return 'Школярі до початку навчального року';
    }
    if (this.age >= 16 && (month >= 9 || month <= 6)) {
      return 'Не школярі впродовж семестру';
    }
    return 'Інші';
  }

  static compareByEmail(first, second) {
    return first.email.localeCompare(second.email);
  }
}

const topics = [
  { id: 'T01', title: 'Семантичний HTML', author: 'Олена Коваль', taskType: 'Практична розмітка', readersDay1: 148, readersDay2: 132, hours: 2, minutes: 30 },
  { id: 'T02', title: 'CSS: селектори та каскад', author: 'Андрій Мельник', taskType: 'Вправи зі стилізації', readersDay1: 121, readersDay2: 108, hours: 3, minutes: 0 },
  { id: 'T03', title: 'Адаптивний дизайн', author: 'Марія Бондар', taskType: 'Макет сторінки', readersDay1: 96, readersDay2: 89, hours: 4, minutes: 15 },
  { id: 'T04', title: 'Flexbox на практиці', author: 'Іван Шевченко', taskType: 'Завдання з верстки', readersDay1: 83, readersDay2: 72, hours: 2, minutes: 45 },
  { id: 'T05', title: 'CSS Grid', author: 'Олена Коваль', taskType: 'Побудова сітки', readersDay1: 78, readersDay2: 64, hours: 3, minutes: 30 },
  { id: 'T06', title: 'Змінні та типи JavaScript', author: 'Дмитро Ткаченко', taskType: 'Задачі на обчислення', readersDay1: 112, readersDay2: 97, hours: 4, minutes: 0 },
  { id: 'T07', title: 'Функції та масиви', author: 'Марія Бондар', taskType: 'Програмні вправи', readersDay1: 104, readersDay2: 93, hours: 5, minutes: 20 },
  { id: 'T08', title: 'Обробка подій DOM', author: 'Іван Шевченко', taskType: 'Інтерактивний інтерфейс', readersDay1: 67, readersDay2: 51, hours: 3, minutes: 15 },
  { id: 'T09', title: 'Основи SQL', author: 'Андрій Мельник', taskType: 'Запити до бази даних', readersDay1: 91, readersDay2: 76, hours: 2, minutes: 20 },
  { id: 'T10', title: 'Цикли та умови Python', author: 'Дмитро Ткаченко', taskType: 'Скрипт автоматизації', readersDay1: 58, readersDay2: 43, hours: 5, minutes: 0 },
];

for (const topic of topics) {
  topic.key = topic.id;
}

const users = [
  new UserRecord('Коваль', 'Олена', 15, 'olena.koval@example.com', 'Запитання про HTML', '2026-08-20', '09:15'),
  new UserRecord('Мельник', 'Андрій', 24, 'andrii.melnyk@example.com', 'Пропозиція щодо курсу', '2026-10-03', '11:40'),
  new UserRecord('Бондар', 'Марія', 31, 'mariia.bondar@example.com', 'Повідомлення про помилку', '2026-09-12', '14:05'),
  new UserRecord('Шевченко', 'Іван', 17, 'ivan.shevchenko@example.com', 'Запитання про JavaScript', '2026-10-10', '16:20'),
  new UserRecord('Ткаченко', 'Дмитро', 42, 'dmytro.tkachenko@example.com', 'Співпраця', '2026-06-18', '10:30'),
  new UserRecord('Петренко', 'Софія', 14, 'sofiia.petrenko@example.com', 'Запитання про CSS', '2026-08-29', '12:00'),
  new UserRecord('Шульга', 'Максим', 28, 'maksym.shulha@example.com', 'Пропозиція щодо порталу', '2026-03-05', '08:50'),
  new UserRecord('Лисенко', 'Ірина', 16, 'iryna.lysenko@example.com', 'Повідомлення про помилку', '2026-02-21', '17:10'),
  new UserRecord('Романюк', 'Тарас', 35, 'taras.romaniuk@example.com', 'Співпраця', '2026-07-14', '13:25'),
  new UserRecord('Гриценко', 'Анна', 22, 'anna.hrytsenko@example.com', 'Запитання про навчальні теми', '2026-10-15', '18:00'),
];

const topicBody = document.querySelector('#topics-table-body');
const usersBody = document.querySelector('#users-table-body');

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} год ${String(minutes).padStart(2, '0')} хв`;
}

function formatValue(value) {
  return value === null || value === undefined || value === '' ? '—' : String(value);
}

function renderTopics() {
  topicBody.replaceChildren();
  for (const topic of topics) {
    const row = document.createElement('tr');
    const checkCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'study-topic';
    checkbox.value = topic.key;
    checkbox.setAttribute('aria-label', `Обрати тему ${topic.title || topic.id || 'без назви'}`);
    checkCell.append(checkbox);
    row.append(checkCell);
    for (const value of [
      topic.id,
      topic.title,
      topic.author,
      topic.taskType,
      topic.readersDay1,
      topic.readersDay2,
      topic.hours === null || topic.minutes === null ? '—' : formatDuration(topic.hours * 60 + topic.minutes),
    ]) {
      const cell = document.createElement('td');
      cell.textContent = formatValue(value);
      row.append(cell);
    }
    topicBody.append(row);
  }

  const readershipValues = topics.flatMap((topic) => [topic.readersDay1, topic.readersDay2])
    .filter((value) => Number.isFinite(value));
  const average = readershipValues.reduce((sum, value) => sum + value, 0) / readershipValues.length;
  document.querySelector('#topic-average').textContent =
    `Середня кількість прочитань за добу (за обома добами): ${average.toLocaleString('uk-UA', { maximumFractionDigits: 1 })}.`;
}

function renderUsers(records) {
  usersBody.replaceChildren();
  for (const user of records) {
    const row = document.createElement('tr');
    for (const value of [user.fullName, user.age, user.email, user.purpose, user.date, user.time]) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    }
    usersBody.append(row);
  }
}

function parseOptionalNumber(value) {
  return value.trim() === '' ? null : Number(value);
}

function getStudyDuration() {
  const selectedKeys = new Set(
    [...document.querySelectorAll('.study-topic:checked')].map((checkbox) => checkbox.value),
  );
  const selectedTopics = topics.filter((topic) => selectedKeys.has(topic.key));
  const result = document.querySelector('#study-time-result');

  if (selectedTopics.length === 0) {
    result.textContent = 'Спочатку оберіть одну або більше тем у таблиці.';
    return;
  }
  if (selectedTopics.some((topic) => topic.hours === null || topic.minutes === null)) {
    result.textContent = 'Не вдалося обчислити тривалість: заповніть години та хвилини для кожної обраної теми.';
    return;
  }

  const multiplier = selectedTopics.length > 3 ? 1.5 : 1;
  const durations = selectedTopics.map((topic) => ({
    title: topic.title || topic.id || 'Тема без назви',
    minutes: Math.round((topic.hours * 60 + topic.minutes) * multiplier),
  }));
  const totalMinutes = durations.reduce((total, topic) => total + topic.minutes, 0);
  const perTopic = durations.map((topic) => `${topic.title} — ${formatDuration(topic.minutes)}`).join('; ');
  result.textContent = `Для ${selectedTopics.length} тем (множник ${multiplier}): ${perTopic}. Разом: ${formatDuration(totalMinutes)}.`;
}

function addTopic(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const topic = {
    key: `new-${Date.now()}-${topics.length}`,
    id: values.get('id').trim(),
    title: values.get('title').trim(),
    author: values.get('author').trim(),
    taskType: values.get('taskType').trim(),
    readersDay1: parseOptionalNumber(values.get('readersDay1')),
    readersDay2: parseOptionalNumber(values.get('readersDay2')),
    hours: parseOptionalNumber(values.get('hours')),
    minutes: parseOptionalNumber(values.get('minutes')),
  };
  const requiredValues = [
    topic.id, topic.title, topic.author, topic.taskType, topic.readersDay1,
    topic.readersDay2, topic.hours, topic.minutes,
  ];
  const result = document.querySelector('#add-topic-result');

  if (topic.id && topics.some((existing) => existing.id === topic.id)) {
    result.textContent = `Тему з ID ${topic.id} вже додано. Вкажіть унікальний внутрішній ID.`;
    return;
  }
  if ([topic.readersDay1, topic.readersDay2, topic.hours, topic.minutes]
    .some((value) => value !== null && (!Number.isInteger(value) || value < 0))
    || (topic.minutes !== null && topic.minutes > 59)) {
    result.textContent = 'Кількості та години мають бути цілими невід’ємними числами, хвилини — від 0 до 59.';
    return;
  }

  if (requiredValues.some((value) => value === null || String(value).trim() === '')) {
    topics.unshift(topic);
    result.textContent = 'Додано неповний запис на початок списку.';
  } else {
    topics.push(topic);
    topics.sort((first, second) => first.author.localeCompare(second.author, 'uk'));
    result.textContent = 'Повний запис додано до списку, упорядкованого за автором.';
  }

  renderTopics();
  form.reset();
}

function filterUsers(event) {
  event.preventDefault();
  const month = document.querySelector('#filter-month').value;
  const moment = document.querySelector('#filter-moment').value;
  const result = document.querySelector('#filtered-users-result');

  if (!month || !moment) {
    result.textContent = 'Оберіть і місяць, і момент часу, щоб виконати пошук.';
    return;
  }

  const matches = users.filter((user) => user.date.startsWith(month) && user.contactedAt <= moment)
    .sort(UserRecord.compareByEmail);
  renderUsers(matches);
  result.textContent = matches.length
    ? `Звернення до ${moment.replace('T', ' ')} за ${month}: ${matches.map((user) => user.fullName).join(', ')}.`
    : `За ${month} до ${moment.replace('T', ' ')} звернень не знайдено.`;
}

function renderMinimumAge() {
  const youngest = users.reduce((minimum, user) => user.age < minimum.age ? user : minimum);
  document.querySelector('#minimum-age-result').textContent =
    `Вік: ${youngest.age}; E-mail: ${youngest.email}; дата звернення: ${youngest.date}.`;
}

function renderUserCategories() {
  const categories = [
    'Школярі до початку навчального року',
    'Не школярі впродовж семестру',
    'Інші',
  ];
  const container = document.querySelector('#user-categories');
  for (const category of categories) {
    const members = users.filter((user) => user.classify() === category);
    const card = document.createElement('article');
    card.className = 'lab3-category';
    const title = document.createElement('strong');
    title.textContent = category;
    const count = document.createElement('p');
    count.textContent = `Користувачів: ${members.length}`;
    card.append(title, count);
    container.append(card);
  }
}

document.querySelector('#sort-topics').addEventListener('click', () => {
  topics.sort((first, second) => {
    const firstHasDuration = first.hours !== null && first.minutes !== null;
    const secondHasDuration = second.hours !== null && second.minutes !== null;
    if (firstHasDuration !== secondHasDuration) {
      return firstHasDuration ? 1 : -1;
    }
    if (!firstHasDuration) {
      return 0;
    }
    return (first.hours * 60 + first.minutes) - (second.hours * 60 + second.minutes);
  });
  renderTopics();
});

document.querySelector('#find-min-topic').addEventListener('click', () => {
  const topicsWithReaders = topics.filter((topic) => Number.isFinite(topic.readersDay2));
  const result = document.querySelector('#min-topic-result');
  if (topicsWithReaders.length === 0) {
    result.textContent = 'Немає тем із заповненою кількістю прочитань за добу 2.';
    return;
  }
  const topic = topicsWithReaders.reduce((minimum, current) =>
    current.readersDay2 < minimum.readersDay2 ? current : minimum);
  result.textContent =
    `Мінімальна кількість прочитань за добу 2: тема «${topic.title}»; внутрішній ID: ${topic.id}.`;
});

document.querySelector('#calculate-study-time').addEventListener('click', getStudyDuration);
document.querySelector('#add-topic-form').addEventListener('submit', addTopic);
document.querySelector('#filter-users-form').addEventListener('submit', filterUsers);

renderTopics();
renderUsers([...users].sort(UserRecord.compareByEmail));
renderMinimumAge();
renderUserCategories();
