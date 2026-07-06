const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');
const modal = document.getElementById('video-modal');
const modalClose = document.querySelector('.modal-close');
const toast = document.getElementById('toast');

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
  document.getElementById(id).addEventListener('submit', event => {
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
  {
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=88',
    title: 'A place to belong.',
    subtitle: 'Safe campus • Caring teachers'
  },
  {
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=88',
    title: 'A place to discover.',
    subtitle: 'Strong academics • Active learning'
  },
  {
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=88',
    title: 'A future to build.',
    subtitle: 'Admissions now open • Apply today'
  }
];

let sceneIndex = 0;
const reel = document.getElementById('reel-preview');
const videoStage = document.getElementById('video-stage');
const reelTitle = document.getElementById('reel-title');
const reelSubtitle = document.getElementById('reel-subtitle');
const modalTitle = document.getElementById('modal-video-title');
const modalSubtitle = document.getElementById('modal-video-subtitle');

window.setInterval(() => {
  sceneIndex = (sceneIndex + 1) % scenes.length;
  const scene = scenes[sceneIndex];
  [reel, videoStage].forEach(el => { el.style.backgroundImage = `url('${scene.image}')`; });
  reelTitle.textContent = scene.title;
  reelSubtitle.textContent = scene.subtitle;
  modalTitle.textContent = scene.title;
  modalSubtitle.textContent = scene.subtitle;
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

const languageButton = document.querySelector('.language-button');
let amharic = false;
languageButton.addEventListener('click', () => {
  amharic = !amharic;
  languageButton.textContent = amharic ? 'EN' : 'አማ';
  languageButton.setAttribute('aria-label', amharic ? 'Switch to English' : 'Switch to Amharic');
  showToast();
});
