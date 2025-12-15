// frontend/donor/donor_appointments.js
// Changes: a) fetch from /api/v1/appointment/donor, b) show action button when hospital_confirmed, c) call /donor-confirm/:id

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const tableBody = document.getElementById("appointmentTableBody");

  try {
    const res = await fetch("http://localhost:5001/api/v1/appointment/donor", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-danger">${data.message || "Failed to load appointments."}</td></tr>`;
      return;
    }

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-muted">No appointments found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";
    data.forEach(app => {
      // show a Confirm Donation button only if hospital already confirmed
      const actionBtn = app.status === "hospital_confirmed"
        ? `<button class="btn btn-sm btn-success confirm-donation" data-id="${app.appointment_id}">Confirm Donation</button>`
        : "";

      const statusBadge = {
        scheduled: `<span class="badge bg-warning text-dark">Scheduled</span>`,
        hospital_confirmed: `<span class="badge bg-primary">Confirmed by hospital</span>`,
        donor_confirmed: `<span class="badge bg-success">Donation confirmed</span>`,
        cancelled: `<span class="badge bg-secondary">Cancelled</span>`
      }[app.status] || app.status;

      const row = `
        <tr>
          <td>${app.hospital_name || "Unknown"}</td>
          <td>${new Date(app.appointment_date).toLocaleDateString()}</td>
          <td>${app.appointment_time}</td>
          <td>${statusBadge}</td>
          <td>${app.reason || "N/A"}</td>
          <td>${actionBtn}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

    document.querySelectorAll(".confirm-donation").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!confirm("Confirm that you completed this donation?")) return;
        await confirmDonation(id);
      });
    });

  } catch (err) {
    console.error("Error fetching appointments:", err);
    tableBody.innerHTML = `<tr><td colspan="5" class="text-danger">Server error.</td></tr>`;
  }

  async function confirmDonation(id) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5001/api/v1/appointment/donor-confirm/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const resultText = await res.text();
      let result;
      try { result = JSON.parse(resultText); } catch (_) { result = { message: resultText }; }

      if (res.ok) {
        alert("✅ Donation confirmed — emails sent.");
        location.reload();
      } else {
        alert(result.message || "Error confirming donation");
      }
    } catch (err) {
      console.error("Error confirming donation:", err);
      alert("Server error while confirming donation.");
    }
  }
});

// back button (if present)
const back = document.getElementById("backBtn");
if (back) back.addEventListener("click", () => window.location.href = "donor_dashboard.html");
