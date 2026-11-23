(function () {
  // ===== Настройки: замените на свои данные =====
  var CONFIG = {
    whatsapp: '971000000000', // номер без "+" и пробелов
    // Чтобы заявки с формы приходили на почту, зарегистрируйтесь на https://formspree.io
    // и вставьте сюда адрес формы, например 'https://formspree.io/f/abcdwxyz'.
    // Пока поле пустое, форма открывает WhatsApp с текстом заявки.
    formEndpoint: ''
  };

  // Year in footer
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Industry tabs
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('is-active'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var panel = document.getElementById('tab-' + tab.dataset.tab);
      if (panel) panel.classList.add('is-active');
    });
  });

  // ROI calculator
  var people = document.getElementById('calcPeople');
  var hours = document.getElementById('calcHours');
  var rate = document.getElementById('calcRate');
  function fmt(n) { return Math.round(n).toLocaleString('ru-RU'); }
  function calc() {
    var p = Math.max(0, parseFloat(people.value) || 0);
    var h = Math.max(0, parseFloat(hours.value) || 0);
    var r = Math.max(0, parseFloat(rate.value) || 0);
    var monthHours = p * h * 22;
    var money = monthHours * r;
    document.getElementById('calcResHours').textContent = fmt(monthHours) + ' ч';
    document.getElementById('calcResMoney').textContent = fmt(money) + ' AED';
    document.getElementById('calcResSave').textContent = fmt(money * 0.6) + ' AED';
  }
  if (people && hours && rate) {
    [people, hours, rate].forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  }

  // Demo bot (scripted answers)
  var KB = [
    { keys: ['услуг', 'что вы', 'чем занима', 'делаете', 'умеете'],
      a: 'Мы внедряем CRM для отдела продаж, настраиваем AI-ботов в WhatsApp, Instagram и на сайте, автоматизируем документы, финансы, маркетинг и внутренние процессы. С чего хотите начать?' },
    { keys: ['цен', 'стои', 'сколько', 'бюджет', 'прайс', 'aed'],
      a: 'Стоимость зависит от задач. Есть пакеты Start, Business и Pro — их можно посмотреть в разделе «Пакеты». Точную смету даём после бесплатного аудита, цена фиксируется до начала работ.' },
    { keys: ['срок', 'долго', 'быстро', 'времени', 'когда'],
      a: 'Простой бот или базовая CRM — от 1–2 недель. Комплексная автоматизация — от 1 до 3 месяцев. Первые результаты обычно видны уже на первом этапе.' },
    { keys: ['whatsapp', 'ватсап', 'вотсап', 'бот', 'ai', 'ии', 'искусствен'],
      a: 'AI-бот отвечает клиентам 24/7 на английском, арабском и русском, квалифицирует лиды, записывает на услуги и сразу передаёт данные в CRM. Вот как я сейчас 🙂' },
    { keys: ['crm', 'срм', 'црм', 'битрикс', 'bitrix', 'zoho', 'зохо', 'hubspot', 'odoo', 'amo'],
      a: 'Работаем с Bitrix24, Zoho, HubSpot, Odoo, amoCRM и другими. Поможем выбрать систему под ваш бизнес и бюджет, настроим воронки и интеграции, обучим команду.' },
    { keys: ['араб', 'англ', 'язык'],
      a: 'Да, боты и интерфейсы можно настроить на английском, арабском и русском. Бот сам определяет язык клиента.' },
    { keys: ['данн', 'безопас', 'конфиденц', 'pdpl'],
      a: 'Работаем в соответствии с законодательством ОАЭ о защите персональных данных (PDPL), подписываем NDA и настраиваем доступы по минимально необходимым правам.' },
    { keys: ['аудит', 'консульт', 'встреч', 'созвон', 'связ', 'контакт', 'записат'],
      a: 'Бесплатный аудит занимает 30 минут: разбираем ваши процессы и находим, что можно автоматизировать. Оставьте заявку в форме ниже или напишите нам в WhatsApp.' },
    { keys: ['привет', 'здравств', 'добрый', 'hello', 'hi'],
      a: 'Здравствуйте! Я демо-ассистент. Спросите об услугах, сроках, стоимости или о том, как работает AI-бот.' }
  ];
  var QUICK = ['Какие услуги?', 'Сколько стоит?', 'Сроки внедрения', 'Как работает AI-бот?', 'Записаться на аудит'];
  var FALLBACK = 'Хороший вопрос! На него лучше ответит наш специалист — запишитесь на бесплатный аудит или напишите нам в WhatsApp. А пока могу рассказать об услугах, сроках и стоимости.';

  var box = document.getElementById('botMessages');
  var form = document.getElementById('botForm');
  var input = document.getElementById('botInput');
  var quick = document.getElementById('botQuick');

  function addMsg(text, who) {
    var div = document.createElement('div');
    div.className = 'bubble ' + (who === 'user' ? 'bubble--out' : 'bubble--in');
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return div;
  }
  function answer(q) {
    var s = q.toLowerCase();
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].keys.length; j++) {
        if (s.indexOf(KB[i].keys[j]) !== -1) return KB[i].a;
      }
    }
    return FALLBACK;
  }
  function ask(q) {
    if (!q.trim()) return;
    addMsg(q, 'user');
    var typing = document.createElement('div');
    typing.className = 'bubble bubble--in';
    typing.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
    box.appendChild(typing);
    box.scrollTop = box.scrollHeight;
    setTimeout(function () {
      typing.remove();
      addMsg(answer(q), 'bot');
    }, 700);
  }
  if (box && form) {
    addMsg('Здравствуйте! 👋 Я демо-ассистент. Спросите меня об услугах, сроках или стоимости.', 'bot');
    QUICK.forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = q;
      b.addEventListener('click', function () { ask(q); });
      quick.appendChild(b);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      ask(input.value);
      input.value = '';
    });
  }

  // Contact form
  var cform = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (cform) {
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(cform);
      if (CONFIG.formEndpoint) {
        status.textContent = 'Отправляем…';
        fetch(CONFIG.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error();
            cform.reset();
            status.textContent = 'Спасибо! Мы свяжемся с вами в течение рабочего дня.';
          })
          .catch(function () {
            status.textContent = 'Не удалось отправить. Напишите нам в WhatsApp, пожалуйста.';
          });
      } else {
        var text = 'Здравствуйте! Хочу записаться на бесплатный аудит.\n' +
          'Имя: ' + (data.get('name') || '') + '\n' +
          'Телефон: ' + (data.get('phone') || '') + '\n' +
          'Компания: ' + (data.get('company') || '') + '\n' +
          'Задача: ' + (data.get('message') || '');
        window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
        status.textContent = 'Открываем WhatsApp с вашей заявкой…';
      }
    });
  }
})();
