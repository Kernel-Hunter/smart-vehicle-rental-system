const API_URL = "https://smart-vehicle-rental-system.onrender.com/api";
let token = localStorage.getItem("token");

async function register(e) {
  e.preventDefault();
  const data = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("registerEmail").value,
    password: document.getElementById("registerPassword").value
  };

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  localStorage.setItem("token", result.token);
  window.location.href = "dashboard.html";
}

async function login(e) {
  e.preventDefault();
  const data = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  };

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  localStorage.setItem("token", result.token);
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("token");
}

async function loadVehicles() {
  if (!document.getElementById("vehiclesTable")) return;

  const res = await fetch(`${API_URL}/vehicles`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  const tbody = document.querySelector("#vehiclesTable tbody");

  data.forEach(v => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${v.id}</td>
      <td>${v.type || v['@type'] || "N/A"}</td>
      <td>${v.make}</td>
      <td>${v.model}</td>
      <td>${v.dailyRate}</td>
      <td>${v.available}</td>
    `;
    tbody.appendChild(row);
  });
}

async function loadRentals() {
  if (!document.getElementById("instantRentals")) return;

  const instantRes = await fetch(`${API_URL}/rentals/instant`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const contractRes = await fetch(`${API_URL}/rentals/contract`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const inst = await instantRes.json();
  const cont = await contractRes.json();

  inst.forEach(r => {
    document.getElementById("instantRentals").innerHTML += `<li>Rental #${r.id} - ${r.pickupLocation}</li>`;
  });

  cont.forEach(r => {
    document.getElementById("contractRentals").innerHTML += `<li>Contract #${r.id} - ${r.contractDetails}</li>`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadVehicles();
  loadRentals();
});
