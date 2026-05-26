const layer = document.querySelector('.petals-layer');
const petalAssets = [
  'assets/petal-1.png','assets/petal-2.png','assets/petal-3.png','assets/petal-4.png',
  'assets/petal-5.png','assets/petal-6.png','assets/petal-7.png','assets/petal-8.png'
];
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (layer && !prefersReduced) {
  const count = window.innerWidth < 700 ? 7 : window.innerWidth < 1100 ? 11 : 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'petal' + (i % 4 === 0 ? ' blur' : '') + (i % 6 === 0 ? ' front' : '');
    const size = Math.round(18 + Math.random() * 24 + (i % 6 === 0 ? 10 : 0));
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${2 + Math.random() * 94}%`;
    p.style.backgroundImage = `url('${petalAssets[i % petalAssets.length]}')`;
    p.style.animationDuration = `${10 + Math.random() * 9}s`;
    p.style.animationDelay = `${Math.random() * -18}s`;
    p.style.setProperty('--drift1', `${-70 + Math.random() * 140}px`);
    p.style.setProperty('--drift2', `${-90 + Math.random() * 180}px`);
    p.style.setProperty('--drift3', `${-60 + Math.random() * 120}px`);
    p.style.setProperty('--op', `${0.26 + Math.random() * 0.34}`);
    layer.appendChild(p);
  }
}


// Butterfly WhatsApp transition: original butterfly flies out, then the swarm follows
(function () {
  function miniButterflySvg(includeWhatsApp = false) {
    const whatsappBadge = includeWhatsApp ? `
      <g>
        <circle cx="92" cy="39" r="12.8" fill="rgba(255,255,255,.42)" stroke="rgba(255,255,255,.78)" stroke-width="2" />
        <path fill="#b85f76" transform="translate(80.2 27.2) scale(.74)" d="M16.03 3C8.88 3 3.08 8.8 3.08 15.95c0 2.28.6 4.5 1.74 6.45L3 29l6.78-1.78a12.86 12.86 0 0 0 6.25 1.6h.01C23.18 28.82 29 23.02 29 15.87 29 8.74 23.18 3 16.03 3Zm0 23.62h-.01c-1.86 0-3.69-.5-5.29-1.45l-.38-.23-4.02 1.05 1.07-3.91-.25-.4a10.66 10.66 0 0 1-1.65-5.73c0-5.82 4.73-10.55 10.56-10.55 2.82 0 5.47 1.1 7.46 3.09a10.48 10.48 0 0 1 3.09 7.43c0 5.82-4.75 10.7-10.58 10.7Zm5.79-7.9c-.32-.16-1.88-.93-2.17-1.04-.29-.1-.5-.16-.72.16-.21.32-.83 1.04-1.02 1.25-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.15.32-.38.48-.57.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.27 3.46 5.5 4.85.77.33 1.37.53 1.84.68.77.25 1.47.21 2.03.13.62-.09 1.88-.77 2.15-1.51.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
      </g>
    ` : '';

    return `
      <svg viewBox="0 0 120 100" aria-hidden="true">
        <defs>
          <radialGradient id="miniWingGradient" cx="42%" cy="34%" r="78%">
            <stop offset="0%" stop-color="#fff7f9" />
            <stop offset="48%" stop-color="#f7b8c8" />
            <stop offset="100%" stop-color="#d56f89" />
          </radialGradient>
          <linearGradient id="miniBodyGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#cf7088" />
            <stop offset="100%" stop-color="#8e3f56" />
          </linearGradient>
        </defs>
        <g>
          <path d="M58 34 C51 20, 42 14, 32 10" fill="none" stroke="#b65a73" stroke-width="2.1" stroke-linecap="round" opacity=".85" />
          <path d="M62 34 C69 20, 78 14, 88 10" fill="none" stroke="#b65a73" stroke-width="2.1" stroke-linecap="round" opacity=".85" />
          <circle cx="32" cy="10" r="2.2" fill="#b65a73" />
          <circle cx="88" cy="10" r="2.2" fill="#b65a73" />
          <g class="mini-left">
            <path d="M58 49 C38 11, 14 10, 9 34 C5 56, 31 66, 58 49Z" fill="url(#miniWingGradient)" stroke="rgba(255,255,255,.9)" stroke-width="1.2" />
            <path d="M56 53 C26 44, 10 59, 20 78 C31 97, 52 82, 56 53Z" fill="url(#miniWingGradient)" stroke="rgba(255,255,255,.9)" stroke-width="1.2" />
          </g>
          <g class="mini-right">
            <path d="M62 49 C82 11, 106 10, 111 34 C115 56, 89 66, 62 49Z" fill="url(#miniWingGradient)" stroke="rgba(255,255,255,.9)" stroke-width="1.2" />
            <path d="M64 53 C94 44, 110 59, 100 78 C89 97, 68 82, 64 53Z" fill="url(#miniWingGradient)" stroke="rgba(255,255,255,.9)" stroke-width="1.2" />
            ${whatsappBadge}
          </g>
          <path d="M60 32 C56 41, 55 55, 58 82 C58.5 88, 61.5 88, 62 82 C65 55, 64 41, 60 32Z" fill="url(#miniBodyGradient)" />
        </g>
      </svg>
    `;
  }

  function runButterflyTransition(event, butterflyLink) {
    event.preventDefault();

    const url = butterflyLink.href;
    const rect = butterflyLink.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const overlay = document.createElement('div');
    overlay.className = 'butterfly-transition active';
    overlay.style.setProperty('--click-x', `${startX}px`);
    overlay.style.setProperty('--click-y', `${startY}px`);

    const glow = document.createElement('span');
    glow.className = 'transition-center-glow';
    overlay.appendChild(glow);

    const vw = window.innerWidth;
    const leaderEndX = vw + 160;
    const leaderEndY = -140;
    const leaderMidX = Math.min(vw - 150, startX + 190);
    const leaderMidY = Math.max(80, startY - 170);

    const leader = document.createElement('span');
    leader.className = 'leader-butterfly';
    leader.style.setProperty('--leader-x', `${startX}px`);
    leader.style.setProperty('--leader-y', `${startY}px`);
    leader.style.setProperty('--leader-mid-x', `${leaderMidX}px`);
    leader.style.setProperty('--leader-mid-y', `${leaderMidY}px`);
    leader.style.setProperty('--leader-end-x', `${leaderEndX}px`);
    leader.style.setProperty('--leader-end-y', `${leaderEndY}px`);
    leader.innerHTML = miniButterflySvg(true);
    overlay.appendChild(leader);

    const count = window.innerWidth < 640 ? 18 : 32;
    for (let i = 0; i < count; i++) {
      const b = document.createElement('span');
      b.className = 'swarm-butterfly';
      const size = Math.round(26 + Math.random() * 48);
      const delay = (0.12 + Math.random() * .46).toFixed(2);
      const spread = -140 + Math.random() * 280;
      const endX = leaderEndX - 60 - Math.random() * 220;
      const endY = leaderEndY + 60 + spread;
      const midX = leaderMidX - 60 - Math.random() * 180;
      const midY = leaderMidY + 20 + (-80 + Math.random() * 160);

      b.style.setProperty('--size', `${size}px`);
      b.style.setProperty('--start-x', `${startX - 10 + Math.random() * 20}px`);
      b.style.setProperty('--start-y', `${startY - 10 + Math.random() * 20}px`);
      b.style.setProperty('--mid-x', `${midX}px`);
      b.style.setProperty('--mid-y', `${midY}px`);
      b.style.setProperty('--end-x', `${endX}px`);
      b.style.setProperty('--end-y', `${endY}px`);
      b.style.setProperty('--delay', `${delay}s`);
      b.style.setProperty('--start-r', `${-25 + Math.random() * 50}deg`);
      b.style.setProperty('--mid-r', `${-35 + Math.random() * 70}deg`);
      b.style.setProperty('--end-r', `${-45 + Math.random() * 90}deg`);
      b.innerHTML = miniButterflySvg(false);
      overlay.appendChild(b);
    }

    document.body.appendChild(overlay);
    butterflyLink.style.opacity = '0';
    butterflyLink.style.pointerEvents = 'none';

    setTimeout(() => {
      window.location.href = url;
    }, 1750);
  }

  document.querySelectorAll('[data-butterfly-link]').forEach((butterflyLink) => {
    butterflyLink.addEventListener('click', (event) => runButterflyTransition(event, butterflyLink));
  });
})();
