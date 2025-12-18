import React, { useState, useEffect } from "react";
import "../../css/administracion.css";

export default function AdminPanel({ onLogout }) {
  const [section, setSection] = useState("dashboard");
  const [formModal, setFormModal] = useState(false);

  const [formData, setFormData] = useState({
    primer_nombre: "",
    apellido: "",
    email: "",
    password: "",
    id_rol: 3,
  });

  const [usuarios, setUsuarios] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/admin/usuarios")
      .then(res => res.json())
      .then(data => setUsuarios(data.data || []));

    fetch("http://127.0.0.1:8000/api/admin/contar-usuarios")
      .then(res => res.json())
      .then(data => setTotal(data.total || 0));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const crearUsuario = e => {
    e.preventDefault();
    setFormModal(false);
  };

  const eliminarUsuario = id => {
    if (window.confirm("¿Eliminar usuario?")) {
      setUsuarios(usuarios.filter(u => u.id_usuario !== id));
    }
  };

  return (
    <div className="estudiante-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="perfil">
          <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
          <h3>Administrador</h3>
          <p>Panel de control</p>
        </div>

        <div className="menu">
          <button onClick={() => setSection("dashboard")}>Dashboard</button>
          <button onClick={() => setSection("usuarios")}>Usuarios</button>
          <button onClick={() => setSection("reportes")}>Reportes</button>
          <button className="logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="contenido">
        {section === "dashboard" && (
          <>
            <div className="bienvenida">
              <h1>Bienvenido Administrador 👋</h1>
              <p>Resumen general</p>
            </div>

            <div className="cards">
              <div className="card">
                <h3>Total Usuarios</h3>
                <p style={{ fontSize: 32 }}>{total}</p>
              </div>
              <div className="card">
                <h3>Administradores</h3>
                <p style={{ fontSize: 32 }}>
                  {usuarios.filter(u => u.id_rol === 1).length}
                </p>
              </div>
              <div className="card">
                <h3>Otros Usuarios</h3>
                <p style={{ fontSize: 32 }}>
                  {usuarios.filter(u => u.id_rol !== 1).length}
                </p>
              </div>
            </div>

            <button className="volver" onClick={() => setFormModal(true)}>
              Crear Usuario
            </button>
          </>
        )}

        {section === "usuarios" && (
          <>
            <h1>Gestión de Usuarios</h1>

            <button className="volver" onClick={() => setFormModal(true)}>
              Crear Usuario
            </button>

            <table style={{ width: "100%", marginTop: 20 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id_usuario}>
                    <td>{u.id_usuario}</td>
                    <td>{u.primer_nombre} {u.apellido}</td>
                    <td>{u.email}</td>
                    <td>{u.id_rol === 1 ? "Admin" : "Usuario"}</td>
                    <td>
                      <button
                        className="btn-secundario"
                        onClick={() => eliminarUsuario(u.id_usuario)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {section === "reportes" && (
          <>
            <h1>Reportes</h1>
            <div className="cards">
              <div className="card">Reporte General</div>
              <div className="card">Exportar Excel</div>
              <div className="card">Generar PDF</div>
            </div>
          </>
        )}
      </main>

      {/* MODAL */}
      {formModal && (
        <div className="modal-fullscreen">
          <div className="modal-box">
            <h3>Nuevo Usuario</h3>

            <form onSubmit={crearUsuario}>
              <label>Nombre</label>
              <input name="primer_nombre" onChange={handleChange} />

              <label>Apellido</label>
              <input name="apellido" onChange={handleChange} />

              <label>Email</label>
              <input name="email" onChange={handleChange} />

              <label>Contraseña</label>
              <input type="password" name="password" onChange={handleChange} />

              <label>Rol</label>
              <select name="id_rol" onChange={handleChange}>
                <option value={2}>Administrador</option>
                <option value={3}>Usuario</option>
              </select>

              <div className="acciones-modal">
                <button
                  type="button"
                  className="btn-secundario"
                  onClick={() => setFormModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primario">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
