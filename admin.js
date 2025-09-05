// ========================
// Admin Dashboard Script
// ========================

// Load Stats
function loadStats() {
  let scans = JSON.parse(localStorage.getItem("scanLogs")) || [];
  let total = scans.length;
  let genuine = scans.filter(s => s.status === "Genuine").length;
  let fake = scans.filter(s => s.status === "Fake").length;

  document.getElementById("totalScans").textContent = total;
  document.getElementById("genuineCount").textContent = genuine;
  document.getElementById("fakeCount").textContent = fake;

  renderLogs(scans);
}

// Render Logs into Table
function renderLogs(scans) {
  const tbody = document.getElementById("scanLogs");
  tbody.innerHTML = "";

  if (scans.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">No scans yet.</td></tr>`;
    return;
  }

  scans.slice(-10).reverse().forEach(log => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${log.file}</td>
      <td>${log.status}</td>
      <td>${log.user || "Unknown"}</td>
      <td>${log.time}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Export Logs as CSV
function exportLogs() {
  let logs = JSON.parse(localStorage.getItem("scanLogs")) || [];
  if (!logs.length) return alert("No logs available to export.");

  let csvContent = "data:text/csv;charset=utf-8,File,Status,User,Time\n" +
    logs.map(l => `${l.file},${l.status},${l.user || "Unknown"},${l.time}`).join("\n");

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "scan_logs.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// User Management
document.getElementById("addUserForm").addEventListener("submit", function(e){
  e.preventDefault();
  const username = document.getElementById("username").value;
  const userEmail = document.getElementById("userEmail").value;
  const li = document.createElement("li");
  li.textContent = `${username} (${userEmail})`;
  document.getElementById("userList").appendChild(li);
  this.reset();
});

// Bulk Upload
document.getElementById("bulkUploadForm").addEventListener("submit", function(e){
  e.preventDefault();
  const files = document.getElementById("bulkFiles").files;
  if (files.length === 0) return alert("Please select at least one file.");
  alert(files.length + " files uploaded & scanning started...");
});

// Reset Dashboard
document.getElementById("resetDashboard").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all dashboard stats?")) {
    localStorage.removeItem("scanLogs");
    loadStats();
    alert("Dashboard reset successfully!");
  }
});

// Initialize
window.onload = loadStats;
