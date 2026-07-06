const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');
const modal = document.getElementById('video-modal');
const modalClose = document.querySelector('.modal-close');
const toast = document.getElementById('toast');
const languageButton = document.querySelector('.language-button');

const font = document.createElement('link');
font.rel = 'stylesheet';
font.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700&display=swap';
document.head.appendChild(font);

const amharicStyle = document.createElement('style');
amharicStyle.textContent = `
html.i18n-loading body{visibility:hidden}
body.lang-am{font-family:'Noto Sans Ethiopic','DM Sans',sans-serif}
body.lang-am h1,body.lang-am h2,body.lang-am h3,body.lang-am blockquote,body.lang-am .experience-badge strong,body.lang-am .stats-grid strong,body.lang-am .step-card>span,body.lang-am .reel-copy strong,body.lang-am .video-text strong{font-family:'Noto Sans Ethiopic',sans-serif;letter-spacing:-.015em;line-height:1.28}
body.lang-am .hero h1{font-size:clamp(2.85rem,4.7vw,5rem);line-height:1.22}
body.lang-am .section-copy h2,body.lang-am .section-heading h2,body.lang-am .film-copy h2,body.lang-am .apply-copy h2,body.lang-am .faq-intro h2{line-height:1.3}
body.lang-am .brand small,body.lang-am .eyebrow,body.lang-am .program-content small,body.lang-am .form-header span{letter-spacing:.04em}
body.lang-am .site-nav{gap:22px}
body.lang-am .button{line-height:1.35;text-align:center}
@media(max-width:780px){body.lang-am .hero h1{font-size:clamp(2.55rem,10.5vw,4.1rem)}}`;
document.head.appendChild(amharicStyle);

document.documentElement.classList.add('i18n-loading');

let enToAm = {};
let amToEn = {};
let currentLanguage = 'en';
let translationsReady = false;

const replaceTrimmedText = (node, dictionary) => {
  const raw = node.nodeValue;
  const trimmed = raw.trim();
  if (!trimmed || !dictionary[trimmed]) return;
  const leading = raw.match(/^\s*/)[0];
  const trailing = raw.match(/\s*$/)[0];
  node.nodeValue = `${leading}${dictionary[trimmed]}${trailing}`;
};

const translatePage = language => {
  if (!translationsReady) return;
  const dictionary = language === 'am' ? enToAm : amToEn;
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent === languageButton) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node => replaceTrimmedText(node, dictionary));

  document.querySelectorAll('[placeholder], [aria-label], [title], meta[name="description"]').forEach(element => {
    ['placeholder', 'aria-label', 'title', 'content'].forEach(attribute => {
      const value = element.getAttribute(attribute);
      if (value && dictionary[value]) element.setAttribute(attribute, dictionary[value]);
    });
  });

  currentLanguage = language;
  document.documentElement.lang = language;
  document.body.classList.toggle('lang-am', language === 'am');
  document.body.classList.toggle('lang-en', language === 'en');
  languageButton.textContent = language === 'am' ? 'EN' : 'አማ';
  languageButton.setAttribute('aria-label', language === 'am' ? (enToAm['Switch to English'] || 'Switch to English') : 'Switch to Amharic');
  renderScene();
};

window.addEventListener('scroll', () => {
  header.classList.toggle('sticky', window.scrollY > 60);
});

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const showToast = () => {
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 4200);
};

['visit-form', 'application-form'].forEach(id => {
  document.getElementById(id)?.addEventListener('submit', event => {
    event.preventDefault();
    event.currentTarget.reset();
    showToast();
  });
});

const openModal = () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modalClose.focus();
};

const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

document.querySelectorAll('.video-open').forEach(button => button.addEventListener('click', openModal));
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

const scenes = [
  { image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=88', title: 'A place to belong.', subtitle: 'Safe campus • Caring teachers' },
  { image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=88', title: 'A place to discover.', subtitle: 'Strong academics • Active learning' },
  { image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=88', title: 'A future to build.', subtitle: 'Admissions now open • Apply today' }
];

let sceneIndex = 0;
const reel = document.getElementById('reel-preview');
const videoStage = document.getElementById('video-stage');
const reelTitle = document.getElementById('reel-title');
const reelSubtitle = document.getElementById('reel-subtitle');
const modalTitle = document.getElementById('modal-video-title');
const modalSubtitle = document.getElementById('modal-video-subtitle');

function renderScene() {
  const scene = scenes[sceneIndex];
  const title = currentLanguage === 'am' ? (enToAm[scene.title] || scene.title) : scene.title;
  const subtitle = currentLanguage === 'am' ? (enToAm[scene.subtitle] || scene.subtitle) : scene.subtitle;
  [reel, videoStage].forEach(element => { element.style.backgroundImage = `url('${scene.image}')`; });
  reelTitle.textContent = title;
  reelSubtitle.textContent = subtitle;
  modalTitle.textContent = title;
  modalSubtitle.textContent = subtitle;
}

window.setInterval(() => {
  sceneIndex = (sceneIndex + 1) % scenes.length;
  renderScene();
}, 4000);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.getElementById('year').textContent = new Date().getFullYear();

languageButton.addEventListener('click', () => {
  translatePage(currentLanguage === 'am' ? 'en' : 'am');
});

async function initializeLanguage() {
  try {
    const files = ['translations-am-1.json', 'translations-am-2.json', 'translations-am-3.json'];
    const responses = await Promise.all(files.map(file => fetch(file)));
    if (responses.some(response => !response.ok)) throw new Error('Translation file failed to load');
    const parts = await Promise.all(responses.map(response => response.json()));
    enToAm = Object.assign({}, ...parts);
    amToEn = Object.fromEntries(Object.entries(enToAm).map(([english, amharic]) => [amharic, english]));
    translationsReady = true;
    translatePage('am');
  } catch (error) {
    console.error('Language setup failed:', error);
    currentLanguage = 'en';
    languageButton.textContent = 'አማ';
    renderScene();
  } finally {
    document.documentElement.classList.remove('i18n-loading');
  }
}

initializeLanguage();
