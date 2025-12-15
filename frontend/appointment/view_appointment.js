// frontend/appointment/view_appointment.js
// Changes: a) Use /api/v1/appointment/hospital to fetch, b) call /status/:id with {action}, c) better error handling

document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("appointmentsTableBody");
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5001/api/v1/appointment/hospital", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    tableBody.innerHTML = "";

    if (!res.ok) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-danger">${data.message || "Error loading appointments."}</td></tr>`;
      return;
    }

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-muted">No appointments scheduled.</td></tr>`;
      return;
    }

    data.forEach(app => {
      const statusBadge = {
        scheduled: `<span class="badge bg-warning text-dark">Scheduled</span>`,
        hospital_confirmed: `<span class="badge bg-primary">Confirmed</span>`,
        donor_confirmed: `<span class="badge bg-success">Completed</span>`,
        cancelled: `<span class="badge bg-secondary">Cancelled</span>`
      }[app.status] || `<span class="badge bg-light text-dark">${app.status}</span>`;

      const row = `
        <tr>
          <td>${app.first_name} ${app.last_name || ""}</td>
          <td>${app.blood_group || ""}</td>
          <td>${new Date(app.appointment_date).toLocaleDateString()}</td>
          <td>${app.appointment_time}</td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary confirm-btn" data-id="${app.appointment_id}">✔️ Confirm</button>
            <button class="btn btn-sm btn-outline-danger cancel-btn" data-id="${app.appointment_id}">❌ Cancel</button>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

    // confirm appointment
    document.querySelectorAll(".confirm-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!confirm("Confirm this appointment?")) return;
        await updateStatus(id, "confirm");
      });
    });

    // cancel appointment
    document.querySelectorAll(".cancel-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!confirm("Cancel this appointment?")) return;
        await updateStatus(id, "cancel");
      });
    });

  } catch (err) {
    console.error("Error fetching appointments:", err);
    tableBody.innerHTML = `<tr><td colspan="6" class="text-danger">Failed to load data.</td></tr>`;
  }

  async function updateStatus(id, action) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5001/api/v1/appointment/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      const resultText = await res.text(); // parse text first to avoid JSON parse errors
      let result;
      try { result = JSON.parse(resultText); } catch(_) { result = { message: resultText }; }

      if (res.ok) {
        alert(`✅ Appointment updated: ${action === "confirm" ? "confirmed" : "cancelled"}`);
        location.reload();
      } else {
        alert(result.message || "Error updating status");
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Server error while updating appointment.");
    }
  }
});

// Back button handler (if present)
const back = document.getElementById("backBtn");
if (back) back.addEventListener("click", () => window.location.href = "../hospital_dashboard/hospital_dashboard.html");
