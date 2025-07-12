document.addEventListener('DOMContentLoaded', () => {

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });


  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    try {
      
      const res = await fetch('https://api.dev-xen.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
              Toast.fire({
                icon: "error",
                title: "Credenciales inválidas"
              });
            return;
          }

          const data = await res.json();
          localStorage.setItem('token', data.access_token); // guardar token

          // redirigir al dashboard
          window.location.href = 'index.html';
      
    } catch (err) {
      console.error("Error de red", err);
      Toast.fire({
            icon: "error",
            title: "Error de conexión"
          });
    }
  });
});