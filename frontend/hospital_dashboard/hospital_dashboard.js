document.addEventListener("DOMContentLoaded", () => {
  AOS.init();

  // Dummy hospital name — replace with backend fetch later
  document.getElementById("hospitalName").textContent =
    localStorage.getItem("hospitalName") || "City Hospital";

  // Navigation
  document.getElementById("createRequestBtn").addEventListener("click", () => {
    window.location.href = "create_request.html";
  });

  document.getElementById("viewAppointmentsBtn").addEventListener("click", () => {
    window.location.href = "appointments.html";
  });

  document.getElementById("viewRequestsBtn").addEventListener("click", () => {
    window.location.href = "view_requests.html";
  });

  document.getElementById("updateProfileBtn").addEventListener("click", () => {
    window.location.href = "update_hospital_info.html";
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../home.html";
  });
});
