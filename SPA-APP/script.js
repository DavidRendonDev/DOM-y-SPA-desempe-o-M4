const apiUrl = "http://localhost:3000";

// Mostrar secciones según ID
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// REGISTRO DE USUARIO
function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("registerConfirm").value;
  const role = document.getElementById("registerRole").value;

  if (!name || !email || !password || password !== confirm) {
    alert("Por favor completa bien todos los campos.");
    return;
  }

  fetch(`${apiUrl}/usuarios?email=${email}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        alert("Este correo ya está registrado.");
      } else {
        const nuevoUsuario = { nombre: name, email, password, rol: role };
        fetch(`${apiUrl}/usuarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoUsuario)
        }).then(() => {
          alert("Registro exitoso. Ahora inicia sesión.");
          showSection("loginSection");
        });
      }
    });
}

// LOGIN DE USUARIO
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  fetch(`${apiUrl}/usuarios?email=${email}&password=${password}`)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        alert("Credenciales incorrectas.");
      } else {
        const usuario = data[0];
        localStorage.setItem("usuarioActual", JSON.stringify(usuario));
        if (usuario.rol === "admin") {
          showAdminPanel(usuario);
        } else {
          showUserPanel(usuario);
        }
      }
    });
}

// MOSTRAR PANEL ADMIN
function showAdminPanel(usuario) {
  document.getElementById("adminName").innerText = usuario.nombre;
  showSection("adminSection");
  cargarCursosAdmin();
}

// MOSTRAR PANEL USUARIO
function showUserPanel(usuario) {
  document.getElementById("userName").innerText = usuario.nombre;
  showSection("userSection");
  cargarCursosUsuario();
}

// CERRAR SESIÓN
function logout() {
  localStorage.removeItem("usuarioActual");
  showSection("loginSection");
}

// AL CARGAR LA APP
window.onload = () => {
  const user = JSON.parse(localStorage.getItem("usuarioActual"));
  if (user) {
    user.rol === "admin" ? showAdminPanel(user) : showUserPanel(user);
  } else {
    showSection("loginSection");
  }
};

// ADMIN: CARGAR CURSOS
function cargarCursosAdmin() {
  fetch(`${apiUrl}/cursos`)
    .then(res => res.json())
    .then(cursos => {
      const cont = document.getElementById("eventListAdmin");
      cont.innerHTML = "";
      cursos.forEach(curso => {
        const div = document.createElement("div");
        div.className = "event-card";
        div.innerHTML = `
          <div class="event-info">
            <strong>${curso.nombre}</strong><br>
            ${curso.descripcion}<br>
            ${curso.fecha} - Cupos: ${curso.cupos}
          </div>
          <div class="event-actions">
            <button onclick="editarCurso(${curso.id})">✏️</button>
            <button onclick="eliminarCurso(${curso.id})">🗑️</button>
          </div>
        `;
        cont.appendChild(div);
      });
    });
}

// ADMIN: MOSTRAR FORMULARIO
function showAddEventForm() {
  document.getElementById("eventFormContainer").classList.remove("hidden");
  document.getElementById("eventName").value = "";
  document.getElementById("eventDesc").value = "";
  document.getElementById("eventDate").value = "";
  document.getElementById("eventCapacity").value = "";
  document.getElementById("eventFormContainer").dataset.editing = "";
}

// ADMIN: OCULTAR FORMULARIO
function hideAddEventForm() {
  document.getElementById("eventFormContainer").classList.add("hidden");
}

// ADMIN: GUARDAR CURSO NUEVO O EDITADO
function saveEvent() {
  const nombre = document.getElementById("eventName").value;
  const descripcion = document.getElementById("eventDesc").value;
  const fecha = document.getElementById("eventDate").value;
  const cupos = parseInt(document.getElementById("eventCapacity").value);
  const imagen = "https://via.placeholder.com/80";
  const editingId = document.getElementById("eventFormContainer").dataset.editing;

  if (editingId) {
    // EDITAR
    const curso = { nombre, descripcion, fecha, cupos, imagen, id: editingId };
    fetch(`${apiUrl}/cursos/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(curso)
    }).then(() => {
      hideAddEventForm();
      cargarCursosAdmin();
    });
  } else {
    // CREAR (NO ENVIAR ID)
    const curso = { nombre, descripcion, fecha, cupos, imagen };
    fetch(`${apiUrl}/cursos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(curso)
    }).then(() => {
      hideAddEventForm();
      cargarCursosAdmin();
    });
  }
}

// ADMIN: EDITAR CURSO
function editarCurso(id) {
  fetch(`${apiUrl}/cursos/${id}`)
    .then(res => res.json())
    .then(curso => {
      document.getElementById("eventName").value = curso.nombre;
      document.getElementById("eventDesc").value = curso.descripcion;
      document.getElementById("eventDate").value = curso.fecha;
      document.getElementById("eventCapacity").value = curso.cupos;
      document.getElementById("eventFormContainer").dataset.editing = curso.id;
      document.getElementById("eventFormContainer").classList.remove("hidden");
    });
}

// ADMIN: ELIMINAR CURSO
function eliminarCurso(id) {
  if (confirm("¿Estás seguro de eliminar este curso?")) {
    fetch(`${apiUrl}/cursos/${id}`, {
      method: "DELETE"
    }).then(() => cargarCursosAdmin());
  }
}

// USUARIO: CARGAR CURSOS
function cargarCursosUsuario() {
  fetch(`${apiUrl}/cursos`)
    .then(res => res.json())
    .then(cursos => {
      const cont = document.getElementById("eventListUser");
      cont.innerHTML = "";
      cursos.forEach(curso => {
        const div = document.createElement("div");
        div.className = "event-card";
        div.innerHTML = `
          <div class="event-info">
            <strong>${curso.nombre}</strong><br>
            ${curso.descripcion}<br>
            ${curso.fecha} - Cupos: ${curso.cupos}
          </div>
          <div class="event-actions">
            <button onclick="reservarCurso(${curso.id})" ${curso.cupos <= 0 ? 'class="disabled" disabled' : ''}>
              ${curso.cupos <= 0 ? 'Agotado' : 'Reservar'}
            </button>
          </div>
        `;
        cont.appendChild(div);
      });
    });
}

// USUARIO: RESERVAR CURSO
function reservarCurso(idCurso) {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  const reserva = {
    idCurso: idCurso,
    idUsuario: usuario.id
  };

  fetch(`${apiUrl}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva)
  }).then(() => {
    // Reducir cupos disponibles
    fetch(`${apiUrl}/cursos/${idCurso}`)
      .then(res => res.json())
      .then(curso => {
        const nuevosCupos = curso.cupos - 1;
        fetch(`${apiUrl}/cursos/${idCurso}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cupos: nuevosCupos })
        }).then(() => {
          alert("Reserva exitosa");
          cargarCursosUsuario();
        });
      });
  });
}