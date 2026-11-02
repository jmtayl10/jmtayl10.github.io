import { 
  auth, db, showMessage, setBusy 
} from "./firebase-config.js";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

export function loadStarLog() {
  const loading = document.getElementById("loading"); 
  if (loading) loading.hidden = false;

  return auth.authStateReady()                      
    .then(() => getDocs(collection(db, "starLog")))
    .then((snapshot) => {
      const categories = snapshot.docs.map((d) => d.data());
      categories.sort((a, b) => a.order - b.order);  
      return { categories: categories };
    })
    .finally(() => {
      if (loading) loading.hidden = true;
    });
}

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector("button");
    const msg = document.getElementById("contact-message");
    const formData = Object.fromEntries(new FormData(contactForm));

    setBusy(btn, true);
    addDoc(collection(db, "contacts"), { ...formData, uid: auth.currentUser.uid })
      .then(() => {
        contactForm.reset();
        showMessage(msg, "Thanks! Your message was saved.", false);
      })
      .catch((error) => showMessage(msg, error.message, true))
      .finally(() => setBusy(btn, false));
  });
}

const seedForm = document.getElementById("seed-form");
if (seedForm) {
  seedForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = seedForm.querySelector("button");
    const msg = document.getElementById("seed-message");
    const file = document.getElementById("json-file").files[0];

    setBusy(btn, true);
    file.text()
      .then((text) => {
        const categories = JSON.parse(text).categories;
        const uploads = categories.map((category, i) =>
          setDoc(doc(db, "starLog", category.id), { ...category, order: i })
        );
        return Promise.all(uploads);
      })
      .then(() => showMessage(msg, "Upload done! Check Firestore in the console.", false))
      .catch((error) => showMessage(msg, error.message, true))
      .finally(() => setBusy(btn, false));
  });
}