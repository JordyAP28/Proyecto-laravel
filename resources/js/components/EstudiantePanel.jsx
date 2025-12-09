import React, { useState } from "react";
import axios from "axios";
import "../../css/estudiante.css";

// Componente reutilizable de Modal
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default function EstudiantePanel() {
  const nombreUsuario = "Alumno";

  const [modalAbierto, setModalAbierto] = useState(null); // 'registrar' | 'misCursos' | 'historial' | 'perfil'
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [nivelSeleccionado, setNivelSeleccionado] = useState("");
  const [mensajeCurso, setMensajeCurso] = useState("");

  const cursosDisponibles = [
    { id: "voley", nombre: "Vóley" },
    { id: "basquet", nombre: "Básquet" },
    { id: "futbol", nombre: "Fútbol" },
    { id: "boxeo", nombre: "Boxeo" },
  ];

  const horariosPorCurso = {
    voley: [
      {
        id: "voley-1",
        label: "Lunes 09:00 - 12:00 y Jueves 14:00 - 17:00",
      },
      {
        id: "voley-2",
        label: "Martes 15:00 - 18:00 y Viernes 09:00 - 12:00",
      },
    ],
    basquet: [
      {
        id: "basquet-1",
        label: "Lunes 14:00 - 16:00 y Miércoles 09:00 - 11:00",
      },
      {
        id: "basquet-2",
        label: "Martes 09:00 - 11:00 y Jueves 16:00 - 18:00",
      },
    ],
    futbol: [
      {
        id: "futbol-1",
        label: "Lunes 08:00 - 10:00 y Miércoles 16:00 - 18:00",
      },
      {
        id: "futbol-2",
        label: "Martes 16:00 - 18:00 y Viernes 08:00 - 10:00",
      },
    ],
    boxeo: [
      {
        id: "boxeo-1",
        label: "Lunes 17:00 - 19:00 y Miércoles 17:00 - 19:00",
      },
      {
        id: "boxeo-2",
        label: "Martes 10:00 - 12:00 y Jueves 10:00 - 12:00",
      },
    ],
  };

  const niveles = [
    { id: "sub-13", label: "Sub-13" },
    { id: "sub-15", label: "Sub-15" },
    { id: "sub-18", label: "Sub-18" },
    { id: "sub-20", label: "Sub-20" },
  ];

  const cursosInscritos = [
    { id: 1, nombre: "Fútbol", horario: "Lunes y Miércoles 08:00 - 10:00" },
    { id: 2, nombre: "Vóley", horario: "Martes y Viernes 15:00 - 18:00" },
  ];

  const historialCursos = [
    { id: 1, nombre: "Básquet", año: 2024, estado: "Completado" },
    { id: 2, nombre: "Boxeo", año: 2023, estado: "Completado" },
  ];

  const horariosCursoActual =
    cursoSeleccionado && horariosPorCurso[cursoSeleccionado]
      ? horariosPorCurso[cursoSeleccionado]
      : [];

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    window.location.href = "/";
  };

  const abrirModal = (tipo) => {
    setModalAbierto(tipo);
    setMensajeCurso("");
    setCursoSeleccionado("");
    setHorarioSeleccionado("");
    setNivelSeleccionado("");
  };

  const cerrarModal = () => {
    setModalAbierto(null);
  };

  const handleRegistrarCursoSubmit = (e) => {
    e.preventDefault();

    if (!cursoSeleccionado || !horarioSeleccionado || !nivelSeleccionado) {
      setMensajeCurso("Por favor selecciona curso, horario y categoría.");
      return;
    }

    const cursoNombre =
      cursosDisponibles.find((c) => c.id === cursoSeleccionado)?.nombre || "";
    const horarioTexto =
      horariosCursoActual.find((h) => h.id === horarioSeleccionado)?.label ||
      "";
    const nivelTexto =
      niveles.find((n) => n.id === nivelSeleccionado)?.label || "";

    setMensajeCurso(
      `Tu solicitud de matrícula en ${cursoNombre} (${nivelTexto}) en el horario ${horarioTexto} ha sido registrada.`
    );
  };

  return (
    <div className="estudiante-panel">
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">Cursos Vacacionales 2025</div>

          <nav>
            <ul>
              <li>
                <button
                  type="button"
                  className="header-link-btn"
                  onClick={() => abrirModal("registrar")}
                >
                  Registrar curso
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="header-link-btn"
                  onClick={() => abrirModal("misCursos")}
                >
                  Mis cursos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="header-link-btn"
                  onClick={() => abrirModal("historial")}
                >
                  Historial
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="header-link-btn"
                  onClick={() => abrirModal("perfil")}
                >
                  Perfil
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="logout-btn"
                  type="button"
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* CONTENIDO CENTRADO */}
      <main className="contenido-principal">
        {/* BIENVENIDA */}
        <section className="bienvenida">
          <h2>
            Bienvenido(a), <span>{nombreUsuario}</span>
          </h2>
          <p>
            Desde este portal podrás matricularte en los cursos vacacionales de
            vóley, básquet, fútbol y boxeo, revisar tus inscripciones y
            consultar tu información como estudiante.
          </p>
        </section>

        {/* TARJETAS PRINCIPALES */}
        <section className="panel-contenido">
          <article
            className="tarjeta tarjeta-accion"
            onClick={() => abrirModal("registrar")}
          >
            <h3>Registrar nuevo curso</h3>
            <p>
              Elige el deporte, el horario disponible por días y la categoría
              correspondiente para completar tu matrícula.
            </p>
            <button type="button">Matricularme</button>
          </article>

          <article
            className="tarjeta tarjeta-accion"
            onClick={() => abrirModal("misCursos")}
          >
            <h3>Mis cursos actuales</h3>
            <p>Consulta rápidamente los cursos en los que estás inscrito.</p>
            <button type="button">Ver cursos</button>
          </article>

          <article
            className="tarjeta tarjeta-accion"
            onClick={() => abrirModal("historial")}
          >
            <h3>Historial de inscripciones</h3>
            <p>Revisa tus participaciones en ediciones anteriores.</p>
            <button type="button">Ver historial</button>
          </article>

          <article
            className="tarjeta tarjeta-accion"
            onClick={() => abrirModal("perfil")}
          >
            <h3>Datos del estudiante</h3>
            <p>Verifica tus datos de contacto y recomendaciones generales.</p>
            <button type="button">Ver detalle</button>
          </article>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        © 2025 Cursos Vacacionales — Portal de estudiantes
      </footer>

      {/* MODAL: REGISTRAR CURSO */}
      {modalAbierto === "registrar" && (
        <Modal title="Registrar un curso vacacional" onClose={cerrarModal}>
          <p className="modal-texto-intro">
            Hola {nombreUsuario}, completa la siguiente información para enviar
            tu solicitud de matrícula.
          </p>

          <form
            onSubmit={handleRegistrarCursoSubmit}
            className="form-registrar-curso"
          >
            <div className="campo">
              <label>Curso disponible</label>
              <select
                value={cursoSeleccionado}
                onChange={(e) => {
                  setCursoSeleccionado(e.target.value);
                  setHorarioSeleccionado("");
                }}
                required
              >
                <option value="">Selecciona un curso</option>
                {cursosDisponibles.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label>Horario por días</label>
              <select
                value={horarioSeleccionado}
                onChange={(e) => setHorarioSeleccionado(e.target.value)}
                disabled={!cursoSeleccionado}
                required
              >
                <option value="">
                  {cursoSeleccionado
                    ? "Selecciona un horario"
                    : "Primero elige un curso"}
                </option>
                {horariosCursoActual.map((horario) => (
                  <option key={horario.id} value={horario.id}>
                    {horario.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label>Categoría (edad)</label>
              <select
                value={nivelSeleccionado}
                onChange={(e) => setNivelSeleccionado(e.target.value)}
                required
              >
                <option value="">Selecciona una categoría</option>
                {niveles.map((nivel) => (
                  <option key={nivel.id} value={nivel.id}>
                    {nivel.label}
                  </option>
                ))}
              </select>
            </div>

            {mensajeCurso && (
              <p className="mensaje-curso-ok">{mensajeCurso}</p>
            )}

            <div className="modal-actions">
              <button type="submit">Enviar solicitud</button>
              <button
                type="button"
                className="btn-secundario"
                onClick={cerrarModal}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: MIS CURSOS */}
      {modalAbierto === "misCursos" && (
        <Modal title="Mis cursos actuales" onClose={cerrarModal}>
          {cursosInscritos.length === 0 ? (
            <p className="modal-texto-intro">
              Actualmente no tienes cursos inscritos. Utiliza la opción
              &quot;Registrar nuevo curso&quot; para matricularte.
            </p>
          ) : (
            <ul className="lista-cursos">
              {cursosInscritos.map((curso) => (
                <li key={curso.id}>
                  <h4>{curso.nombre}</h4>
                  <span>{curso.horario}</span>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}

      {/* MODAL: HISTORIAL */}
      {modalAbierto === "historial" && (
        <Modal title="Historial de inscripciones" onClose={cerrarModal}>
          {historialCursos.length === 0 ? (
            <p className="modal-texto-intro">
              Aún no tienes historial de cursos finalizados.
            </p>
          ) : (
            <ul className="lista-historial">
              {historialCursos.map((item) => (
                <li key={item.id}>
                  <div className="historial-nombre">{item.nombre}</div>
                  <div className="historial-detalle">
                    Año {item.año} · {item.estado}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}

      {/* MODAL: PERFIL */}
      {modalAbierto === "perfil" && (
        <Modal title="Perfil del estudiante" onClose={cerrarModal}>
          <p className="modal-texto-intro">
            Esta es una vista resumida de tus datos. Más adelante puedes enlazar
            esta información con el perfil real que devuelva tu API.
          </p>
          <div className="perfil-resumen">
            <p>
              <strong>Nombre:</strong> {nombreUsuario} Ejemplo
            </p>
            <p>
              <strong>Correo:</strong> usuario@correo.com
            </p>
            <p>
              <strong>Teléfono:</strong> 099 999 9999
            </p>
          </div>

          <div className="perfil-recomendaciones">
            <h4>Recomendaciones generales</h4>
            <ul>
              <li>Llega 10 minutos antes del inicio de cada clase.</li>
              <li>Usa ropa deportiva adecuada y lleva tu hidratación.</li>
              <li>
                Revisa tu correo frecuentemente para avisos y cambios de
                horario.
              </li>
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
}
