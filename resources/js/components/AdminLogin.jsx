import React, { useState } from "react";
import "../../css/admin_login.css";

export default function AdminLogin({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = [];

    if (!formData.usuario.trim())
      nuevosErrores.push("El usuario es obligatorio.");
    if (!formData.password.trim())
      nuevosErrores.push("La contraseña es obligatoria.");

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      setMensaje("");
      return;
    }

    setCargando(true);
    setErrores([]);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrores([data.message || "Error al autenticarse"]);
        setMensaje("");
      } else {
        // Guardar token en localStorage
        localStorage.setItem("admin_token", data.token);
        setErrores([]);
        setMensaje("Autenticación exitosa");
        
        // Llamar función para mostrar el panel
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
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

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="login-horizontal-container">
      <button type="button" className="close-button" onClick={handleBack}>
        ✕
      </button>

      <div className="login-left">
        <h2>Iniciar Sesión - Administrador</h2>

        {mensaje && <p className="mensaje-success">{mensaje}</p>}
        {errores.length > 0 && (
          <div className="alert" role="alert">
            <ul>
              {errores.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Usuario o Email</label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
              disabled={cargando}
              placeholder="admin o tu@email.com"
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={cargando}
              placeholder="Tu contraseña"
            />
          </div>

          <button type="submit" disabled={cargando}>
            {cargando ? "Autenticando..." : "Ingresar"}
          </button>
        </form>

        <div className="links">
          <p>
            ¿No eres administrador? <a href="/">Volver atrás</a>
          </p>
        </div>
      </div>

      <div className="login-right">
        <img
          src="https://www.teatrocentrodearte.org/images/files/2024/0f2f6cd5-31d9-44e4-9c83-e95bf046cb9d.webp"
          alt="Panel de Administración"
        />
        <div className="info-text">
          <h1>Panel de Administración</h1>
          <p>Gestiona usuarios, cursos e información de tu sistema</p>
        </div>
      </div>
    </div>
  );
}