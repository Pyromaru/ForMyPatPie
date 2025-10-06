const book = document.getElementById('book');
const pages = Array.from(book.querySelectorAll('.page'));
let current = 0;

const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
let musicPlaying = false;

const flipSound = document.getElementById('flip-sound');

// Page flip logic
const updatePages = () => {
  pages.forEach((p, i) => {
    if (i <= current - 1) p.classList.add('flipped');
    else p.classList.remove('flipped');
  });

  // Flip sound & timing
  flipSound.currentTime = 0;
  flipSound.play().catch(() => {});

  // Slow down class reflow for better smoothness
  pages.forEach(p => {
    p.style.transitionDuration = '1.6s';
  });
};


document.getElementById('next').addEventListener('click', () => {
  if (current < pages.length) current++;
  if (current > pages.length - 1) current = pages.length - 1;
  updatePages();
  checkFinal();
});

document.getElementById('prev').addEventListener('click', () => {
  if (current > 0) current--;
  updatePages();
  checkFinal();
});

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') document.getElementById('next').click();
  if (e.key === 'ArrowLeft') document.getElementById('prev').click();
});

musicBtn.addEventListener('click', () => {
  if (!musicPlaying) {
    music.play().catch(() => {});
    musicBtn.textContent = '🔊';
    musicPlaying = true;
  } else {
    music.pause();
    musicBtn.textContent = '♪';
    musicPlaying = false;
  }
});

function checkFinal() {
  const finalIndex = pages.length - 1;
  if (current === finalIndex) showProposal();
}

function showProposal() {
  const proposal = document.getElementById('proposal');
  proposal.classList.add('pulse');
  startHearts();
}

function startHearts() {
  if (document.getElementById('hearts')) return;
  const wrap = document.createElement('div');
  wrap.id = 'hearts';
  document.body.appendChild(wrap);
  const colors = ['#ffd6e0','#fff1c6','#f6d9ff','#cdeffd'];
  let count = 0;
  const makeHeart = () => {
    const h = document.createElement('div');
    h.className = 'heart';
    h.style.position = 'absolute';
    h.style.left = Math.random() * 100 + '%';
    h.style.top = '100%';
    h.style.opacity = Math.random() * 0.9 + 0.2;
    const size = 18 + Math.random() * 36;
    h.style.width = size + 'px';
    h.style.height = size + 'px';
    h.style.background = colors[Math.floor(Math.random() * colors.length)];
    h.style.borderRadius = '50%';
    h.style.transform = 'rotate(45deg)';
    h.style.pointerEvents = 'none';
    h.style.transition = 'transform 3s ease-out, top 3s ease-out, opacity 2.6s';
    wrap.appendChild(h);
    requestAnimationFrame(() => {
      h.style.top = (20 + Math.random() * 60) + '%';
      const tx = (Math.random() * 200 - 100) + 'px';
      h.style.transform = `translateX(${tx}) rotate(${Math.random() * 360}deg) scale(1)`;
      h.style.opacity = 0;
    });
    setTimeout(() => { h.remove(); }, 3200);
    count++;
    if (count < 40) setTimeout(makeHeart, 120 + Math.random() * 240);
  };
  makeHeart();
}

const style = document.createElement('style');
style.innerHTML = `
.pulse { animation: pop .9s ease forwards; }
@keyframes pop { 0%{ transform: scale(0.9) } 50%{ transform: scale(1.08) } 100%{ transform: scale(1) } }
.heart{box-shadow:0 8px 20px rgba(0,0,0,0.06)}
`;
document.head.appendChild(style);



// Cover logic
const cover = document.getElementById('cover-screen');
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  cover.style.animation = 'fadeout 1s forwards';
  document.querySelector('.header').classList.remove('hidden');
  document.querySelector('.book-scene').classList.remove('hidden');
  document.querySelector('.footer').classList.remove('hidden');
  setTimeout(() => cover.remove(), 1000);
  music.play().catch(() => {});
  musicPlaying = true;
  musicBtn.textContent = '🔊';
  flipSound.play().catch(() => {}); // play flip sound when opening
});

// Initialize
updatePages();
