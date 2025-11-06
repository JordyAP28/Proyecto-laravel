import React, { useState } from "react";
import "../../css/Register.css"; // tu CSS original adaptado también para register

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = [];
    if (!formData.username.trim()) nuevosErrores.push("El nombre es obligatorio.");
    if (!formData.email.includes("@")) nuevosErrores.push("El correo no es válido.");
    if (formData.password.length < 6) nuevosErrores.push("La contraseña debe tener al menos 6 caracteres.");
    if (formData.password !== formData.password_confirmation) nuevosErrores.push("Las contraseñas no coinciden.");

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      setMensaje("");
      return;
    }

    console.log("Datos enviados:", formData);
    setErrores([]);
    setMensaje("✅ Registro exitoso. ¡Bienvenido al portal de estudiantes!");
  };

  return (
    <div className="login-horizontal-container">
      {/* Lado izquierdo: formulario */}
      <div className="login-left">
        <h2>Crear cuenta de estudiante</h2>

        {mensaje && <p className="mensaje">{mensaje}</p>}
        {errores.length > 0 && (
          <div className="alert">
            <ul>
              {errores.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Tu nombre completo"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="tucorreo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Repite tu contraseña"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />

          <div className="botones">
            <button type="submit">Registrarse</button>
          </div>
        </form>

        <div className="links">
          <p>
            ¿Ya tienes una cuenta? <a href="/">Inicia sesión</a>
          </p>
        </div>
      </div>

      {/* Lado derecho: imagen */}
      <div className="login-right">
        <img
          src="/images/estudiante-register.jpg"
          alt="Registro de estudiante"
        />
        <div className="info-text">
          <h1>Bienvenido al portal de estudiantes</h1>
          <p>Regístrate para acceder a tus cursos, inscripciones y más.</p>
        </div>
      </div>
    </div>
  );
}
