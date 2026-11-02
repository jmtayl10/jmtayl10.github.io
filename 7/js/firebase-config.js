import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import { 
  getAuth 
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { 
  getFirestore 
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBzmolLRQTBZ3uxLrjkLZT1_rVVrzY6RO0",
  authDomain: "dustystarlog.firebaseapp.com",
  projectId: "dustystarlog",
  storageBucket: "dustystarlog.firebasestorage.app",
  messagingSenderId: "893434272331",
  appId: "1:893434272331:web:472d0675648d1306b80bce"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export function showMessage(el, text, isError) {
  el.textContent = text;
  el.className = isError ? "message error" : "message success";
}

export function setBusy(button, busy) {
  if (busy) {
    button.dataset.label = button.textContent;
    button.textContent = "Working…";
    button.disabled = true;
  } else {
    button.textContent = button.dataset.label;
    button.disabled = false;
  }
}