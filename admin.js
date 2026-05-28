
const STORAGE_KEY='zmord_site_data_v2',STATS_KEY='zmord_site_stats_v2';let data=load();let editingProduct=null,editingBranch=null,uploadedImage=null;
function load(){const s=localStorage.getItem(STORAGE_KEY);if(s){try{return JSON.parse(s)}catch(e){}}return structuredClone(window.ZMORD_DEFAULT_DATA||{})}
async function save(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
  try{
    if(window.ZMORD_BACKEND && window.ZMORD_BACKEND.isConfigured()){
      await window.ZMORD_BACKEND.saveSiteData(data);
      alert('تم الحفظ في Firebase وعلى هذا المتصفح');
      setBackendStatus(true);
      return;
    }
  }catch(err){
    console.warn(err);
    alert('تم الحفظ في المتصفح فقط، وفشل الحفظ في Firebase');
    setBackendStatus(false);
    return;
  }
  alert('تم الحفظ في المتصفح فقط');
}

function setBackendStatus(connected){
  const badge = document.querySelector('[data-backend-status]');
  if(!badge) return;
  badge.classList.toggle('connected', connected);
  badge.classList.toggle('offline', !connected);
  badge.textContent = connected ? 'Firebase متصل' : 'وضع محلي';
}
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];function money(v){return `${data.settings.currency} ${Number(v||0).toFixed(3)}`};function f(label,name,value='',type='text'){return `<label>${label}<input data-field="${name}" type="${type}" value="${String(value??'').replaceAll('"','&quot;')}"></label>`}function ta(label,name,value=''){return `<label class="full">${label}<textarea data-field="${name}">${value??''}</textarea></label>`}function cb(label,name,checked){return `<div class="switch-row"><div><p>${label}</p></div><button class="toggle ${checked?'on':''}" data-field="${name}" data-toggle-check></button></div>`}
const titles={overview:['الرئيسية','نظرة سريعة على الموقع.'],appearance:['الهوية والثيم','اللوجو والهيرو والفاف أيكون.'],sections:['الأقسام','إظهار وإخفاء أقسام الموقع.'],products:['المنتجات','إضافة وتعديل وحذف المنتجات.'],delivery:['التوصيل','طرق الاستلام والتوصيل.'],branches:['الفروع','الفروع ومواعيد العمل.'],media:['الصور','مكتبة الملفات والصور.'],export:['التصدير','تجهيز data.js للنشر.']};
function tab(t){$$('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));$$('[data-section-admin]').forEach(s=>s.classList.toggle('active',s.dataset.sectionAdmin===t));$('[data-page-title]').textContent=titles[t][0];$('[data-page-subtitle]').textContent=titles[t][1]}
document.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)tab(b.dataset.tab);const j=e.target.closest('[data-jump]');if(j)tab(j.dataset.jump);if(e.target.matches('[data-save]'))save();if(e.target.matches('[data-open-export]'))tab('export')});
function renderStats(){const stats=JSON.parse(localStorage.getItem(STATS_KEY)||'[]');$('[data-stats]').innerHTML=[['المنتجات',data.products.length],['المعروض',data.products.filter(p=>p.active).length],['الفروع',data.branches.length],['الأحداث',stats.length]].map(x=>`<article class="stat"><span>${x[0]}</span><strong>${x[1]}</strong><small>تجريبي</small></article>`).join('')}
function renderSettings(){const s=data.settings;$('[data-settings-form]').innerHTML=[f('اسم البراند','brandName',s.brandName),f('واتساب','whatsapp',s.whatsapp),f('الإيميل','email',s.email),f('العملة','currency',s.currency),f('شعار اللايت','logoLight',s.logoLight),f('شعار الدارك','logoDark',s.logoDark),f('شعار الفوتر','footerLogo',s.footerLogo),f('خلفية الهيرو','heroBg',s.heroBg),f('صورة الكيكة','heroCake',s.heroCake),f('Hero Eyebrow','heroEyebrow',s.heroEyebrow),f('Hero Title','heroTitle',s.heroTitle),f('Hero Highlight','heroHighlight',s.heroHighlight),f('نص التوصيل','deliveryText',s.deliveryText),ta('نص الهيرو','heroText',s.heroText)].join('')}
$('[data-save-settings]').onclick=()=>{$$('[data-settings-form] [data-field]').forEach(i=>data.settings[i.dataset.field]=i.value);save()}
function renderSections(){$('[data-sections-form]').innerHTML=Object.entries(data.sections).map(([k,v])=>cb(k,k,v)).join('');$$('[data-sections-form] [data-toggle-check]').forEach(b=>b.onclick=()=>{data.sections[b.dataset.field]=!data.sections[b.dataset.field];renderSections();save()})}
function blankProduct(){return{id:'',name:'',category:'birthday',price:0,rating:4.8,reviews:0,image:'assets/product-base.jpg',description:'',specs:[],featured:false,bestseller:false,active:true}}
function renderProductForm(p=blankProduct()){uploadedImage=null;$('[data-product-form]').innerHTML=[f('ID','id',p.id),f('الاسم','name',p.name),f('القسم','category',p.category),f('السعر','price',p.price,'number'),f('التقييم','rating',p.rating,'number'),f('Reviews','reviews',p.reviews,'number'),`<label class="full">الصورة<input data-field="image" value="${p.image||'assets/product-base.jpg'}"><span class="image-note">اكتب مسار assets أو رابط مباشر، أو اختر صورة للمعاينة.</span><div class="image-tools"><div class="file-input-wrap">📤 اختر صورة<input type="file" accept="image/*" data-image-file></div><button class="btn ghost" type="button" data-clear-image>مسح</button></div></label>`,ta('الوصف','description',p.description),ta('المواصفات بفواصل','specs',(p.specs||[]).join(', ')),cb('Featured','featured',p.featured),cb('Bestseller','bestseller',p.bestseller),cb('Active','active',p.active)].join('');$$('[data-product-form] input,[data-product-form] textarea').forEach(i=>i.oninput=previewProduct);$$('[data-product-form] [data-toggle-check]').forEach(b=>b.onclick=()=>{b.classList.toggle('on')});$('[data-image-file]').onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{uploadedImage=r.result;$('[data-field=image]').value=file.name;previewProduct()};r.readAsDataURL(file)};$('[data-clear-image]').onclick=()=>{uploadedImage=null;$('[data-field=image]').value='assets/product-base.jpg';previewProduct()};previewProduct()}
function readProduct(){const root=$('[data-product-form]'),p={};$$('[data-field]',root).forEach(i=>{if(i.closest('.switch-row'))return;p[i.dataset.field]=i.value});p.price=Number(p.price||0);p.rating=Number(p.rating||0);p.reviews=Number(p.reviews||0);p.specs=String(p.specs||'').split(',').map(s=>s.trim()).filter(Boolean);p.image=uploadedImage||p.image;p.featured=$('[data-field=featured]',root).classList.contains('on');p.bestseller=$('[data-field=bestseller]',root).classList.contains('on');p.active=$('[data-field=active]',root).classList.contains('on');return p}
function previewProduct(){const p=readProduct();$('[data-preview-name]').textContent=p.name||'Product name';$('[data-preview-desc]').textContent=p.description||'Description';$('[data-preview-price]').textContent=money(p.price);$('[data-preview-image]').src=(p.image||'').startsWith('http')||(p.image||'').startsWith('data:')?p.image:p.image||'assets/product-base.jpg'}
function renderProductsTable(){$('[data-products-table]').innerHTML=data.products.map((p,i)=>`<tr><td><img src="${p.image}"></td><td>${p.name}</td><td>${p.category}</td><td>${money(p.price)}</td><td><span class="pill ${p.active?'on':'off'}">${p.active?'ظاهر':'مخفي'}</span></td><td><button class="btn ghost" data-edit-product="${i}">تعديل</button><button class="btn danger" data-delete-product="${i}">حذف</button></td></tr>`).join('');$('[data-overview-products]').innerHTML=data.products.slice(0,4).map((p,i)=>`<tr><td><img src="${p.image}"></td><td>${p.name}</td><td>${money(p.price)}</td><td><span class="pill ${p.active?'on':'off'}">${p.active?'ظاهر':'مخفي'}</span></td><td><button class="btn ghost" data-edit-product="${i}">تعديل</button></td></tr>`).join('')}
document.addEventListener('click',e=>{const edit=e.target.closest('[data-edit-product]');if(edit){editingProduct=Number(edit.dataset.editProduct);renderProductForm(data.products[editingProduct]);tab('products')}const del=e.target.closest('[data-delete-product]');if(del&&confirm('حذف المنتج؟')){data.products.splice(Number(del.dataset.deleteProduct),1);async function bootstrapAdmin(){
  try{
    if(window.ZMORD_BACKEND && window.ZMORD_BACKEND.isConfigured()){
      const remoteData = await window.ZMORD_BACKEND.getSiteData();
      if(remoteData){
        data = remoteData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }else{
        await window.ZMORD_BACKEND.saveSiteData(data);
      }
      setBackendStatus(true);
    }else{
      setBackendStatus(false);
    }
  }catch(err){
    console.warn('Backend unavailable:', err);
    setBackendStatus(false);
  }
  renderAll();
}
bootstrapAdmin();save()}})
$('[data-save-product]').onclick=()=>{const p=readProduct();if(!p.id)return alert('ID مطلوب');if(editingProduct===null)data.products.unshift(p);else data.products[editingProduct]=p;editingProduct=null;async function bootstrapAdmin(){
  try{
    if(window.ZMORD_BACKEND && window.ZMORD_BACKEND.isConfigured()){
      const remoteData = await window.ZMORD_BACKEND.getSiteData();
      if(remoteData){
        data = remoteData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }else{
        await window.ZMORD_BACKEND.saveSiteData(data);
      }
      setBackendStatus(true);
    }else{
      setBackendStatus(false);
    }
  }catch(err){
    console.warn('Backend unavailable:', err);
    setBackendStatus(false);
  }
  renderAll();
}
bootstrapAdmin();save()}
$('[data-delete-selected]').onclick=()=>{if(editingProduct===null)return alert('اختار منتج');if(confirm('حذف المنتج المحدد؟')){data.products.splice(editingProduct,1);editingProduct=null;async function bootstrapAdmin(){
  try{
    if(window.ZMORD_BACKEND && window.ZMORD_BACKEND.isConfigured()){
      const remoteData = await window.ZMORD_BACKEND.getSiteData();
      if(remoteData){
        data = remoteData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }else{
        await window.ZMORD_BACKEND.saveSiteData(data);
      }
      setBackendStatus(true);
    }else{
      setBackendStatus(false);
    }
  }catch(err){
    console.warn('Backend unavailable:', err);
    setBackendStatus(false);
  }
  renderAll();
}
bootstrapAdmin();save()}}
$('[data-clear-product]').onclick=()=>{editingProduct=null;renderProductForm()}
function renderDelivery(){$('[data-delivery-list]').innerHTML=data.deliveryMethods.map((d,i)=>`<article class="card"><h3>${d.name}</h3><p>${money(d.price)}</p><button class="toggle ${d.active?'on':''}" data-toggle-delivery="${i}"></button></article>`).join('');$$('[data-toggle-delivery]').forEach(b=>b.onclick=()=>{data.deliveryMethods[b.dataset.toggleDelivery].active=!data.deliveryMethods[b.dataset.toggleDelivery].active;renderDelivery();save()})}
function blankBranch(){return{id:'',name:'',area:'',address:'',phone:'',hours:'',mapUrl:'#',active:true}}
function renderBranchForm(b=blankBranch()){$('[data-branch-form]').innerHTML=[f('ID','id',b.id),f('الاسم','name',b.name),f('المنطقة','area',b.area),f('العنوان','address',b.address),f('الهاتف','phone',b.phone),f('المواعيد','hours',b.hours),f('الخريطة','mapUrl',b.mapUrl),cb('Active','active',b.active)].join('');$('[data-branch-form] [data-toggle-check]').onclick=e=>e.currentTarget.classList.toggle('on')}
function readBranch(){const b={};$$('[data-branch-form] [data-field]').forEach(i=>{if(i.closest('.switch-row'))return;b[i.dataset.field]=i.value});b.active=$('[data-branch-form] [data-field=active]').classList.contains('on');return b}
function renderBranches(){$('[data-branch-list]').innerHTML=data.branches.map((b,i)=>`<article class="branch-card"><h4>${b.name}</h4><p>${b.area} — ${b.hours}</p><button class="btn ghost" data-edit-branch="${i}">تعديل</button><button class="btn danger" data-delete-branch="${i}">حذف</button></article>`).join('')}
document.addEventListener('click',e=>{const eb=e.target.closest('[data-edit-branch]');if(eb){editingBranch=Number(eb.dataset.editBranch);renderBranchForm(data.branches[editingBranch])}const db=e.target.closest('[data-delete-branch]');if(db&&confirm('حذف الفرع؟')){data.branches.splice(Number(db.dataset.deleteBranch),1);async function bootstrapAdmin(){
  try{
    if(window.ZMORD_BACKEND && window.ZMORD_BACKEND.isConfigured()){
      const remoteData = await window.ZMORD_BACKEND.getSiteData();
      if(remoteData){
        data = remoteData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }else{
        await window.ZMORD_BACKEND.saveSiteData(data);
      }
      setBackendStatus(true);
    }else{
      setBackendStatus(false);
    }
  }catch(err){
    console.warn('Backend unavailable:', err);
    setBackendStatus(false);
  }
  renderAll();
}
bootstrapAdmin();save()}})
$('[data-save-branch]').onclick=()=>{const b=readBranch();if(!b.id)return alert('ID مطلوب');if(editingBranch===null)data.branches.push(b);else data.branches[editingBranch]=b;editingBranch=null;async function bootstrapAdmin(){
  try{
    if(window.ZMORD_BACKEND && window.ZMORD_BACKEND.isConfigured()){
      const remoteData = await window.ZMORD_BACKEND.getSiteData();
      if(remoteData){
        data = remoteData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }else{
        await window.ZMORD_BACKEND.saveSiteData(data);
      }
      setBackendStatus(true);
    }else{
      setBackendStatus(false);
    }
  }catch(err){
    console.warn('Backend unavailable:', err);
    setBackendStatus(false);
  }
  renderAll();
}
bootstrapAdmin();save()}
$('[data-clear-branch]').onclick=()=>{editingBranch=null;renderBranchForm()}
function renderMedia(){$('[data-media-grid]').innerHTML=['hero-bg.png','hero-cake.png','product-base.jpg','product-chocolate.jpg','product-chocolate-set.jpg','product-bow.jpg','product-pink-close.jpg','logo-light.png'].map(m=>`<div class="media-item"><img src="assets/${m}"><span>assets/${m}</span></div>`).join('')}
$('[data-export]').onclick=()=>{$('[data-export-box]').textContent='window.ZMORD_DEFAULT_DATA = '+JSON.stringify(data,null,2)+';'}
$('[data-reset]').onclick=()=>{if(confirm('إرجاع الافتراضي؟')){localStorage.removeItem(STORAGE_KEY);location.reload()}}
function renderAll(){setBackendStatus(false);renderStats();renderSettings();renderSections();renderProductForm();renderProductsTable();renderDelivery();renderBranchForm();renderBranches();renderMedia()}
async function bootstrapAdmin(){
  try{
    if(window.ZMORD_BACKEND && window.ZMORD_BACKEND.isConfigured()){
      const remoteData = await window.ZMORD_BACKEND.getSiteData();
      if(remoteData){
        data = remoteData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }else{
        await window.ZMORD_BACKEND.saveSiteData(data);
      }
      setBackendStatus(true);
    }else{
      setBackendStatus(false);
    }
  }catch(err){
    console.warn('Backend unavailable:', err);
    setBackendStatus(false);
  }
  renderAll();
}
bootstrapAdmin();
