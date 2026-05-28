ZMORD Full Site + Admin v2

Upload these files to the GitHub repository root:
- index.html
- products.html
- admin.html
- styles.css
- script.js
- admin.js
- data.js

Expected assets folder:
assets/logo-light.png
assets/logo-dark.png
assets/logo-clean-white.png
assets/favicon.ico
assets/favicon.png
assets/apple-touch-icon.png
assets/hero-bg.png
assets/hero-cake.png
assets/product-base.jpg
assets/product-chocolate.jpg
assets/product-chocolate-set.jpg
assets/product-bow.jpg
assets/product-pink-close.jpg

Open admin:
https://altaqawy.github.io/zmord/admin.html

Important:
This is a static GitHub Pages version. Admin changes are saved in the browser localStorage.
For production global admin, connect it to Supabase/Firebase/backend later.


Backend Free Start
==================
This version includes optional Firebase + Cloudinary integration.

New files:
- firebase-config.js
- firebase-service.js
- FIREBASE_RULES.txt
- CLOUDINARY_SETUP.txt

How it works:
- If Firebase config is empty, the site works locally with localStorage.
- If Firebase config is filled, public pages read data from Firestore.
- Admin saves data to Firestore.
- Cloudinary can be used for image uploads after filling config.

Copyright:
© 2026 Rawnak. Designed & Developed by Rawnak.
