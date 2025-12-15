document.addEventListener("DOMContentLoaded", loadHospitalInfo);

async function loadHospitalInfo() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5001/api/v1/hospital/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  if (!res.ok) return alert("Error loading hospital info");

  document.getElementById("hospital_name").value = data.hospital_name;
  document.getElementById("phone_number").value = data.phone_number;
  document.getElementById("city").value = data.city;
}

document.getElementById("updateHospitalForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const body = {
    hospital_name: document.getElementById("hospital_name").value,
    phone_number: document.getElementById("phone_number").value,
    city: document.getElementById("city").value,
    password: document.getElementById("password").value || null
  };

  const res = await fetch("http://localhost:5001/api/v1/hospital/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (res.ok) {
    alert("✅ Information updated successfully!");
  } else {
    alert("❌ " + data.message);
  }
});
