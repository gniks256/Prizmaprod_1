import fs from 'fs';
import path from 'path';

const PROJECTS = [
  { id: 'arch-new-1', title: 'Кейс ароматизации Серебряного острова', client: 'Scentmart', year: '2025', category: 'Архитектурная съемка', desc: 'Профессиональная интерьерная видеосъемка загородного клуба Серебряный остров для компании Scentmart. Горизонтальный формат, интервью с управляющим, акцент на интерьерах: SPA, ресторан, зоны отдыха.' },
  { id: 'arch-1', title: 'Дом в Петровских озерах', client: 'Частный заказчик', year: '2025', category: 'Архитектурная съемка', desc: 'Атмосферная интерьерная съемка загородного дома в КП Петровские озера. Передача уюта и handmade-деталей, эмоциональный подход. После публикации видео объект был продан за 14 дней.' },
  { id: 'arch-2', title: 'Поселок Amster', client: 'Yardo', year: '2025', category: 'Архитектурная съемка', desc: 'Профессиональная видеосъемка для застройщика YARDO: экополис Амстер в Рамонском районе Воронежской области. Аэросъемка, интерьерные планы, рекламный ролик для продаж недвижимости.' },
  { id: 'basketball-vbl', title: 'Финал Воронежской Баскетбольной Лиги', client: 'ВБЛ', year: '2026', category: 'Мероприятия', desc: 'Динамичный спортивный репортаж финала Воронежской Баскетбольной Лиги. Мультикамерная съемка, slow-motion, монтаж с акцентом на драйв и эмоции.' },
  { id: 'scentmart-social', title: 'Scentmart | Контент для соцсетей', client: 'Scentmart', year: '2024', category: 'Контент для соцсетей', desc: 'Серия вертикальных роликов для соцсетей компании Scentmart. Динамичный монтаж без спикера, форматы Reels and TikTok, продвижение ароматизации помещений.' },
  { id: 'kristall-social', title: 'Кристалл Воронеж | Соцсети', client: 'Кристалл Воронеж', year: '2025', category: 'Контент для соцсетей', desc: 'Контент-съемка для автосалона Кристалл Воронеж: вертикальные ролики для соцсетей с автомобилями Mercedes, Omoda, Tesla, Hyundai Creta.' },
  { id: 'event-1', title: 'Ecstatic Dance', client: 'Организатор мероприятия', year: '2023', category: 'Мероприятия', desc: 'Видеосъемка мероприятия Ecstatic Dance в Воронеже. Атмосферный репортаж, работа в условиях динамичного освещения.' },
  { id: 'event-2', title: 'Финал КЭС Баскет', client: 'Федерация Баскетбола', year: '2024', category: 'Мероприятия', desc: 'Спортивная видеосъемка финала КЭС Баскет. Репортаж с мультикамерной съемкой и профессиональным монтажом.' },
  { id: 'event-3', title: 'Инвестиционное мероприятие', client: 'Бизнес-сообщество', year: '2024', category: 'Мероприятия', desc: 'Профессиональная видеосъемка бизнес-мероприятия инвестиционной тематики: интервью, общие планы, итоговый ролик.' },
  { id: 'arch-3', title: 'Видео для риелтора', client: 'Частный риелтор', year: '2025', category: 'Архитектурная съемка', desc: 'Продающая видеосъемка недвижимости в бюджетном сегменте. Профессиональный ролик раскрывает потенциал квартиры и ускоряет её продажу.' },
  { id: 'event-4', title: 'Видеоотчет бизнес обучения', client: 'Бизнес-школа', year: '2024', category: 'Мероприятия', desc: 'Видеоотчет корпоративного обучения для бизнес-школы: съемка лекций, воркшопов, интервью с участниками.' },
];

const BLOG_POSTS = [
  { slug: 'real-estate-video-marketing', title: 'Оживите пространство: Почему видеосъемка недвижимости — это стандарт современного маркетинга', date: '21 Апреля 2026', excerpt: 'В мире, где внимание клиента длится всего несколько секунд, статичных фотографий уже недостаточно. Разбираем, почему видео стало ключом к продаже недвижимости.' },
  { slug: 'petrovskie-ozera-case', title: 'Кейс: Как передать «душу» дома и продать его за 14 дней', date: '21 Апреля 2026', excerpt: 'В премиальном сегменте покупатель ищет не просто стены, а историю и уют. Проект в коттеджном поселке «Петровские озера» стал именно таким вызовом.' },
  { slug: 'photo-vs-video-real-estate', title: 'Фото vs Видео: Что быстрее продаст объект недвижимости?', date: '22 Апреля 2026', excerpt: 'Разбираем, что важнее — идеальный кадр или динамичный ролик? Спойлер: фото привлекает внимание, а видео заставляет влюбиться.' },
];

