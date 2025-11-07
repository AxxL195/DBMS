document.addEventListener("DOMContentLoaded", async () => {
  const donorName = localStorage.getItem("donor_name") || "Donor";
  const tableBody = document.getElementById("donationHistoryBody");

  try {
    // Example API call (update URL to your backend route)
    const response = await fetch("http://localhost:5000/api/donations");
    const donations = await response.json();

    tableBody.innerHTML = "";

    if (donations.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">No donation history found.</td></tr>`;
      return;
    }

    donations.forEach(donation => {
      const row = `
        <tr>
          <td>${new Date(donation.date).toLocaleDateString()}</td>
          <td>${donation.hospital_name || "Unknown"}</td>
          <td>${donation.blood_group}</td>
          <td>${donation.units}</td>
          <td>${donation.city || "N/A"}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `<tr><td colspan="5">Failed to load history.</td></tr>`;
  }
});

// Back to dashboard
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "donor_dashboard.html";
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../home.html";
});
