// SISTEM PEER CHECKING FRP JPA
// Unit Kualiti Safe Version
//
// No code editing needed after Apps Script deployment:
// Open GitHub Pages link with:
// ?endpoint=PASTE_APPS_SCRIPT_WEB_APP_URL
//
// Example:
// https://yourname.github.io/frp-peer-checking/?endpoint=https%3A%2F%2Fscript.google.com%2Fmacros%2Fs%2FAKfycbxxx%2Fexec

const DEFAULT_WEB_APP_URL = "";

const form = document.getElementById("peerCheckingForm");
const statusFRP = document.getElementById("statusFRP");
const statusPreview = document.getElementById("statusPreview");
const autoSuggestion = document.getElementById("autoSuggestion");
const submitBtn = document.getElementById("submitBtn");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
const saveDraftBtn = document.getElementById("saveDraftBtn");
const clearDraftBtn = document.getElementById("clearDraftBtn");
const connectionStatus = document.getElementById("connectionStatus");

const checklistFields = [
  "folderDisediakan",
  "jadualWaktu",
  "borangSemakanFRP",
  "dokumenKetidakhadiran",
  "sampelItemPB",
  "aksesBukti",
  "susunanDokumen",
  "namaFailJelas",
  "buktiMencukupi",
  "pembetulanDiperlukan"
];

const today = new Date();
document.getElementById("tarikhSemakan").valueAsDate = today;
document.getElementById("todayDate").textContent = today.toLocaleDateString("ms-MY", {
  day: "2-digit",
  month: "2-digit"
});

initEndpointFromUrl();
updateConnectionStatus();

document.addEventListener("change", function () {
  updateDashboard();
  updateAutoSuggestion();
});

document.addEventListener("input", function () {
  autoSaveDraft();
});

statusFRP.addEventListener("change", updateStatusPreview);

saveDraftBtn.addEventListener("click", function () {
  saveDraft();
  alert("Draf berjaya disimpan dalam browser ini.");
});

clearDraftBtn.addEventListener("click", function () {
  if (confirm("Padam draf yang disimpan dalam browser ini?")) {
    localStorage.removeItem("frpPeerCheckingDraft");
    form.reset();
    document.getElementById("tarikhSemakan").valueAsDate = new Date();
    updateDashboard();
    updateAutoSuggestion();
    updateStatusPreview();
    alert("Draf telah dipadam.");
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  successMessage.style.display = "none";
  errorMessage.style.display = "none";

  const data = getFormData();
  const webAppUrl = getWebAppUrl();

  if (!webAppUrl) {
    showEndpointError();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sedang Menghantar...";

  fetch(webAppUrl, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data)
  })
    .then(function () {
      onSubmitSuccess(data);
    })
    .catch(function () {
      onSubmitFail();
    });
});

function initEndpointFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const endpoint = params.get("endpoint") || params.get("webAppUrl");

  if (endpoint && endpoint.startsWith("https://script.google.com/macros/s/")) {
    localStorage.setItem("frpPeerCheckingWebAppUrl", endpoint);
  }
}

function getWebAppUrl() {
  return DEFAULT_WEB_APP_URL || localStorage.getItem("frpPeerCheckingWebAppUrl") || "";
}

function updateConnectionStatus() {
  const webAppUrl = getWebAppUrl();

  if (webAppUrl) {
    connectionStatus.textContent = "Connected to Google Sheet";
    connectionStatus.classList.add("connected");
    connectionStatus.classList.remove("not-connected");
  } else {
    connectionStatus.textContent = "Not connected: open with ?endpoint=APPS_SCRIPT_WEB_APP_URL";
    connectionStatus.classList.add("not-connected");
    connectionStatus.classList.remove("connected");
  }
}

