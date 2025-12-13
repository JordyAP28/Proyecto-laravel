import React, { useEffect, useState } from "react";
import "../../css/historial.css";

export default function HistorialEstudiante() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    // ===== CONEXIÓN REAL A BACKEND =====
    /*
    fetch("/api/estudiante/historial")
      .then(res => res.json())
      .then(data => setHistorial(data));
    */

    // ===== DATOS DE PRUEBA =====
    setHistorial([
      {
        id: 1,
        curso: "Fútbol",
        horario: "Lunes y Miércoles 08:00 - 10:00",
        estado: "Finalizado",
        fecha: "2024-02-15"
      },
      {
        id: 2,
        curso: "Vóley",
        horario: "Martes y Viernes 15:00 - 18:00",
        estado: "Activo",
        fecha: "2024-06-01"
      }
    ]);
  }, []);

  return (
    <div className="historial-container">
      {/* ===== CABECERA ===== */}
      <header className="historial-header">
        <h1>📜 Historial de Cursos</h1>
        <a href="/estudiante" className="btn-volver">
          ⬅ Volver al Panel
        </a>
      </header>

      {/* ===== TABLA ===== */}
      <div className="tabla-box">
        <table>
          <thead>
            <tr>
              <th>Curso</th>
              <th>Horario</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {historial.length > 0 ? (
              historial.map((item) => (
                <tr key={item.id}>
                  <td>{item.curso}</td>
                  <td>{item.horario}</td>
                  <td>{item.fecha}</td>
                  <td>
                    <span
                      className={`estado ${
                        item.estado === "Activo" ? "activo" : "finalizado"
                      }`}
                    >
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="sin-datos">
                  No hay historial registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
