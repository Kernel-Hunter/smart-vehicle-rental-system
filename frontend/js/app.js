const API_BASE = "";

function setAuthMessage(message, isError = false) {
  const el = document.getElementById("authMessage");
  if (!el) return;
  el.textContent = message;
  el.style.color = isError ? "#d93025" : "#1b5e20";
}

function saveToken(token) {
  localStorage.setItem("svrms_token", token);
}

function getToken() {
  return localStorage.getItem("svrms_token");
}

function updateAuthUI() {
  const isAuth = !!getToken();
  document.querySelectorAll(".auth-only").forEach(el => {
    el.style.display = isAuth ? "inline-block" : "none";
  });
  document.querySelectorAll(".guest-only").forEach(el => {
    el.style.display = isAuth ? "none" : "inline-block";
  });
}

async function register(event) {
  event.preventDefault();
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("registerRole").value;

  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, role })
    });

    const data = await response.json();
    if (!response.ok) {
      setAuthMessage(data.message || "Registration failed.", true);
      return;
    }

    saveToken(data.token);
    setAuthMessage("Account created. Redirecting...");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  } catch (err) {
    setAuthMessage("Network error. Try again.", true);
  }
}

async function login(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      setAuthMessage(data.message || "Invalid credentials.", true);
      return;
    }

    saveToken(data.token);
    setAuthMessage("Logged in. Redirecting...");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  } catch (err) {
    setAuthMessage("Network error. Try again.", true);
  }
}

function logout() {
  localStorage.removeItem("svrms_token");
  updateAuthUI();
}

document.addEventListener("DOMContentLoaded", updateAuthUI);
