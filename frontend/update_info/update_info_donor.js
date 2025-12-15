// Backend URL
const backendURL = "http://localhost:5001/api/v1/donor";

// Load existing donor data
async function loadDonorData() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${backendURL}/me`, {
      headers: {Authorization: `Bearer ${token}`}
    });

    const data = await res.json();

    if (!res.ok) return alert("Unable to load donor info.");

    // Auto-fill fields
    document.getElementById("first_name").value = data.first_name;
    document.getElementById("last_name").value = data.last_name;
    document.getElementById("gender").value = data.gender;
    document.getElementById("date_of_birth").value =
    data.date_of_birth ? data.date_of_birth.split("T")[0] : "";
    document.getElementById("email").value = data.email;
    document.getElementById("blood_group").value = data.blood_group;
    document.getElementById("phone_number").value = data.phone_number;
    document.getElementById("city").value = data.city;
    document.getElementById("state").value = data.state;
    document.getElementById("zip_code").value = data.zip_code;
    document.getElementById("last_donation_date").value =
    data.last_donation_date ? data.last_donation_date.split("T")[0] : "";
    document.getElementById("first_time_donor").value = data.first_time_donor;
    document.getElementById("has_hiv").checked = data.has_hiv;
    document.getElementById("has_chronic_disease").checked = data.has_chronic_disease;
    document.getElementById("pregnant_or_breastfeeding").checked = data.pregnant_or_breastfeeding;
    document.getElementById("recent_surgery").checked = data.recent_surgery;
    document.getElementById("on_medication").checked = data.on_medication;
    document.getElementById("emergency_contact").value = data.emergency_contact;

  } catch (err) {
    console.error(err);
    alert("Server error while loading donor info.");
  }
}

loadDonorData();

document.getElementById("updateForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const updateData = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    gender: document.getElementById("gender").value,
    date_of_birth:document.getElementById("date_of_birth").value || null,
    phone_number: document.getElementById("phone_number").value,
    email:document.getElementById("email").value,
    blood_group: document.getElementById("blood_group").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    zip_code: document.getElementById("zip_code").value,
    last_donation_date: document.getElementById("last_donation_date").value || null,
    first_time_donor: document.getElementById("first_time_donor").value,
    has_hiv: document.getElementById("has_hiv").checked,
    has_chronic_disease: document.getElementById("has_chronic_disease").checked,
    on_medication: document.getElementById("on_medication").checked,
    recent_surgery: document.getElementById("recent_surgery").checked,
    pregnant_or_breastfeeding: document.getElementById("pregnant_or_breastfeeding").checked,
    emergency_contact: document.getElementById("emergency_contact").value,
  };

  try {
    const res = await fetch(`${backendURL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization : `Bearer ${token}`
      },
      body:JSON.stringify(updateData)
    });

    const data = await res.json();

    if (res.ok) {
      alert("🔄 Information updated successfully!");
      window.location.href = "../donor_dashboard/donor_dashboard.html";
    } else {
      alert(`❌ ${data.message || "Update failed"}`);
    }

  } catch (err) {
    console.error(err);
    alert("Server error while updating donor info.");
  }
});
