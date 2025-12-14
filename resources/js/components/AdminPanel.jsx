import React, { useState, useEffect } from "react";
import "../../css/administracion.css";

export default function AdminPanel({ onLogout }) {
  const [section, setSection] = useState("dashboard");
  const [modal, setModal] = useState({ show: false, title: "", type: "view" });
  const [formModal, setFormModal] = useState({ show: false, type: "usuario" });
  const [formData, setFormData] = useState({
    primer_nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    email: "",
    password: "",
    id_rol: 3,
  });

  const [inscritos, setInscritos] = useState([]);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [respUsuarios, respTotal] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/admin/usuarios"),
        fetch("http://127.0.0.1:8000/api/admin/contar-usuarios"),
      ]);

      const dataUsuarios = await respUsuarios.json();
      const dataTotal = await respTotal.json();

      if (dataUsuarios.success) {
        setInscritos(dataUsuarios.data);
      }
      if (dataTotal.success) {
        setTotalUsuarios(dataTotal.total);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    const nuevosErrores = [];

    if (!formData.primer_nombre.trim())
      nuevosErrores.push("El primer nombre es obligatorio");
    if (!formData.apellido.trim())
      nuevosErrores.push("El apellido es obligatorio");
    if (!formData.cedula.trim())
      nuevosErrores.push("La cédula es obligatoria");
    if (!formData.telefono.trim())
      nuevosErrores.push("El teléfono es obligatorio");
    if (!formData.email.includes("@"))
      nuevosErrores.push("El email no es válido");
    if (formData.password.length < 6)
      nuevosErrores.push("La contraseña debe tener al menos 6 caracteres");

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setCargando(true);
    setErrores([]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/crear-usuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const erroresDelServidor = [];
          for (const campo in data.errors) {
            erroresDelServidor.push(data.errors[campo][0]);
          }
          setErrores(erroresDelServidor);
        } else {
          setErrores([data.message || "Error al crear usuario"]);
        }
      } else {
        setErrores([]);
        setMensaje("Usuario creado exitosamente");
        
        setFormData({
          primer_nombre: "",
          apellido: "",
          cedula: "",
          telefono: "",
          email: "",
          password: "",
          id_rol: 3,
        });

        setTimeout(() => {
          setFormModal({ show: false, type: "usuario" });
          cargarDatos();
          setMensaje("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrores([
        "Error de conexión. Verifica que el servidor Laravel esté corriendo.",
      ]);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/admin/usuarios/${id}`,
          {
            method: "DELETE",
            headers: {
              "Accept": "application/json",
            },
          }
        );

        if (response.ok) {
          setMensaje("Usuario eliminado exitosamente");
          cargarDatos();
          setTimeout(() => setMensaje(""), 3000);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const getRolNombre = (idRol) => {
    const roles = { 1: "Administrador", 2: "Secretaria", 3: "Deportista" };
    return roles[idRol] || "Desconocido";
  };

  const handleDescargarReporte = async () => {
    try {
      setMensaje("Generando reporte...");
      setErrores([]);
      
      const response = await fetch("http://127.0.0.1:8000/api/reportes/usuarios");
      const data = await response.json();

      if (data.success) {
        console.log("Reporte de usuarios:", data);
        setMensaje(`Reporte generado: ${data.total} usuarios en total`);
        setTimeout(() => setMensaje(""), 3000);
      } else {
        setErrores(["Error al generar reporte"]);
        setTimeout(() => setErrores([]), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrores(["Error de conexión al generar reporte"]);
      setTimeout(() => setErrores([]), 3000);
    }
  };

  const handleDescargarExcel = async () => {
    try {
      setMensaje("Generando archivo Excel...");
      setErrores([]);
      
      const response = await fetch("http://127.0.0.1:8000/api/reportes/exportar-excel");

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte_usuarios_${new Date().getTime()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setMensaje("Excel descargado exitosamente");
        setTimeout(() => setMensaje(""), 3000);
      } else {
        setErrores(["Error al descargar Excel"]);
        setTimeout(() => setErrores([]), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrores(["Error de conexión al descargar Excel"]);
      setTimeout(() => setErrores([]), 3000);
    }
  };

  const handleDescargarPDF = async () => {
    try {
      setMensaje("Generando PDF...");
      setErrores([]);
      
      const response = await fetch("http://127.0.0.1:8000/api/reportes/exportar-pdf");

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte_usuarios_${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setMensaje("PDF descargado exitosamente");
        setTimeout(() => setMensaje(""), 3000);
      } else {
        setErrores(["Error al descargar PDF"]);
        setTimeout(() => setErrores([]), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrores(["Error de conexión al descargar PDF"]);
      setTimeout(() => setErrores([]), 3000);
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="logo">Panel de Administración</div>

        <nav className="top-menu">
          <button onClick={() => setSection("dashboard")}>Crear usuarios</button>
          <button onClick={() => setSection("usuarios")}>Usuarios</button>
          <button onClick={() => setSection("reportes")}>Reportes</button>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("admin_token");
              onLogout();
            }}
          >
            Cerrar Sesión
          </button>
        </nav>
      </header>

      <main>
        {section === "dashboard" && (
          <section className="dashboard">
            <h2>Panel General</h2>

            <div className="cards">
              <div className="card">
                <h3>Total Usuarios</h3>
                <p style={{ fontSize: "32px", fontWeight: "bold" }}>
                  {totalUsuarios}
                </p>
              </div>
              <div className="card">
                <h3>Administradores</h3>
                <p style={{ fontSize: "32px", fontWeight: "bold" }}>
                  {inscritos.filter((u) => u.id_rol === 1).length}
                </p>
              </div>
              <div className="card">
                <h3>Otros Usuarios</h3>
                <p style={{ fontSize: "32px", fontWeight: "bold" }}>
                  {inscritos.filter((u) => u.id_rol !== 1).length}
                </p>
              </div>
            </div>

            <button
              className="btn-add"
              onClick={() => setFormModal({ show: true, type: "usuario" })}
            >
              Crear Nuevo Usuario
            </button>
          </section>
        )}

        {section === "usuarios" && (
          <section className="usuarios">
            <h2>Gestión de Usuarios</h2>

            <button
              className="btn-add"
              onClick={() => setFormModal({ show: true, type: "usuario" })}
            >
              Crear Nuevo Usuario
            </button>

            {mensaje && <p className="mensaje-success">{mensaje}</p>}

            <table style={{ marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Cédula</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {inscritos.length === 0 && (
                  <tr>
                    <td colSpan="7" className="no-data">
                      Sin datos disponibles
                    </td>
                  </tr>
                )}

                {inscritos.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.id_usuario}</td>
                    <td>
                      {usuario.primer_nombre} {usuario.apellido}
                    </td>
                    <td>{usuario.email}</td>
                    <td>{usuario.cedula}</td>
                    <td>{usuario.telefono}</td>
                    <td>{getRolNombre(usuario.id_rol)}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() =>
                          handleEliminarUsuario(usuario.id_usuario)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {section === "reportes" && (
          <section className="reportes">
            <h2>Reportes</h2>

            {mensaje && (
              <p style={{ 
                backgroundColor: "#d4edda", 
                color: "#155724", 
                padding: "12px", 
                borderRadius: "4px",
                marginBottom: "20px" 
              }}>
                {mensaje}
              </p>
            )}

            {errores.length > 0 && (
              <div style={{ 
                backgroundColor: "#f8d7da", 
                color: "#721c24", 
                padding: "12px", 
                borderRadius: "4px",
                marginBottom: "20px" 
              }}>
                {errores.map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            )}

            <button 
              className="btn-report" 
              onClick={handleDescargarReporte}
              style={{ 
                padding: "10px 20px", 
                margin: "10px", 
                backgroundColor: "#007bff", 
                color: "white", 
                border: "none", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Reporte de Usuarios
            </button>
            
            <button 
              className="btn-report" 
              onClick={handleDescargarExcel}
              style={{ 
                padding: "10px 20px", 
                margin: "10px", 
                backgroundColor: "#28a745", 
                color: "white", 
                border: "none", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Exportar Excel
            </button>
            
            <button 
              className="btn-report" 
              onClick={handleDescargarPDF}
              style={{ 
                padding: "10px 20px", 
                margin: "10px", 
                backgroundColor: "#dc3545", 
                color: "white", 
                border: "none", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Generar PDF
            </button>
          </section>
        )}
      </main>

      {formModal.show && (
        <div
          className="modal"
          onClick={() => setFormModal({ show: false, type: "usuario" })}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "500px" }}
          >
            <span
              className="close"
              onClick={() => setFormModal({ show: false, type: "usuario" })}
            >
              &times;
            </span>

            <h2>Crear Nuevo Usuario</h2>

            {mensaje && <p className="mensaje-success">{mensaje}</p>}
            {errores.length > 0 && (
              <div className="alert">
                <ul>
                  {errores.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleCrearUsuario}>
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Primer Nombre</label>
                <input
                  type="text"
                  name="primer_nombre"
                  value={formData.primer_nombre}
                  onChange={handleChangeForm}
                  required
                  disabled={cargando}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChangeForm}
                  required
                  disabled={cargando}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChangeForm}
                  required
                  disabled={cargando}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChangeForm}
                  required
                  disabled={cargando}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChangeForm}
                  required
                  disabled={cargando}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChangeForm}
                  required
                  disabled={cargando}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Rol</label>
                <select
                  name="id_rol"
                  value={formData.id_rol}
                  onChange={handleChangeForm}
                  disabled={cargando}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                >
                  <option value={2}>Administrador</option>
                  <option value={3}>Deportista</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-add"
                disabled={cargando}
                style={{ width: "100%" }}
              >
                {cargando ? "Creando..." : "Crear Usuario"}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer>
        <p>© 2025 Administración de Cursos Vacacionales</p>
      </footer>
    </div>
  );

}