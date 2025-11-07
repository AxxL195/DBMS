// Fetch and display all blood requests
document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("requestsTableBody");

  try {
    const res = await fetch("http://localhost:5000/api/bloodrequests");
    const data = await res.json();

    tableBody.innerHTML = ""; // Clear "Loading..." row

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-muted">No blood requests found.</td></tr>`;
      return;
    }

    data.forEach(req => {
      const row = `
        <tr>
          <td>${req.hospital_name || "Unknown"}</td>
          <td>${req.blood_group_required}</td>
          <td>${req.quantity_units}</td>
          <td>${req.city || "N/A"}</td>
          <td>${req.is_urgent ? "⚠️ Urgent" : "Normal"}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error("Error fetching requests:", err);
    tableBody.innerHTML = `<tr><td colspan="5" class="text-danger">Failed to load data.</td></tr>`;
  }
});

// Handle Back button
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "donor_dashboard.html";
});
