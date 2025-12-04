import React, { useState } from "react";
import "../../css/register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    primer_nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    email: "",
    password: "",
    password_confirmation: "",
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

    if (!formData.primer_nombre.trim())
      nuevosErrores.push("El primer nombre es obligatorio.");
    if (!formData.apellido.trim())
      nuevosErrores.push("El apellido es obligatorio.");
    if (!formData.cedula.trim())
      nuevosErrores.push("La cédula es obligatoria.");
    if (!formData.telefono.trim())
      nuevosErrores.push("El número de teléfono es obligatorio.");
    if (!formData.email.includes("@"))
      nuevosErrores.push("El correo no es válido.");
    if (formData.password.length < 6)
      nuevosErrores.push("La contraseña debe tener al menos 6 caracteres.");
    if (formData.password !== formData.password_confirmation)
      nuevosErrores.push("Las contraseñas no coinciden.");

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      setMensaje("");
      return;
    }

    setCargando(true);
    setErrores([]);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const erroresDelServidor = [];
          for (const campo in data.errors) {
            erroresDelServidor.push(
              data.errors[campo][0] || "Error desconocido"
            );
          }
          setErrores(erroresDelServidor);
        } else {
          setErrores([data.message || "Error al registrarse"]);
        }
      } else {
        setErrores([]);
        setMensaje("✅ Registro exitoso. ¡Bienvenido al portal de estudiantes!");
        
        setTimeout(() => {
          setFormData({
            primer_nombre: "",
            apellido: "",
            cedula: "",
            telefono: "",
            email: "",
            password: "",
            password_confirmation: "",
          });
          window.location.href = "/";
        }, 2000);
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

  return (
    <div className="login-horizontal-container">
      <div className="login-left">
        <h2>Crear cuenta de estudiante</h2>
        {mensaje && <p className="mensaje">{mensaje}</p>}
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
          <input
            type="text"
            name="primer_nombre"
            placeholder="Primer nombre"
            value={formData.primer_nombre}
            onChange={handleChange}
            required
            disabled={cargando}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            disabled={cargando}
          />
          <input
            type="text"
            name="cedula"
            placeholder="Cédula"
            value={formData.cedula}
            onChange={handleChange}
            required
            disabled={cargando}
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Número de teléfono"
            value={formData.telefono}
            onChange={handleChange}
            required
            disabled={cargando}
          />
          <input
            type="email"
            name="email"
            placeholder="tucorreo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={cargando}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={cargando}
          />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Repite tu contraseña"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            disabled={cargando}
          />
          <div className="botones">
            <button type="submit" disabled={cargando}>
              {cargando ? "Registrando..." : "Registrarse"}
            </button>
          </div>
        </form>
        <div className="links">
          <p>
            ¿Ya tienes una cuenta? <a href="/Login">Inicia sesión</a>
          </p>
        </div>
      </div>
      <div className="login-right">
        <img
          src="https://www.teatrocentrodearte.org/images/files/2024/0f2f6cd5-31d9-44e4-9c83-e95bf046cb9d.webp"
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