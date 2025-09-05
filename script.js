// -------------------------
// Scroll Progress Bar
// -------------------------
window.addEventListener("scroll", () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let scrollPercent = (scrollTop / scrollHeight) * 100;
  const bar = document.getElementById("progressBar");
  if (bar) bar.style.width = scrollPercent + "%";
});

// -------------------------
// Highlight Active Nav Link
// -------------------------
document.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// -------------------------
// Scan Form Handling
// -------------------------
const scanForm = document.getElementById("scanForm");

if (scanForm) {
  scanForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const certFile = document.getElementById("certFile").files[0];

    if (certFile) {
      window.location.href = `scan-result.html?file=${encodeURIComponent(certFile.name)}`;
    } else {
      alert("⚠️ Please upload a certificate file before scanning.");
    }
  });
}

// -------------------------
// Scan Result Page Handling
// -------------------------
const resultBox = document.getElementById("resultBox");
if (resultBox) {
  const params = new URLSearchParams(window.location.search);
  const fileName = params.get("file");

  if (fileName) {
    resultBox.innerHTML = "<p style='color:orange;'>⏳ Scanning... Please wait.</p>";

    setTimeout(() => {
      const loggedUser = "Admin123"; // Simulated
      const alreadyInDB = Math.random() > 0.5;
      const isFake = fileName.toLowerCase().includes("fake");

      const result = {
        file: fileName,
        user: loggedUser,
        status: isFake ? "Fake" : "Genuine",
        dbStatus: alreadyInDB ? "Already in Database" : "Not Found",
        time: new Date().toLocaleString()
      };

      if (isFake) {
        resultBox.innerHTML = `
          <h3>Certificate Report</h3>
          <p style="color:red; font-weight:bold;">❌ Fake Certificate Detected</p>
          <p><strong>File:</strong> ${result.file}</p>
          <p><strong>Scanned By:</strong> ${result.user}</p>
          <p><strong>Database Status:</strong> ${result.dbStatus}</p>
          <p><strong>Time:</strong> ${result.time}</p>
        `;
      } else {
        resultBox.innerHTML = `
          <h3>Certificate Report</h3>
          <p style="color:lime; font-weight:bold;">✅ Certificate is Genuine</p>
          <p><strong>File:</strong> ${result.file}</p>
          <p><strong>Scanned By:</strong> ${result.user}</p>
          <p><strong>Database Status:</strong> ${result.dbStatus}</p>
          <p><strong>Time:</strong> ${result.time}</p>
        `;
      }

      // Save to localStorage for admin dashboard
      let logs = JSON.parse(localStorage.getItem("scanLogs")) || [];
      logs.push(result);
      localStorage.setItem("scanLogs", JSON.stringify(logs));
    }, 2000);
  } else {
    resultBox.innerHTML = "<p style='color:orange;'>⚠️ No file uploaded.</p>";
  }
}

// -------------------------
// Admin Dashboard Page Handling
// -------------------------
const totalScansEl = document.getElementById("totalScans");
const genuineCountEl = document.getElementById("genuineCount");
const fakeCountEl = document.getElementById("fakeCount");
const scanLogsEl = document.getElementById("scanLogs");

if (totalScansEl && genuineCountEl && fakeCountEl && scanLogsEl) {
  let logs = JSON.parse(localStorage.getItem("scanLogs")) || [];

  totalScansEl.textContent = logs.length;
  genuineCountEl.textContent = logs.filter(l => l.status === "Genuine").length;
  fakeCountEl.textContent = logs.filter(l => l.status === "Fake").length;

  scanLogsEl.innerHTML = logs.length
    ? logs.slice(-5).map(l => `
        <li>
          <strong>${l.file}</strong> - ${l.status} <br>
          <small>By ${l.user}, ${l.time}</small>
        </li>
      `).join("")
    : "<li>No scans yet.</li>";
}
// -------------------------
// Reset Dashboard
// -------------------------
const resetBtn = document.getElementById("resetDashboard");

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    // Reset counts
    totalScans = 0;
    genuineCount = 0;
    fakeCount = 0;

    totalScansEl.textContent = totalScans;
    genuineCountEl.textContent = genuineCount;
    fakeCountEl.textContent = fakeCount;

    // Reset logs
    scanLogsEl.innerHTML = "<li>No scans yet.</li>";

    // Reset alert
    systemAlertEl.textContent = "✅ System Running Smoothly";
    systemAlertEl.style.color = "lime";

    alert("Dashboard has been reset ✅");
  });
}
