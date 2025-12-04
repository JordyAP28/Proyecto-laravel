import React, { useState, useEffect } from "react";
import "../../css/administracion.css";

export default function AdminPanel() {
  const [section, setSection] = useState("dashboard");
  const [modal, setModal] = useState({ show: false, title: "", content: "" });

  const [inscritos, setInscritos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [admins, setAdmins] = useState([]);

  // ===== FETCH REAL BD =====
  useEffect(() => {
   
  }, []);

  return (
    <div className="admin-panel">

      {/* ========== NAVBAR ORDENADO ========== */}
      <header className="admin-header">
        <div className="logo">Panel de Administración</div>

        <nav className="top-menu">
          <button onClick={() => setSection("dashboard")}>Dashboard</button>
          <button onClick={() => setSection("inscritos")}>Inscritos</button>
          <button onClick={() => setSection("cursos")}>Cursos</button>
          <button onClick={() => setSection("reportes")}>Reportes</button>
          <button onClick={() => setSection("admin")}>Administradores</button>

          <button 
  className="logout-btn"
  onClick={() => { window.location.href = "/"; }}
>
  Cerrar Sesión
</button>

        </nav>
      </header>

      {/* ========== CONTENIDO PRINCIPAL ========== */}
      <main>

        {/* ========== DASHBOARD ========== */}
        {section === "dashboard" && (
          <section className="dashboard">
            <h2>Panel General</h2>

            <div className="cards">
              <div className="card"><h3>Total Inscritos</h3><p>{inscritos.length}</p></div>
              <div className="card"><h3>Cursos Activos</h3><p>{cursos.length}</p></div>
              <div className="card"><h3>Administradores</h3><p>{admins.length}</p></div>
            </div>

            <button className="btn-report">Generar Reporte General</button>
          </section>
        )}

        {/* ========== INSCRITOS ========== */}
        {section === "inscritos" && (
          <section className="inscritos">
            <h2>Personas Inscritas</h2>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Curso</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {inscritos.length === 0 && (
                  <tr><td colSpan="5" className="no-data">Sin datos disponibles</td></tr>
                )}

                {inscritos.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.nombre}</td>
                    <td>{i.curso}</td>
                    <td>{i.fecha}</td>

                    <td>
                      <button
                        className="btn-view"
                        onClick={() =>
                          setModal({
                            show: true,
                            title: "Perfil del Inscrito",
                            content: `Nombre: ${i.nombre}
Curso: ${i.curso}
Fecha: ${i.fecha}`,
                          })
                        }
                      >
                        Ver Perfil
                      </button>

                      <button className="btn-delete">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ========== CURSOS ========== */}
        {section === "cursos" && (
          <section className="cursos">
            <h2>Gestión de Cursos</h2>

            <div className="cards">
              {cursos.length === 0 && (
                <p className="no-data">No hay cursos registrados</p>
              )}

              {cursos.map((c) => (
                <div className="card curso-card" key={c.id}>
                  <h3>{c.curso}</h3>
                  <p>Inscritos: {c.inscritos}</p>
                  <button className="btn-edit">Editar</button>
                </div>
              ))}
            </div>

            <button className="btn-add">Agregar Curso</button>
          </section>
        )}

        {/* ========== REPORTES ========== */}
        {section === "reportes" && (
          <section className="reportes">
            <h2>Reportes</h2>

            <button className="btn-report">Reporte de Inscritos</button>
            <button className="btn-report">Reporte por Curso</button>
            <button className="btn-report">Generar PDF General</button>
          </section>
        )}

        {/* ========== ADMINISTRADORES ========== */}
        {section === "admin" && (
          <section className="admin-control">
            <h2>Administradores</h2>

            <div className="cards">
              {admins.length === 0 && (
                <p className="no-data">No hay administradores registrados</p>
              )}

              {admins.map((a) => (
                <div className="card" key={a.id}>
                  <h3>{a.usuario}</h3>
                  <p>{a.rol}</p>
                </div>
              ))}
            </div>

            <button className="btn-add">Agregar Administrador</button>
          </section>
        )}
      </main>

      {/* ========== MODAL ========== */}
      {modal.show && (
        <div className="modal" onClick={() => setModal({ ...modal, show: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setModal({ ...modal, show: false })}>
              &times;
            </span>

            <h2>{modal.title}</h2>
            <p style={{ whiteSpace: "pre-line" }}>{modal.content}</p>
          </div>
        </div>
      )}

      <footer>
        <p>© 2025 Administración de Cursos Vacacionales</p>
      </footer>
    </div>
  );
}
