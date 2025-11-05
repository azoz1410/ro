// Services Page JavaScript

let visitorsData = [];

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  loadVisitors();
  setupFormHandler();
  setDefaultDateTime();
});

// Set default date and time
function setDefaultDateTime() {
  const today = new Date();
  const dateInput = document.getElementById("visitDate");
  const timeInput = document.getElementById("visitTime");

  // Set today's date
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  dateInput.value = `${year}-${month}-${day}`;

  // Set current time
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  timeInput.value = `${hours}:${minutes}`;
}

// Setup form submission handler
function setupFormHandler() {
  const form = document.getElementById("visitorForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    generateVisitorPass();
  });
}

// Generate visitor pass
function generateVisitorPass() {
  const formData = {
    name: document.getElementById("visitorName").value,
    id: document.getElementById("visitorId").value,
    phone: document.getElementById("visitorPhone").value,
    date: document.getElementById("visitDate").value,
    time: document.getElementById("visitTime").value,
    duration: document.getElementById("duration").value,
    purpose: document.getElementById("purpose").value,
    passId: generatePassId(),
    timestamp: new Date().getTime(),
  };

  // Display the pass
  displayPass(formData);

  // Generate barcode
  generateBarcode(formData.passId);

  // Save to storage
  saveVisitor(formData);

  // Show pass display
  document.getElementById("passDisplay").style.display = "block";

  // Scroll to pass
  document.getElementById("passDisplay").scrollIntoView({ behavior: "smooth" });
}

// Display pass information
function displayPass(data) {
  document.getElementById("passId").textContent = data.passId;
  document.getElementById("displayName").textContent = data.name;
  document.getElementById("displayId").textContent = data.id;
  document.getElementById("displayPhone").textContent = data.phone;
  document.getElementById("displayDate").textContent = formatDate(data.date);
  document.getElementById("displayTime").textContent = data.time;
  document.getElementById("displayDuration").textContent = getDurationText(
    data.duration
  );
}

// Generate barcode using JsBarcode library
function generateBarcode(passId) {
  const canvas = document.getElementById("barcodeCanvas");
  const text = document.getElementById("barcodeText");

  try {
    JsBarcode(canvas, passId, {
      format: "CODE128",
      width: 2,
      height: 100,
      displayValue: false,
      background: "#ffffff",
      lineColor: "#000000",
    });
    text.textContent = `*${passId}*`;
  } catch (e) {
    console.error("Barcode generation failed:", e);
    text.textContent = passId;
  }
}

// Generate unique pass ID
function generatePassId() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `VP${timestamp}${random}`;
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Get duration text
function getDurationText(duration) {
  if (duration === "full-day") return "Full Day";
  return `${duration} hour${duration > 1 ? "s" : ""}`;
}

// Save visitor to localStorage
function saveVisitor(data) {
  visitorsData.unshift(data);
  localStorage.setItem("visitors", JSON.stringify(visitorsData));
  displayRecentVisitors();
}

// Load visitors from localStorage
function loadVisitors() {
  const stored = localStorage.getItem("visitors");
  if (stored) {
    visitorsData = JSON.parse(stored);
    displayRecentVisitors();
  }
}

// Display recent visitors
function displayRecentVisitors() {
  const container = document.getElementById("visitorsList");

  if (visitorsData.length === 0) {
    container.innerHTML = '<p class="no-visitors">No recent visitors</p>';
    return;
  }

  container.innerHTML = visitorsData
    .slice(0, 10)
    .map((visitor) => {
      const isActive = isVisitActive(visitor);
      return `
            <div class="visitor-item">
                <div class="visitor-item-info">
                    <h4>${visitor.name}</h4>
                    <p>${formatDate(visitor.date)} at ${visitor.time}</p>
                </div>
                <span class="visitor-item-status ${
                  isActive ? "status-active" : "status-expired"
                }">
                    ${isActive ? "Active" : "Expired"}
                </span>
            </div>
        `;
    })
    .join("");
}

// Check if visit is still active
function isVisitActive(visitor) {
  const visitDateTime = new Date(`${visitor.date} ${visitor.time}`);
  const durationHours =
    visitor.duration === "full-day" ? 24 : parseInt(visitor.duration);
  const expiryTime = visitDateTime.getTime() + durationHours * 60 * 60 * 1000;
  return Date.now() < expiryTime;
}

// Print pass
function printPass() {
  window.print();
}

// Download pass as image
function downloadPass() {
  const passCard = document.querySelector(".pass-card");

  // Use html2canvas if available, otherwise alert
  if (typeof html2canvas !== "undefined") {
    html2canvas(passCard).then((canvas) => {
      const link = document.createElement("a");
      link.download = `visitor-pass-${
        document.getElementById("passId").textContent
      }.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  } else {
    alert(
      "Download feature requires html2canvas library. You can use the Print function instead."
    );
    printPass();
  }
}

// Share pass
function sharePass() {
  const passId = document.getElementById("passId").textContent;
  const visitorName = document.getElementById("displayName").textContent;
  const visitDate = document.getElementById("displayDate").textContent;

  const shareText = `Visitor Pass: ${passId}\nVisitor: ${visitorName}\nDate: ${visitDate}`;

  if (navigator.share) {
    navigator
      .share({
        title: "Visitor Pass",
        text: shareText,
      })
      .catch((err) => console.log("Share failed:", err));
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        alert("Pass details copied to clipboard!");
      })
      .catch(() => {
        alert("Unable to share. Please use Print or Download instead.");
      });
  }
}

// Create new visitor (reset form)
function newVisitor() {
  document.getElementById("visitorForm").reset();
  document.getElementById("passDisplay").style.display = "none";
  setDefaultDateTime();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Print styles
const style = document.createElement("style");
style.textContent = `
    @media print {
        body * {
            visibility: hidden;
        }
        .pass-card, .pass-card * {
            visibility: visible;
        }
        .pass-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            border: 2px solid #000 !important;
        }
        .pass-actions {
            display: none !important;
        }
        .services-header,
        .visitor-section,
        .recent-visitors {
            display: none !important;
        }
    }
`;
document.head.appendChild(style);
