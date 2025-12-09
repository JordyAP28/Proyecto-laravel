import React from "react";
import axios from "axios";
import "../../css/estudiante.css";

export default function EstudiantePanel() {
  const nombreUsuario = "María"; 

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    window.location.href = "/";
  };

  return (
    <div className="estudiante-panel">

      {/* HEADER */}
      <header className="header">
        <div className="logo">Cursos Vacacionales</div>

        <nav>
          <ul>
            <li><a href="/curso">Mis Cursos</a></li>
            <li><a href="/perfil">Perfil</a></li>
            <li><a href="/historial">Historial</a></li>

            <li>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* BIENVENIDA */}
      <section className="bienvenida">
        <h2>Bienvenido(a), <span>{nombreUsuario}</span></h2>
        <p>Este es tu panel personal dentro del sistema de Cursos Vacacionales.  
          Aquí podrás gestionar tu información y revisar tus cursos.</p>
      </section>

      {/* TARJETAS PRINCIPALES */}
      <main className="panel-contenido">

        <div className="tarjeta">
          <h3>📘 Mis Cursos</h3>
          <p>Visualiza tus cursos activos y horarios.</p>
          <a href="/curso">Entrar</a>
        </div>

        <div className="tarjeta">
          <h3>👤 Mi Perfil</h3>
          <p>Edita tus datos personales y de contacto.</p>
          <a href="/perfil">Gestionar</a>
        </div>

        <div className="tarjeta">
          <h3>📜 Historial</h3>
          <p>Consulta tus cursos anteriores y certificados.</p>
          <a href="/historial">Ver historial</a>
        </div>

        <div className="tarjeta">
          <h3>🔔 Notificaciones</h3>
          <p>Mira avisos importantes del programa.</p>
          <button>Revisar</button>
        </div>

      </main>

      <footer>
        © 2025 Cursos Vacacionales — Plataforma Estudiantil
      </footer>
    </div>
  );
}
