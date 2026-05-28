
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
