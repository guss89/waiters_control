$(document).ready(function () {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  /** Load datatable */
  const waiterTable = $('#waiters').DataTable({
    ajax: {
      url: 'http://localhost:8000/answers/rating/all',
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
      const res = await fetch('http://localhost:8000/waiters/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert("Error al registrar mesero");
        return;
      }
      waiterTable.ajax.reload();
      alert("Registro correcto");
      formWaiter.reset();
    } catch (err) {
      console.log("Error:", err);
    }
  });

});

  async function deleteWaiter (waiter_id) {
      try{
        const waiterTable = $('#waiters').DataTable();
        const res = await fetch('http://localhost:8000/waiters/' + waiter_id,{
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json'}
        });
        if (!res.ok) {
          alert("Error al registrar mesero");
          return;
        }
        waiterTable.ajax.reload();
        alert("Registro eliminado correctamente");
      }catch(err){
        console.log("Error:", err)
      }
  }