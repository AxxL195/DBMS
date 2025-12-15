AOS.init();

// 🩸 Load donor name from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const donorName = localStorage.getItem("donor_name") || "Donor";
  document.getElementById("donorName").textContent = donorName;
});

//view history
document.getElementById("viewHistoryBtn").addEventListener("click", async () =>{
    window.location.href = "donor_history.html";
})

// 🩸 View available blood requests
// document.getElementById("viewRequestsBtn").addEventListener("click", async () => {
//   try {
//     const res = await fetch("http://localhost:5000/api/bloodrequests");
//     const requests = await res.json();

//     const tableBody = document.getElementById("requestsTableBody");
//     tableBody.innerHTML = "";

//     requests.forEach(req => {
//       const row = `
//         <tr>
//           <td>${req.hospital_name || "Unknown"}</td>
//           <td>${req.blood_group_required}</td>
//           <td>${req.quantity_units}</td>
//           <td>${req.city || "N/A"}</td>
//           <td>${req.is_urgent ? "Yes" : "No"}</td>
//         </tr>`;
//       tableBody.insertAdjacentHTML("beforeend", row);
//     });

//     new bootstrap.Modal(document.getElementById("requestsModal")).show();
//   } catch (err) {
//     console.error(err);
//     alert("Failed to load requests.");
//   }
// });

//view available requests
document.getElementById("viewRequestsBtn").addEventListener("click",async () =>{
    window.location.href= "donor_requests.html"
})
// 🩸 View Appointments
document.getElementById("viewAppointmentsBtn").addEventListener("click", () => {
  window.location.href = "donor_appointments.html";
});

// 🩸 Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../home.html";
});


document.getElementById("updateProfileBtn").addEventListener("click", () =>{
  window.location.href = "../update_info/update_info_donor.html";
})