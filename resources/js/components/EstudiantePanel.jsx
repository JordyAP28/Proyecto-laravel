import React, { useState } from "react";
import "../../css/estudiante.css";

export default function EstudiantePanel() {
  const nombreUsuario = "Alumno";
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vista, setVista] = useState("inicio"); // inicio | misCursos

  const cerrarSesion = () => {
    window.location.href = "/login"; // ajusta si tu ruta es otra
  };

  /* =======================
     CUANDO EL MODAL ESTÁ ABIERTO
     SOLO SE MUESTRA EL MODAL
  ======================== */
  if (modalAbierto) {
    return (
      <div className="modal-fullscreen">
        <div className="modal-box">
          <h3>Registro de curso</h3>

          <form>
            <label>Curso</label>
            <select>
              <option>Fútbol</option>
              <option>Vóley</option>
              <option>Básquet</option>
              <option>Boxeo</option>
            </select>

            <label>Horario</label>
            <select>
              <option>Lunes y Miércoles</option>
              <option>Martes y Viernes</option>
            </select>

            <label>Categoría</label>
            <select>
              <option>Sub-13</option>
              <option>Sub-15</option>
              <option>Sub-18</option>
            </select>

            <div className="acciones-modal">
              <button type="button" className="btn-primario">
                Enviar
              </button>
              <button
                type="button"
                className="btn-secundario"
                onClick={() => setModalAbierto(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* =======================
     INTERFAZ NORMAL
  ======================== */
  return (
    <div className="estudiante-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="perfil">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Alumno"
          />
          <h3>Bienvenido</h3>
          <span>{nombreUsuario}</span>
        </div>

        <nav className="menu">
          <button onClick={() => setModalAbierto(true)}>
            📘 Registrar curso
          </button>
          <button onClick={() => setVista("misCursos")}>
            🎓 Mis cursos
          </button>
          <button onClick={() => (window.location.href = "/perfil")}>
            👤 Perfil
          </button>
          <button onClick={() => (window.location.href = "/historial")}>
            📜 Historial
          </button>
          <button className="logout" onClick={cerrarSesion}>
            🚪 Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* ===== CONTENIDO ===== */}
      <main className="contenido">
        {vista === "inicio" && (
          <section className="bienvenida">
            <h1>Portal del Estudiante</h1>
            <p>
              Gestiona tus cursos vacacionales, revisa tus inscripciones y
              mantén tu información actualizada.
            </p>

            <div className="cards">
              <div className="card" onClick={() => setModalAbierto(true)}>
                <h3>Registrar curso</h3>
                <p>Inscríbete en un nuevo curso vacacional.</p>
              </div>

              <div className="card" onClick={() => setVista("misCursos")}>
                <h3>Mis cursos</h3>
                <p>Consulta tus cursos activos.</p>
              </div>
            </div>
          </section>
        )}

        {vista === "misCursos" && (
          <section className="mis-cursos">
            <h2>Mis cursos inscritos</h2>

            <div className="curso-item">
              <h4>Fútbol</h4>
              <span>Lunes y Miércoles · 08:00 - 10:00</span>
            </div>

            <div className="curso-item">
              <h4>Vóley</h4>
              <span>Martes y Viernes · 15:00 - 18:00</span>
            </div>

            <button className="volver" onClick={() => setVista("inicio")}>
              ⬅ Volver
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
