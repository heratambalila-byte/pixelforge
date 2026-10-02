const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  mobileNav.hidden = isOpen;
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menuToggle.focus();
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

const workItems = [
  { src: 'assets/images/demo1.png', title: 'Matcha drink graphic', alt: 'Green promotional graphic showing two iced matcha drinks' },
  { src: 'assets/images/demo2.png', title: 'Chicken burger graphic', alt: 'Food graphic featuring a double chicken burger' },
  { src: 'assets/images/demo3.png', title: 'Sushi promotion graphic', alt: 'White and red sushi promotional graphic' },
  { src: 'assets/images/demo4.png', title: 'General Assembly poster', alt: 'General Assembly event poster on a tree-lined background' }
];

const videoItems = [
  { src: 'assets/videos/video1.mp4', title: 'Video edit 01' },
  { src: 'assets/videos/video2-web.mp4', title: 'Video edit 02' },
  { src: 'assets/videos/video3-web.mp4', title: 'Video edit 03' },
  { src: 'assets/videos/video4-web.mp4', title: 'Video edit 04' },
  { src: 'assets/videos/video5.mp4', poster: 'assets/images/video5-poster.jpg', title: 'Video edit 05' }
];

const workMedia = document.getElementById('work-media');
const workGallery = document.getElementById('work-gallery');
const workCaption = document.getElementById('work-caption');
const workCount = document.getElementById('work-count');
const workShowcase = document.querySelector('.work-showcase');
const workPeeks = [document.querySelector('.work-peek-left'), document.querySelector('.work-peek-right')];
let activeWork = 0;

function makeWorkMedia(item, featured = false) {
  const image = document.createElement('img');
  image.src = item.src;
  image.alt = item.alt;
  image.loading = featured ? 'eager' : 'lazy';
  return image;
}

function showWork(index) {
  activeWork = (index + workItems.length) % workItems.length;
  const item = workItems[activeWork];
  workMedia.replaceChildren(makeWorkMedia(item, true));
  workCaption.textContent = item.title;
  workCount.textContent = `${String(activeWork + 1).padStart(2, '0')} / ${String(workItems.length).padStart(2, '0')}`;
  workPeeks.forEach((peek, offset) => {
    const neighbor = workItems[(activeWork + (offset === 0 ? -1 : 1) + workItems.length) % workItems.length];
    const image = makeWorkMedia(neighbor);
    image.alt = '';
    peek.replaceChildren(image);
  });
}

videoItems.forEach(item => {
  const card = document.createElement('article');
  card.className = 'video-card';
  const stage = document.createElement('div');
  stage.className = 'video-stage';
  const video = document.createElement('video');
  video.src = item.src;
  if (item.poster) video.poster = item.poster;
  video.preload = 'metadata';
  video.playsInline = true;
  video.muted = true;
  video.controls = true;
  video.setAttribute('aria-label', item.title);
  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'video-play';
  play.setAttribute('aria-label', `Play ${item.title}`);
  play.textContent = '▶';
  const caption = document.createElement('div');
  caption.className = 'video-caption';
  const kind = document.createElement('span');
  kind.textContent = 'VIDEO EDITING';
  const title = document.createElement('h4');
  title.textContent = item.title;
  caption.append(kind, title);
  stage.append(video, play);
  card.append(stage, caption);

  function startVideo() {
    workGallery.querySelectorAll('video').forEach(other => {
      if (other !== video) other.pause();
    });
    video.play().catch(() => {});
  }
  play.addEventListener('click', () => {
    startVideo();
    video.focus();
  });
  video.addEventListener('play', () => {
    workGallery.querySelectorAll('video').forEach(other => {
      if (other !== video) other.pause();
    });
    card.classList.add('is-playing');
  });
  video.addEventListener('pause', () => card.classList.remove('is-playing'));
  card.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) startVideo();
  });
  card.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') video.pause();
  });
  workGallery.append(card);
});
document.querySelector('.work-prev').addEventListener('click', () => showWork(activeWork - 1));
document.querySelector('.work-next').addEventListener('click', () => showWork(activeWork + 1));
workShowcase.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showWork(activeWork + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
showWork(0);

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const sections = document.querySelectorAll('main > section');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

  sections.forEach(section => revealObserver.observe(section));
  document.body.classList.add('reveal-enabled');
}

if (window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('.purpose-card, .service-card, .process-grid li, .price-card, .operations-grid article').forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--hover-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
      card.style.setProperty('--hover-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--hover-x');
      card.style.removeProperty('--hover-y');
    });
  });
}
