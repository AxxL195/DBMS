AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true });

// Prevent selecting a future date for last donation
document.getElementById('last_donation_date').max = new Date().toISOString().split('T')[0];

// Backend URL
const backendURL = "http://localhost:5001/api/v1/donor";

document.getElementById('donorForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    gender: document.getElementById('gender').value,
    date_of_birth: document.getElementById('date_of_birth').value,
    phone_number: document.getElementById('phone_number').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    blood_group: document.getElementById('blood_group').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    zip_code: document.getElementById('zip_code').value,
    last_donation_date: document.getElementById('last_donation_date').value || null,
    first_time_donor: document.getElementById('first_time_donor').value === 'true',
    has_hiv: document.getElementById('has_hiv').checked,
    has_chronic_disease: document.getElementById('has_chronic_disease').checked,
    on_medication: document.getElementById('on_medication').checked,
    recent_surgery: document.getElementById('recent_surgery').checked,
    pregnant_or_breastfeeding: document.getElementById('pregnant_or_breastfeeding').checked,
    emergency_contact: document.getElementById('emergency_contact').value,
    consent: document.getElementById('consent').checked
  };

  try {
    const res = await fetch(`${backendURL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Donor registered successfully!");
      window.location.href = "../donor_dashboard/donor_dashboard.html";
    } else {
      alert(`❌ ${data.message || "Registration failed"}`);
    }

  } catch (err) {
    console.error("Error:", err);
    alert("Server connection error. Check if backend is running.");
  }
});
