import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../css/estilo_login.css";

export default function Login() {
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    // Validación básica
    if (!email || !password) {
      setErrores(["Por favor completa todos los campos"]);
      return;
    }

    setCargando(true);
    setErrores([]);
    setMensaje("");

    try {
      console.log("📤 Intentando login con:", { email });

      const response = await axios.post(
        "http://localhost:8000/api/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      console.log("✅ Respuesta del servidor:", response.data);

      // Guardar token y datos del usuario
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.usuario));

        setMensaje("✔ Inicio de sesión exitoso. Redirigiendo...");

        setTimeout(() => {
          const usuario = response.data.usuario;

          const rutasPorRol = {
            1: "/admin/dashboard",
            2: "/entrenador/dashboard",
            3: "/Estudiante",
            4: "/secretaria/dashboard",
            5: "/tutor/dashboard",
          };

          const rutaDestino = rutasPorRol[usuario.id_rol] || "/dashboard";

          console.log("👤 ID Rol:", usuario.id_rol);
          console.log("🎯 Redirigiendo a:", rutaDestino);

          navigate(rutaDestino);
        }, 1000);

      } else {
        setErrores(["No se recibió el token de autenticación"]);
      }

    } catch (error) {
      console.error("❌ Error de login:", error);

      if (error.response) {
        console.error("❌ Respuesta del servidor:", error.response.data);
        
        const nuevosErrores = [];

        // Manejar diferentes tipos de errores
        if (error.response.status === 401) {
          nuevosErrores.push("Credenciales incorrectas. Verifica tu email y contraseña.");
        } else if (error.response.status === 422) {
          // Errores de validación
          if (error.response.data.errors) {
            for (const campo in error.response.data.errors) {
              nuevosErrores.push(error.response.data.errors[campo][0]);
            }
          } else if (error.response.data.message) {
            nuevosErrores.push(error.response.data.message);
          }
        } else if (error.response.data.message) {
          nuevosErrores.push(error.response.data.message);
        } else {
          nuevosErrores.push("Error al iniciar sesión. Intenta de nuevo.");
        }

        setErrores(nuevosErrores);
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
        setErrores(["No se puede conectar al servidor. Verifica que Laravel esté corriendo."]);
      } else {
        console.error("❌ Error:", error.message);
        setErrores(["Error de conexión con el servidor"]);
      }
    } finally {
      setCargando(false);
    }
  };

  const handleBack = () => {
    window.history.back();
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

        {mensaje && <p className="mensaje-ok">{mensaje}</p>}
        
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
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              placeholder="Ingresa tu correo"
              required 
              disabled={cargando}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              placeholder="Ingresa tu contraseña"
              required 
              disabled={cargando}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={cargando}>
            {cargando ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>

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