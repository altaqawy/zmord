
const STORAGE_KEY='zmord_site_data_v2';const STATS_KEY='zmord_site_stats_v2';let state=loadData();
function loadData(){const s=localStorage.getItem(STORAGE_KEY);if(s){try{return JSON.parse(s)}catch(e){}}return structuredClone(window.ZMORD_DEFAULT_DATA||{})}
function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function money(v){return `${state.settings.currency} ${Number(v||0).toFixed(3)}`}
function waLink(msg=''){return `https://wa.me/${state.settings.whatsapp}?text=${encodeURIComponent(msg)}`}
function products(){return (state.products||[]).filter(p=>p.active)}
function track(event){const x=JSON.parse(localStorage.getItem(STATS_KEY)||'[]');x.push({event,at:new Date().toISOString(),page:location.pathname});localStorage.setItem(STATS_KEY,JSON.stringify(x.slice(-1000)))}
function applySettings(){const s=state.settings;$$('[data-logo-light]').forEach(e=>e.src=s.logoLight);$$('[data-logo-dark]').forEach(e=>e.src=s.logoDark);$$('[data-footer-logo]').forEach(e=>e.src=s.footerLogo);$$('[data-hero-bg]').forEach(e=>e.src=s.heroBg);$$('[data-hero-cake]').forEach(e=>e.src=s.heroCake);$$('[data-hero-eyebrow]').forEach(e=>e.textContent=s.heroEyebrow);$$('[data-hero-title]').forEach(e=>e.textContent=s.heroTitle);$$('[data-hero-highlight]').forEach(e=>e.textContent=s.heroHighlight);$$('[data-hero-text]').forEach(e=>e.textContent=s.heroText);$$('[data-delivery-text]').forEach(e=>e.textContent=s.deliveryText);$$('[data-whatsapp]').forEach(a=>a.href=waLink('Hello ZMORD Cake, I want to order.'));$$('[data-phone]').forEach(a=>{a.href=`tel:+${s.whatsapp}`;a.textContent=`+${s.whatsapp.replace(/^(\d{3})(\d{4})(\d+)/,'$1 $2 $3')}`});$$('[data-email]').forEach(a=>{a.href=`mailto:${s.email}`;a.textContent=s.email});Object.entries(state.sections||{}).forEach(([k,v])=>$$(`[data-section="${k}"]`).forEach(e=>e.classList.toggle('hidden',!v)))}
function productCard(p){return `<article class="product-card ${p.bestseller?'bestseller':''}"><img src="${p.image}" alt="${p.name}" data-open-product="${p.id}"><div class="product-info"><h3>${p.name}</h3><p>★ ${p.rating||4.8} <span>(${p.reviews||0})</span></p><strong>${money(p.price)}</strong><button data-order-product="${p.id}">🛒</button></div></article>`}
function renderProducts(){const f=$('[data-featured-products]');if(f)f.innerHTML=products().filter(p=>p.featured).slice(0,4).map(productCard).join('');const all=$('[data-all-products]');if(all){const cat=new URLSearchParams(location.search).get('category')||'all';const list=cat==='all'?products():products().filter(p=>p.category===cat);all.innerHTML=list.map(productCard).join('')}const filters=$('[data-filters]');if(filters){const cats=['all',...new Set(products().map(p=>p.category))];const current=new URLSearchParams(location.search).get('category')||'all';filters.innerHTML=cats.map(c=>`<a class="filter-chip ${c===current?'active':''}" href="${c==='all'?'products.html':'products.html?category='+c}">${c}</a>`).join('')}}
function renderBranches(){$$('[data-branches]').forEach(h=>{h.innerHTML=(state.branches||[]).filter(b=>b.active).map(b=>`<article class="branch-card"><h3>${b.name}</h3><p><strong>Area:</strong> ${b.area}</p><p><strong>Address:</strong> ${b.address}</p><p><strong>Hours:</strong> ${b.hours}</p><p><strong>Phone:</strong> ${b.phone}</p><a class="text-link" href="${b.mapUrl||'#'}">Open location →</a></article>`).join('')})}
function openProduct(id){const p=state.products.find(x=>x.id===id);if(!p)return;track('product_view');const m=$('[data-product-modal]');m.innerHTML=`<div class="modal-card"><button class="modal-close" data-close-modal>×</button><img src="${p.image}" alt="${p.name}"><div class="modal-content"><p class="eyebrow">${p.category} <span>♥</span></p><h2>${p.name}</h2><p>${p.description||''}</p><strong>${money(p.price)}</strong><ul class="specs">${(p.specs||[]).map(s=>`<li>${s}</li>`).join('')}</ul><button class="btn primary" data-order-product="${p.id}">Order this cake</button></div></div>`;m.classList.add('active')}
function openOrder(id){const p=state.products.find(x=>x.id===id);if(!p)return;track('order_click');const methods=(state.deliveryMethods||[]).filter(m=>m.active);const d=$('[data-order-drawer]');d.innerHTML=`<div class="drawer-backdrop" data-close-drawer></div><div class="drawer-panel"><button class="drawer-close" data-close-drawer>×</button><h2>Order ${p.name}</h2><p><strong>${money(p.price)}</strong></p><form class="form-grid" data-order-form><input name="name" placeholder="Your name" required><input name="phone" placeholder="Phone number" required><select name="method">${methods.map(m=>`<option value="${m.id}">${m.name} ${m.price?'+ '+money(m.price):''}</option>`).join('')}</select><textarea name="notes" rows="4" placeholder="Cake size, date, message, delivery area..."></textarea><button class="btn primary" type="submit">Send order on WhatsApp</button></form></div>`;d.classList.add('active');$('[data-order-form]',d).onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);const method=methods.find(m=>m.id===fd.get('method'));const msg=`Hello ZMORD Cake, I want to order:\nProduct: ${p.name}\nPrice: ${money(p.price)}\nName: ${fd.get('name')}\nPhone: ${fd.get('phone')}\nMethod: ${method?.name||fd.get('method')}\nNotes: ${fd.get('notes')||'-'}`;location.href=waLink(msg)}}
document.addEventListener('click',e=>{const o=e.target.closest('[data-open-product]');if(o)openProduct(o.dataset.openProduct);const ord=e.target.closest('[data-order-product]');if(ord)openOrder(ord.dataset.orderProduct);if(e.target.closest('[data-close-modal]'))$('[data-product-modal]')?.classList.remove('active');if(e.target.closest('[data-close-drawer]'))$('[data-order-drawer]')?.classList.remove('active')});
async function bootstrapPublicSite(){
  try{
    if(window.ZMORD_BACKEND && window.ZMORD_BACKEND.isConfigured()){
      const remoteData = await window.ZMORD_BACKEND.getSiteData();
      if(remoteData){
        state = remoteData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    }
  }catch(err){
    console.warn("ZMORD backend load failed, using local data.", err);
  }
  applySettings();
  renderProducts();
  renderBranches();
  track('page_view');
}
bootstrapPublicSite();


/* ================================
   v4 Butterfly click flight
================================ */
function miniButterflySvg(includeWhatsApp = false){
  const whatsappBadge = includeWhatsApp ? `
    <g>
      <circle cx="92" cy="39" r="12.8" fill="rgba(255,255,255,.42)" stroke="rgba(255,255,255,.78)" stroke-width="2" />
      <path fill="#b85f76" transform="translate(80.2 27.2) scale(.74)" d="M16.03 3C8.88 3 3.08 8.8 3.08 15.95c0 2.28.6 4.5 1.74 6.45L3 29l6.78-1.78a12.86 12.86 0 0 0 6.25 1.6h.01C23.18 28.82 29 23.02 29 15.87 29 8.74 23.18 3 16.03 3Zm0 23.62h-.01c-1.86 0-3.69-.5-5.29-1.45l-.38-.23-4.02 1.05 1.07-3.91-.25-.4a10.66 10.66 0 0 1-1.65-5.73c0-5.82 4.73-10.55 10.56-10.55 2.82 0 5.47 1.1 7.46 3.09a10.48 10.48 0 0 1 3.09 7.43c0 5.82-4.75 10.7-10.58 10.7Zm5.79-7.9c-.32-.16-1.88-.93-2.17-1.04-.29-.1-.5-.16-.72.16-.21.32-.83 1.04-1.02 1.25-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.15.32-.38.48-.57.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.27 3.46 5.5 4.85.77.33 1.37.53 1.84.68.77.25 1.47.21 2.03.13.62-.09 1.88-.77 2.15-1.51.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
    </g>` : '';

  return `<svg viewBox="0 0 120 100" aria-hidden="true">
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
  </svg>`;
}

function runButterflyTransition(event){
  const butterflyLink = event.currentTarget;
  if (!butterflyLink || butterflyLink.classList.contains('is-flying')) return;
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
  const vh = window.innerHeight;
  const isMobile = vw < 720;
  const leaderEndX = vw + (isMobile ? 90 : 160);
  const leaderEndY = -120;
  const leaderMidX = Math.min(vw - 80, startX + (isMobile ? 95 : 190));
  const leaderMidY = Math.max(70, startY - (isMobile ? 120 : 180));

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

  const count = isMobile ? 16 : 30;
  for (let i = 0; i < count; i++) {
    const b = document.createElement('span');
    b.className = 'swarm-butterfly';
    const size = Math.round((isMobile ? 24 : 26) + Math.random() * (isMobile ? 34 : 48));
    const delay = (0.08 + Math.random() * .42).toFixed(2);
    const endX = leaderEndX - 40 - Math.random() * (isMobile ? 120 : 240);
    const endY = leaderEndY + 40 + (-120 + Math.random() * 250);
    const midX = leaderMidX - 30 - Math.random() * (isMobile ? 100 : 180);
    const midY = leaderMidY + (-70 + Math.random() * 160);

    b.style.setProperty('--size', `${size}px`);
    b.style.setProperty('--start-x', `${startX - 8 + Math.random() * 16}px`);
    b.style.setProperty('--start-y', `${startY - 8 + Math.random() * 16}px`);
    b.style.setProperty('--mid-x', `${midX}px`);
    b.style.setProperty('--mid-y', `${midY}px`);
    b.style.setProperty('--end-x', `${endX}px`);
    b.style.setProperty('--end-y', `${endY}px`);
    b.style.setProperty('--delay', `${delay}s`);
    b.style.setProperty('--start-r', `${-25 + Math.random() * 50}deg`);
    b.style.setProperty('--mid-r', `${-38 + Math.random() * 76}deg`);
    b.style.setProperty('--end-r', `${-50 + Math.random() * 100}deg`);
    b.innerHTML = miniButterflySvg(false);
    overlay.appendChild(b);
  }

  document.body.appendChild(overlay);
  butterflyLink.classList.add('is-flying');

  setTimeout(() => {
    if (butterflyLink.target === '_blank') {
      window.open(url, '_blank', 'noopener');
      overlay.remove();
      butterflyLink.classList.remove('is-flying');
    } else {
      window.location.href = url;
    }
  }, 1700);
}

function initButterflyTransition(){
  document.querySelectorAll('[data-butterfly-link]').forEach(link => {
    if (link.dataset.transitionReady === '1') return;
    link.dataset.transitionReady = '1';
    link.addEventListener('click', runButterflyTransition);
  });
}

initButterflyTransition();
