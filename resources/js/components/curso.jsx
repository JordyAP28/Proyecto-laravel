import React, { useEffect, useState } from "react";
import "../../css/cursos.css";


export default function Courses() {
  const [cursos, setCursos] = useState([]);
  const [horario, setHorario] = useState([]);

  // ------------------------------
  // CARGAR DATOS DESDE LA BASE
  // ------------------------------
  useEffect(() => {
    // Aquí conectas API o backend
    // Ejemplo de cómo debes traer los datos REALES:

    fetch("http://localhost:3000/api/cursos")
      .then((res) => res.json())
      .then((data) => setCursos(data));

    fetch("http://localhost:3000/api/horario")
      .then((res) => res.json())
      .then((data) => setHorario(data));
  }, []);

  return (
    <div className="courses-container">

      {/* Barra superior */}
      <header className="courses-header">
        <h2>Cursos del Estudiante</h2>

        <nav className="top-buttons">
          <a href="/estudiante" className="btn-back">
            ⬅ Regresar a Estudiante
          </a>
        </nav>
      </header>

      {/* Contenido Principal */}
      <div className="content-wrapper">

        {/* Tabla de cursos */}
        <div className="cursos-section">
          <h3>Lista de Cursos</h3>

          <table className="tabla-cursos">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Docente</th>
                <th>Créditos</th>
                <th>Aula</th>
              </tr>
            </thead>

            <tbody>
              {cursos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-msg">
                    No hay cursos registrados.
                  </td>
                </tr>
              ) : (
                cursos.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td>{c.docente}</td>
                    <td>{c.creditos}</td>
                    <td>{c.aula}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Calendario / Horario */}
        <div className="horario-section">
          <h3>Horario del Estudiante</h3>

          <div className="horario-box">
            {horario.length === 0 ? (
              <p className="empty-msg">No hay horario registrado.</p>
            ) : (
              horario.map((h) => (
                <div className="horario-item" key={h.id}>
                  <strong>{h.dia}</strong>
                  <p>{h.curso}</p>
                  <span>{h.hora_inicio} - {h.hora_fin}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