const distDir = path.resolve('./dist');
const baseHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Убираем дефолтные og-теги из базового шаблона (они будут заменены)
const cleanBase = baseHtml
  .replace(/<link rel="canonical"[^>]*>/g, "")
  .replace(/<meta property="og:title"[^>]*>/g, '')
  .replace(/<meta property="og:description"[^>]*>/g, '')
  .replace(/<meta property="og:url"[^>]*>/g, '')
  .replace(/<meta property="og:image"[^>]*>/g, '')
  .replace(/<meta property="og:type"[^>]*>/g, '')
  .replace(/<meta property="twitter:title"[^>]*>/g, '')
  .replace(/<meta property="twitter:description"[^>]*>/g, '')
  .replace(/<meta property="twitter:card"[^>]*>/g, '');

function makePage({ title, description, canonical, bodyContent }) {
  let html = cleanBase;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${description.replace(/"/g, '&quot;')}"`
  );

  const extraMeta = `
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
  <meta property="og:image" content="https://prizmaprod.ru/apple-touch-icon.png" />`;

  html = html.replace('</head>', extraMeta + '\n</head>');

  const noscriptBlock = `\n  <noscript>\n    <div style="font-family:sans-serif;max-width:900px;margin:0 auto;padding:40px 20px;color:#18181b;">\n      ${bodyContent}\n    </div>\n  </noscript>`;
  html = html.replace('<div id="root">', noscriptBlock + '\n  <div id="root">');

  return html;
}

const pages = [
  {
    file: 'index.html',
    title: 'PRIZMA Video Production | Видеопроизводство полного цикла в Воронеже',
    description: 'Профессиональный видеопродакшн PRIZMA в Воронеже. Архитектурная съемка недвижимости, контент для соцсетей, ИИ-генерация видео, освещение мероприятий. Работаем по всей России.',
    canonical: 'https://prizmaprod.ru/',
    bodyContent: `<h1>PRIZMA Video Production — Видеопроизводство полного цикла</h1><p>Профессиональная студия видеосъемки в Воронеже. Создаем видеоконтент, который решает бизнес-задачи.</p><h2>Наши услуги</h2><ul><li>Архитектурная и интерьерная видеосъемка недвижимости</li><li>Контент для соцсетей: Reels, TikTok, вертикальные ролики</li><li>Видеосъемка мероприятий, конференций, спортивных событий</li><li>ИИ-генерация видеоконтента</li><li>Корпоративные и рекламные ролики</li></ul><p>Телефон: +7 910 281-49-81</p>`
  },
  {
    file: 'portfolio/index.html',
    title: 'Портфолио | PRIZMA Video Production',
    description: 'Видеоработы студии PRIZMA: архитектурная съемка, контент для соцсетей, мероприятия. Проекты для Scentmart, Yardo, ВБЛ и других клиентов в Воронеже.',
    canonical: 'https://prizmaprod.ru/portfolio',
    bodyContent: `<h1>Портфолио PRIZMA Video Production</h1><ul>${PROJECTS.map(p => `<li><a href="/project/${p.id}">${p.title}</a> — ${p.client}, ${p.year}</li>`).join('')}</ul>`
  },
  {
    file: 'pricing/index.html',
    title: 'Цены на видеосъемку | PRIZMA Production',
    description: 'Стоимость профессиональной видеосъемки в Воронеже. Интерьерная съемка от 8 000 ₽, ролики для соцсетей, мероприятия. Прозрачные цены.',
    canonical: 'https://prizmaprod.ru/pricing',
    bodyContent: `<h1>Цены на видеосъемку — PRIZMA Production</h1><h2>Интерьерная съемка</h2><ul><li>До 60 м² — от 8 000 ₽</li><li>60–150 м² — от 12 000 ₽</li></ul><h2>Контент для соцсетей</h2><ul><li>Вертикальный ролик до 30 сек — от 6 000 ₽</li><li>Контент-день (8–12 роликов) — от 25 000 ₽</li></ul><h2>Мероприятия</h2><ul><li>1 час — от 5 000 ₽</li><li>Полный день — от 35 000 ₽</li></ul><h2>ИИ-контент</h2><ul><li>ИИ-интро до 15 сек — от 4 000 ₽</li></ul>`
  },
  {
    file: 'why-us/index.html',
    title: 'Почему PRIZMA | Видеопродакшн Воронеж',
    description: 'Почему выбирают студию PRIZMA: опыт в съемке недвижимости и бизнес-контента, современное оборудование, честные сроки и цены.',
    canonical: 'https://prizmaprod.ru/why-us',
    bodyContent: `<h1>Почему выбирают PRIZMA Production</h1><ul><li>Специализация на архитектурной съемке и контенте для бизнеса</li><li>Современное оборудование: кино-камеры, стабилизаторы, профессиональный свет</li><li>Прозрачное ценообразование без скрытых платежей</li><li>Четкие сроки сдачи материала</li><li>Работа по всей России с выездом на объект</li></ul>`
  },
  {
    file: 'team/index.html',
    title: 'Команда | PRIZMA Video Production',
    description: 'Команда видеопродакшн студии PRIZMA в Воронеже. Операторы, режиссеры и монтажеры с опытом в коммерческой съемке.',
    canonical: 'https://prizmaprod.ru/team',
    bodyContent: `<h1>Команда PRIZMA Video Production</h1><p>Профессиональная команда видеопроизводства в Воронеже. Операторы, режиссеры и монтажеры с опытом в архитектурной съемке, контенте для соцсетей и мероприятиях.</p>`
  },
  {
    file: 'contacts/index.html',
    title: 'Контакты | PRIZMA Production — Видеосъемка Воронеж',
    description: 'Свяжитесь с видеостудией PRIZMA в Воронеже. Телефон: +7 910 281-49-81. Заказ видеосъемки недвижимости, мероприятий и контента для соцсетей.',
    canonical: 'https://prizmaprod.ru/contacts',
    bodyContent: `<h1>Контакты PRIZMA Production</h1><ul><li>Телефон: +7 910 281-49-81</li><li>Telegram: @gnikw</li><li>ВКонтакте: vk.com/prizmastudia</li><li>Воронеж, ул. Революции 1905 года</li></ul>`
  },
  {
    file: 'journal/index.html',
    title: 'Журнал | Блог о видеосъемке — PRIZMA Production',
    description: 'Блог студии PRIZMA о видеосъемке недвижимости, контенте для бизнеса и трендах видеомаркетинга. Полезные статьи и кейсы.',
    canonical: 'https://prizmaprod.ru/journal',
    bodyContent: `<h1>Журнал PRIZMA — блог о видеосъемке</h1><ul>${BLOG_POSTS.map(p => `<li><a href="/journal/${p.slug}">${p.title}</a> — ${p.date}. ${p.excerpt}</li>`).join('')}</ul>`
  },
];

PROJECTS.forEach(p => {
  pages.push({
    file: `project/${p.id}/index.html`,
    title: `${p.title} | PRIZMA Production`,
    description: p.desc,
    canonical: `https://prizmaprod.ru/project/${p.id}`,
    bodyContent: `<h1>${p.title}</h1><p><strong>Клиент:</strong> ${p.client} | <strong>Год:</strong> ${p.year} | <strong>Категория:</strong> ${p.category}</p><p>${p.desc}</p><p><a href="/portfolio">← Все проекты</a></p>`
  });
});

BLOG_POSTS.forEach(post => {
  pages.push({
    file: `journal/${post.slug}/index.html`,
    title: `${post.title} | PRIZMA Production`,
    description: post.excerpt,
    canonical: `https://prizmaprod.ru/journal/${post.slug}`,
    bodyContent: `<h1>${post.title}</h1><p><strong>Дата:</strong> ${post.date}</p><p>${post.excerpt}</p><p><a href="/journal">← Все статьи</a></p>`
  });
});

// Пересобираем базовый index.html чтобы не испортить его повторным запуском
const originalBase = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
let count = 0;

pages.forEach(page => {
  const filePath = path.join(distDir, page.file);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const html = makePage(page);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ ${page.file}`);
  count++;
});

console.log(`\n✅ Готово: ${count} HTML-страниц в dist/`);
