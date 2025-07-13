$(document).ready(function () {
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

  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  /** Load datatable */
  const waiterTable = $('#waiters').DataTable({
    ajax: {
      url: 'https://api.dev-xen.com/answers/rating/all',
      dataSrc: ''
    },
    columns: [
      { data: 'id' },
      { data: 'name' },
      { 
        data: 'ranking',
        render: function(data, type, row) {
          const max = 4;
          const escala = (data / max) * 5;

          const parteEntera = Math.floor(escala);
          const decimal = escala - parteEntera;

          const llenas = decimal > 0.5 ? parteEntera + 1 : parteEntera;

          let html = '';

          for (let i = 0; i < 5; i++) {
            if (i < llenas) {
              html += '<i class="fas fa-star text-yellow-500"></i>';
            } else {
              html += '<i class="fas fa-star text-white"></i>';
            }
          }

          return html;
        }
      }, 
      { data: 'id', render : function(data, type, row){
          return  '<div class="flex gap-1 w-full justify-around"><button class="bg-white hover:bg-white-700 text-black font-semibold py-2 px-4 rounded-md mt-3" onclick="deleteWaiter('+data+')"> Eliminar</button></div>';
        }
      }
    ],
    language: {
      url: "https://cdn.datatables.net/plug-ins/2.0.0/i18n/es-MX.json"
    }
  });

  /** Form event */
  $('#btn-form').on('click', async function () {
    const formWaiter = $('#waiter-form')[0]; // obtener el DOM nativo para FormData
    const formData = new FormData(formWaiter);

    const payload = {
      name: formData.get('name'),
      store_id: 1
    };

    try {
      const res = await fetch('https://api.dev-xen.com/waiters/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        Toast.fire({
                icon: "error",
                title: "Error al registrar mesero"
              });
        return;
      }
      Toast.fire({
                icon: "success",
                title: "Registro correcto"
              });
      waiterTable.ajax.reload();
      formWaiter.reset();
    } catch (err) {
      console.log("Error:", err);
    }
  });

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      });
  }

  //Tabs functions 
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Desactivar todos
        tabButtons.forEach(b => b.classList.remove('border-red-500', 'bg-orange-500'));
        tabContents.forEach(c => c.classList.add('hidden'));

        // Activar el clicado
        btn.classList.add('border-red-500', 'bg-orange-500');
        document.getElementById(btn.dataset.tab).classList.remove('hidden');
      });
    });

    // Activar la primera por defecto
    tabButtons[0].click();

    //carga de comentarios
    loadComments();
    loadQuestions();
});

  async function deleteWaiter (waiter_id) {
      try{

          Swal.fire({
        title: "Desea eliminar al empleado?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Eliminar",
      }).then(async (result) => {
        Toast = Swal.mixin({
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
        if (result.isConfirmed) {
          const waiterTable = $('#waiters').DataTable();
          const res = await fetch('https://api.dev-xen.com/waiters/' + waiter_id,{
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json'}
          });
          if (!res.ok) {
            Toast.fire({
                icon: "error",
                title: "Error al eliminar al empleado"
              });
            return;
          }
          waiterTable.ajax.reload();
          Toast.fire({
                icon: "success",
                title: "Empleado eliminado correctamente"
              });
        } 
      });
        
      }catch(err){
        console.log("Error:", err)
      }
  }

  async function loadComments() {
    try {
      const res = await fetch('https://api.dev-xen.com/comments/');
      if (!res.ok) throw new Error("No se pudo obtener los comentarios");
      const comentarios = await res.json();

      const container = document.getElementById('comments-container');
      container.innerHTML = '';

      comentarios.forEach(comment => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded shadow';

        /*card.innerHTML = `
          <div class="text-gray-700 font-semibold mb-1">💬 Usuario: ${comment.client?.name || 'Anónimo'}</div>
          <div class="text-sm text-gray-500 mb-2">🕒 ${comment.created_at || 'Fecha desconocida'}</div>
          <hr class="mb-2">
          <p class="text-gray-800">${comment.description}</p>
        `;*/

        card.innerHTML = `
          <div class="text-sm text-gray-500 mb-2">💬 Comentario # ${comment.id }</div>
          <hr class="mb-2">
          <p class="text-gray-800">${comment.description}</p>
        `;

        container.appendChild(card);
      });

    } catch (err) {
      console.error(err);
      document.getElementById('comments-container').innerHTML =
        `<p class="text-red-500">Error al cargar comentarios.</p>`;
    }
  }

  async function loadQuestions() {
    try {
      const res = await fetch('https://api.dev-xen.com/answers/avg/all');
      if (!res.ok) throw new Error("No se pudo obtener los comentarios");
      const questions = await res.json();

      const container = document.getElementById('questions-container');
      container.innerHTML = '';

      questions.forEach(question => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded shadow';

        let rankText = "";
        if(question.promedio_relativo < 26){
          rankText = "Malo"
        }else if(question.promedio_relativo < 51){
          rankText = "Regular"
        }else if( question.promedio_relativo < 76){
          rankText = "Bueno"
        }else{
          rankText = "Excelente"
        }

        card.innerHTML = `
          <div class="text-sm text-gray-500 mb-2">💬 Pregunta </div>
          <hr class="mb-2">
          <p class="text-gray-800">${question.pregunta} ${question.promedio_relativo}%  -- ${rankText}</p>
        `;

        container.appendChild(card);
      });

    } catch (err) {
      console.error(err);
      document.getElementById('comments-container').innerHTML =
        `<p class="text-red-500">Error al cargar comentarios.</p>`;
    }
  }