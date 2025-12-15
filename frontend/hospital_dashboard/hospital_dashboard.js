document.addEventListener("DOMContentLoaded", () => {
  AOS.init();

  // Dummy hospital name — replace with backend fetch later
  document.getElementById("hospitalName").textContent =
    localStorage.getItem("hospital_name") || "Hospital";

  document.getElementById("createRequestBtn").addEventListener("click", () => {
    window.location.href = "../blood_request/blood_request.html";
  });

  document.getElementById("viewAppointmentsBtn").addEventListener("click", () => {
    window.location.href = "../appointment/view_appointment.html";
  });

  document.getElementById("viewRequestsBtn").addEventListener("click", () => {
    window.location.href = "../blood_request/view_blood_request.html";
  });

  document.getElementById("updateProfileBtn").addEventListener("click", () => {
    window.location.href = "../update_info/update_info_hospital.html";
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../home.html";
  });
});
