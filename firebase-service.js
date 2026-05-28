/*
  ZMORD Backend Service
  Works on static hosting like GitHub Pages using Firebase client SDK.
  Falls back to localStorage if Firebase config is not filled yet.
*/
(function(){
  const FIREBASE_APPS = [
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js",
    "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js"
  ];

  function isFirebaseConfigured(){
    const c = window.ZMORD_FIREBASE_CONFIG || {};
    return c.apiKey && !String(c.apiKey).includes("PASTE_") &&
           c.projectId && !String(c.projectId).includes("PASTE_");
  }

  function isCloudinaryConfigured(){
    const c = window.ZMORD_CLOUDINARY_CONFIG || {};
    return c.cloudName && !String(c.cloudName).includes("PASTE_") &&
           c.uploadPreset && !String(c.uploadPreset).includes("PASTE_");
  }

  function loadScript(src){
    return new Promise((resolve, reject)=>{
      if ([...document.scripts].some(s=>s.src===src)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function loadFirebase(){
    for (const src of FIREBASE_APPS) await loadScript(src);
  }

  const service = {
    app: null,
    db: null,
    auth: null,
    ready: false,

    isConfigured: isFirebaseConfigured,

    async init(){
      if (this.ready) return true;
      if (!isFirebaseConfigured()) return false;

      await loadFirebase();

      if (!firebase.apps.length) {
        this.app = firebase.initializeApp(window.ZMORD_FIREBASE_CONFIG);
      } else {
        this.app = firebase.app();
      }

      this.db = firebase.firestore();
      this.auth = firebase.auth();
      this.ready = true;
      return true;
    },

    async getSiteData(){
      const ok = await this.init();
      if (!ok) return null;

      const doc = await this.db.collection("zmord").doc("publicSite").get();
      return doc.exists ? doc.data() : null;
    },

    async saveSiteData(data){
      const ok = await this.init();
      if (!ok) throw new Error("Firebase config is not set.");
      await this.db.collection("zmord").doc("publicSite").set(data, { merge: false });
      return true;
    },

    async login(email, password){
      const ok = await this.init();
      if (!ok) throw new Error("Firebase config is not set.");
      return this.auth.signInWithEmailAndPassword(email, password);
    },

    async logout(){
      const ok = await this.init();
      if (!ok) return;
      return this.auth.signOut();
    },

    async currentUser(){
      const ok = await this.init();
      if (!ok) return null;
      return new Promise(resolve=>{
        const unsub = this.auth.onAuthStateChanged(user=>{
          unsub();
          resolve(user);
        });
      });
    },

    async uploadImage(file){
      if (!isCloudinaryConfigured()) {
        throw new Error("Cloudinary config is not set.");
      }

      const c = window.ZMORD_CLOUDINARY_CONFIG;
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", c.uploadPreset);
      if (c.folder) form.append("folder", c.folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${c.cloudName}/image/upload`, {
        method: "POST",
        body: form
      });

      if (!res.ok) throw new Error("Cloudinary upload failed.");
      const json = await res.json();
      return json.secure_url;
    }
  };

  window.ZMORD_BACKEND = service;
})();
