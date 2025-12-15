document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("donationHistoryBody");
  tableBody.innerHTML = `<tr><td colspan="5">Loading your donation history...</td></tr>`;

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:5001/api/v1/donor/getDonationHistory", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      tableBody.innerHTML = `<tr><td colspan="5">No donation history found.</td></tr>`;
      return;
    }

    const donations = await response.json();
    tableBody.innerHTML = "";

    if (!Array.isArray(donations) || donations.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">No donation history found.</td></tr>`;
      return;
    }

    donations.forEach(donation => {
      const row = `
        <tr>
          <td>${new Date(donation.donation_date).toLocaleDateString()}</td>
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