function showEndpointError() {
  errorMessage.innerHTML =
    "<strong>Sistem belum disambungkan kepada Apps Script Web App.</strong><br><br>" +
    "Sila buka link rasmi yang mengandungi parameter endpoint, contoh:<br>" +
    "<code>?endpoint=https://script.google.com/macros/s/AKfycbxxx/exec</code><br><br>" +
    "Selepas endpoint disimpan, borang boleh dihantar ke Google Sheet Unit Kualiti.";
  errorMessage.style.display = "block";
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function getFormData() {
  const formData = new FormData(form);
  const data = {};

  formData.forEach(function (value, key) {
    data[key] = value;
  });

  data.autoSuggestedStatus = getSuggestedStatus();
  data.issueCount = getIssueCount();
  data.answeredChecklist = getAnsweredCount();
  data.source = "GitHub Pages";
  data.userAgent = navigator.userAgent;
  data.submittedAtClient = new Date().toISOString();

  return data;
}

function onSubmitSuccess(data) {
  showReceipt(data);
  localStorage.removeItem("frpPeerCheckingDraft");
  submitBtn.disabled = false;
  submitBtn.textContent = "Hantar Semakan";
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function onSubmitFail() {
  errorMessage.style.display = "block";
  submitBtn.disabled = false;
  submitBtn.textContent = "Hantar Semakan";
}

function showReceipt(data) {
  successMessage.innerHTML =
    '<div class="receipt-title">Semakan FRP berjaya dihantar.</div>' +
    "<strong>Nama Pemilik FRP:</strong> " + escapeHtml(data.namaPemilik || "-") + "<br>" +
    "<strong>Nama Penyemak:</strong> " + escapeHtml(data.namaPenyemak || "-") + "<br>" +
    "<strong>Tarikh Semakan:</strong> " + escapeHtml(data.tarikhSemakan || "-") + "<br>" +
    "<strong>Status FRP Pegawai:</strong> " + escapeHtml(data.statusFRP || "-") + "<br>" +
    "<strong>Cadangan Sistem:</strong> " + escapeHtml(data.autoSuggestedStatus || "-") + "<br>" +
    "<strong>Isu Dikesan:</strong> " + escapeHtml(data.issueCount || "0") + "<br><br>" +
    "Rekod ini telah dihantar untuk pemantauan Unit Kualiti JPA.";

  successMessage.style.display = "block";
}

function updateDashboard() {
  const answered = getAnsweredCount();
  const total = checklistFields.length;
  const percent = Math.round((answered / total) * 100);

  document.getElementById("answeredCount").textContent = answered + "/" + total;
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("issueCount").textContent = getIssueCount();

  const suggested = getSuggestedStatus();
  document.getElementById("suggestedBadge").textContent = suggested || "-";
}

function getAnsweredCount() {
  return checklistFields.filter(function (name) {
    return document.querySelector('input[name="' + name + '"]:checked');
  }).length;
}

function getIssueCount() {
  let issues = 0;

  checklistFields.forEach(function (name) {
    const checked = document.querySelector('input[name="' + name + '"]:checked');
    if (!checked) return;

    if (name === "pembetulanDiperlukan" && checked.value === "Ya") {
      issues++;
      return;
    }

    if (checked.value === "Tidak") {
      issues++;
    }
  });

  return issues;
}

function getSuggestedStatus() {
  const answered = getAnsweredCount();
  const total = checklistFields.length;
  const issues = getIssueCount();

  if (answered < total) return "Belum Lengkap";
  if (issues === 0) return "Lengkap";
  if (issues >= 4) return "Tidak Lengkap";
  return "Perlu Tindakan";
}

function updateAutoSuggestion() {
  const suggested = getSuggestedStatus();
  const issues = getIssueCount();

  if (!suggested) {
    autoSuggestion.style.display = "none";
    return;
  }

  autoSuggestion.style.display = "block";
  autoSuggestion.textContent =
    "Cadangan sistem: " + suggested +
    ". Jumlah isu dikesan: " + issues +
    ". Penyemak masih boleh memilih status akhir pada Bahagian D.";
}

function updateStatusPreview() {
  const value = statusFRP.value;

  statusPreview.className = "status-box";
  statusPreview.textContent = "";

  if (value === "Lengkap") {
    statusPreview.textContent = "Status: Lengkap — FRP pegawai telah disemak dan memenuhi keperluan.";
    statusPreview.classList.add("status-lengkap");
  }

  if (value === "Perlu Tindakan") {
    statusPreview.textContent = "Status: Perlu Tindakan — Pegawai perlu membuat penambahbaikan berdasarkan ulasan penyemak.";
    statusPreview.classList.add("status-tindakan");
  }

  if (value === "Tidak Lengkap") {
    statusPreview.textContent = "Status: Tidak Lengkap — Terdapat dokumen atau maklumat penting yang belum mencukupi.";
    statusPreview.classList.add("status-tidak");
  }
}

function saveDraft() {
  localStorage.setItem("frpPeerCheckingDraft", JSON.stringify(getFormData()));
}

function autoSaveDraft() {
  clearTimeout(window.__draftTimer);
  window.__draftTimer = setTimeout(saveDraft, 600);
}

function loadDraft() {
  const raw = localStorage.getItem("frpPeerCheckingDraft");
  if (!raw) return;

  try {
    const data = JSON.parse(raw);

    Object.keys(data).forEach(function (key) {
      const field = form.elements[key];
      if (!field) return;

      if (field instanceof RadioNodeList) {
        Array.from(field).forEach(function (radio) {
          radio.checked = radio.value === data[key];
        });
      } else if (field.type === "checkbox") {
        field.checked = data[key] === field.value;
      } else {
        field.value = data[key];
      }
    });

    updateDashboard();
    updateAutoSuggestion();
    updateStatusPreview();
  } catch (error) {
    console.warn("Draft could not be loaded:", error);
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadDraft();
updateDashboard();
updateAutoSuggestion();
updateStatusPreview();
