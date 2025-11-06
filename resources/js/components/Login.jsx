import React, { useState } from "react";
import "../../css/estilo_login.css"; // tu CSS original de Blade

export default function Login() {
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMensaje("Por favor ingrese un correo válido.");
    } else if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
    } else if (email === "usuario@correo.com" && password === "123456") {
      setMensaje(`Bienvenido, ${email}`);
    } else {
      setMensaje("Credenciales incorrectas.");
    }
  };

  return (
    <div className="login-horizontal-container">
      {/* Lado izquierdo */}
      <div className="login-left">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input type="email" name="email" placeholder="usuario@correo.com" required />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" name="password" placeholder="********" required />
          </div>

          <button type="submit">Ingresar</button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <div className="links">
          <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a><br />
          <a href="/register">Registrarse</a>
        </div>
      </div>

      {/* Lado derecho */}
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
