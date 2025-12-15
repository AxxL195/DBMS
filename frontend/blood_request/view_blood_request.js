document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("requestsTableBody");
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5001/api/v1/bloodrequest/all", {
      headers: {
        Authorization: `Bearer ${token}`
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

    data.forEach(req => {
      const urgencyBadge = req.is_urgent
        ? `<span class="badge bg-danger">Urgent</span>`
        : `<span class="badge bg-secondary">Normal</span>`;

      const statusBadge = req.is_fulfilled
        ? `<span class="badge bg-success">Fulfilled</span>`
        : `<span class="badge bg-warning text-dark">Pending</span>`;

      const row = `
        <tr>
          <td>${req.blood_group_required}</td>
          <td>${req.quantity_units}</td>
          <td>${urgencyBadge}</td>
          <td>${statusBadge}</td>
          <td>${new Date(req.request_date).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary action-btn edit-btn" data-id="${req.request_id}" data-bs-toggle="modal" data-bs-target="#editModal">✏️ Edit</button>
            <button class="btn btn-sm btn-outline-danger action-btn delete-btn" data-id="${req.request_id}">🗑️ Delete</button>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

    // Edit button click
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const row = e.target.closest("tr");
        document.getElementById("editRequestId").value = id;
        document.getElementById("editUnits").value = row.children[1].textContent.trim();
        document.getElementById("editUrgency").value = row.children[2].textContent.includes("Urgent");
      });
    });

    // Handle edit form submission
    document.getElementById("editForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("editRequestId").value;
      const quantity_units = document.getElementById("editUnits").value;
      const is_urgent = document.getElementById("editUrgency").value === "true";

      try {
        const res = await fetch(`http://localhost:5001/api/v1/bloodrequest/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity_units, is_urgent }),
        });

        const result = await res.json();

        if (!res.ok) {
          alert(result.message || "Update failed.");
          return;
        }

        alert("✅ Blood request updated successfully!");
        location.reload();
      } catch (err) {
        console.error("Error updating request:", err);
      }
    });

    // Delete button click
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!confirm("Are you sure you want to delete this blood request?")) return;

        try {
          const res = await fetch(`http://localhost:5001/api/v1/bloodrequest/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          const result = await res.json();

          if (!res.ok) {
            alert(result.message || "Delete failed.");
            return;
          }

          alert("🗑️ Blood request deleted successfully!");
          e.target.closest("tr").remove();
        } catch (err) {
          console.error("Error deleting request:", err);
        }
      });
    });

  } catch (err) {
    console.error("Error fetching requests:", err);
    tableBody.innerHTML = `<tr><td colspan="6" class="text-danger">Failed to load data.</td></tr>`;
  }
});

// Handle back button
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "../hospital_dashboard/hospital_dashboard.html";
});
