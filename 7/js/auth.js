import { 
  auth, showMessage, setBusy 
} from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const isLocked = document.documentElement.dataset.access === "locked";
const isLoginPage = document.getElementById("login-form") !== null;

onAuthStateChanged(auth, (user) => {
  if (!user && isLocked) {
    window.location.replace("login.html");  
    return;
  }
  if (user && isLoginPage) {
    window.location.replace("index.html");   
    return;
  }
  document.documentElement.classList.add(user ? "logged-in" : "logged-out");
});

document.querySelectorAll("[data-logout]").forEach((btn) => {
  btn.addEventListener("click", () => {
    signOut(auth).then(() => window.location.replace("index.html"));
  });
});

const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const btn = signupForm.querySelector("button");
    const msg = document.getElementById("signup-message");

    setBusy(btn, true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => showMessage(msg, "Account created!", false))
      .catch((error) => showMessage(msg, error.message, true))
      .finally(() => setBusy(btn, false));
  });
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const btn = loginForm.querySelector("button");
    const msg = document.getElementById("login-message");

    setBusy(btn, true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => showMessage(msg, "Logged in!", false))
      .catch((error) => showMessage(msg, error.message, true))
      .finally(() => setBusy(btn, false));
  });
}

const passwordForm = document.getElementById("password-form");
if (passwordForm) {
  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const btn = passwordForm.querySelector("button");
    const msg = document.getElementById("password-message");
    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    setBusy(btn, true);
    reauthenticateWithCredential(user, credential)
      .then(() => updatePassword(user, newPassword))
      .then(() => {
        passwordForm.reset();
        showMessage(msg, "Password changed!", false);
      })
      .catch((error) => showMessage(msg, error.message, true))
      .finally(() => setBusy(btn, false));
  });
}