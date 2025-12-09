import React, { useState } from "react";
import axios from "axios";
import "../../css/estilo_login.css";

export default function Login() {
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      // Guardar token
      localStorage.setItem("token", response.data.token);

      setMensaje("Inicio de sesión exitoso");

      // Redirigir al panel
      window.location.href = "/estudiante";
    } catch (error) {
      if (error.response) {
        setMensaje(error.response.data.message);
      } else {
        setMensaje("Error de conexión con el servidor");
      }
    }
  };

  const handleBack = () => {
    window.history.back(); // retrocede a la página anterior
  };

  return (
    <div className="login-horizontal-container">
      {/* Botón X arriba a la derecha */}
      <button
        type="button"
        className="close-button"
        onClick={handleBack}
      >
        ✕
      </button>

      <div className="login-left">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input type="email" name="email" required />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" name="password" required />
          </div>

          <button type="submit">Ingresar</button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <div className="links">
          <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a><br />
          <a href="/register">Registrarse</a>
        </div>
      </div>

      <div className="login-right">
        <img
          src="https://www.teatrocentrodearte.org/images/files/2024/0f2f6cd5-31d9-44e4-9c83-e95bf046cb9d.webp"
          alt="Cursos Vacacionales"
        />
        <div className="info-text">
          <h1>Cursos Vacacionales 2025</h1>
          <p>Aprende, diviértete y aprovecha tus vacaciones con nosotros</p>
        </div>
      </div>
    </div>
  );
}
