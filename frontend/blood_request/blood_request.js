AOS.init();

// ✅ Handle Blood Request Form Submission
document.getElementById("bloodRequestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  data.is_urgent = data.is_urgent === "true"; // Convert to boolean

  try {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5001/api/v1/bloodrequest/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message || "Blood request submitted successfully!");
      e.target.reset();
    } else {
      alert(result.message || "Failed to submit blood request");
    }
  } catch (err) {
    console.error(err);
    alert("Server error — please try again later.");
  }
});
