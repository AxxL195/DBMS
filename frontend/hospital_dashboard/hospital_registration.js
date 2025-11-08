AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true
});

document.getElementById('hospitalForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    hospital_name: document.getElementById('hospital_name').value,
    email: document.getElementById('email').value,
    password_hash: document.getElementById('password').value,
    phone_number: document.getElementById('phone_number').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    zip_code: document.getElementById('zip_code').value
  };

  try {
    const res = await fetch('http://localhost:5000/api/hospitals/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Hospital registered successfully!');
      document.getElementById('hospitalForm').reset();
    } else {
      alert('❌ Error: ' + data.message);
    }
  } catch (err) {
    console.error(err);
    alert('⚠️ Server error. Please try again later.');
  }
});
