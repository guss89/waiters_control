document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Credenciales inválidas");
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.access_token); // guardar token

      // redirigir al dashboard
      window.location.href = 'index.html';
    } catch (err) {
      console.error("Error de red", err);
      alert("Error de conexión");
    }
  });
});