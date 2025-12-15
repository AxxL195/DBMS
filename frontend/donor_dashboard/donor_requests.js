// donor_requests.js

document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("requestsTableBody");

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5001/api/v1/bloodrequest/allForDonor", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    tableBody.innerHTML = "";

    if (!res.ok) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-danger">${data.message || "Error fetching requests."}</td></tr>`;
      return;
    }

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-muted">No blood requests found.</td></tr>`;
      return;
    }

    // Fill table
    data.forEach(req => {
      const urgencyBadge = req.is_urgent
        ? `<span class="badge bg-danger">Urgent</span>`
        : `<span class="badge bg-secondary">Normal</span>`;

      const row = `
        <tr>
          <td>${req.hospital_name || "Unknown"}</td>
          <td><strong>${req.blood_group_required}</strong></td>
          <td>${req.quantity_units}</td>
          <td>${req.city || "N/A"}</td>
          <td>${urgencyBadge}</td>
          <td>
            <button class="btn btn-outline-danger btn-sm donate-btn" 
                    data-request-id="${req.request_id}"
                    data-hospital="${req.hospital_name}">
              Donate
            </button>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

    // Handle donate clicks
    document.querySelectorAll(".donate-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const requestId = e.target.dataset.requestId;
        const hospitalName = e.target.dataset.hospital;

        // Open modal to select date/time
        openAppointmentModal(requestId, hospitalName);
      });
    });

  } catch (err) {
    console.error("Error fetching requests:", err);
    tableBody.innerHTML = `<tr><td colspan="6" class="text-danger">Failed to load data.</td></tr>`;
  }
});

// Function to open modal
function openAppointmentModal(requestId, hospitalName) {
  const modalHtml = `
    <div class="modal fade" id="appointmentModal" tabindex="-1" aria-labelledby="appointmentModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="appointmentModalLabel">Schedule Donation for ${hospitalName}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="appointmentForm">
              <div class="mb-3">
                <label for="appointmentDate" class="form-label">Select Date</label>
                <input type="date" class="form-control" id="appointmentDate" required>
              </div>
              <div class="mb-3">
                <label for="appointmentTime" class="form-label">Select Time</label>
                <input type="time" class="form-control" id="appointmentTime" required>
              </div>
              <button type="submit" class="btn btn-danger w-100">Confirm Appointment</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remove any existing modal first
  const existingModal = document.getElementById("appointmentModal");
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modal = new bootstrap.Modal(document.getElementById("appointmentModal"));
  modal.show();

  // Handle form submit
  document.getElementById("appointmentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;

    if (!date || !time) {
      alert("Please select both date and time!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/v1/appointment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          blood_request_id: requestId,
          appointment_date: date,
          appointment_time: time
        })
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to create appointment.");
        return;
      }

      alert("✅ Appointment scheduled successfully!");
      modal.hide();
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("❌ Server error. Please try again later.");
    }
  });
}

// Back button
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "donor_dashboard.html";
});
