
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

  // Login automático tras registro
  const doAutoLogin = async (email, password) => {
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const dataLogin = await resp.json();

      if (!resp.ok || !dataLogin.success) {
        setErrores([dataLogin.message ?? "Error al iniciar sesión automáticamente"]);
        window.location.href = "/Login";
        return;
      }

      // Guarda datos mínimos de sesión
      localStorage.setItem("user", JSON.stringify(dataLogin.data));
      // Si luego usas Sanctum y el backend devuelve token:
      // localStorage.setItem("token", dataLogin.data?.token);

      // Redirige al panel de estudiante
      window.location.href = "/estudiante";
    } catch (e) {
      console.error("Error en auto-login:", e);
      setErrores(["Error al iniciar sesión automáticamente."]);
      window.location.href = "/Login";
    }
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
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const erroresDelServidor = [];
          for (const campo in data.errors) {
            erroresDelServidor.push(data.errors[campo][0] ?? "Error desconocido");
          }
          setErrores(erroresDelServidor);
        } else {
          setErrores([data.message ?? "Error al registrarse"]);
        }
      } else {
        // Registro OK: mensaje + login automático + redirección a /estudiante
        setErrores([]);
        setMensaje("✅ Registro exitoso. ¡Bienvenido al portal de estudiantes!");

        await doAutoLogin(formData.email, formData.password);

        // Limpia el formulario (opcional)
        setFormData({
          primer_nombre: "",
          apellido: "",
          cedula: "",
          telefono: "",
          email: "",
          password: "",
          password_confirmation: "",
        });
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
    {/* Botón X arriba a la derecha */}
    <button
      type="button"
      className="close-button"
      onClick={handleBack}
    >
      ✕
    </button>

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
        <input type="text" name="primer_nombre" placeholder="Primer nombre"
          value={formData.primer_nombre} onChange={handleChange} disabled={cargando} />

        <input type="text" name="apellido" placeholder="Apellido"
          value={formData.apellido} onChange={handleChange} disabled={cargando} />

        <input type="text" name="cedula" placeholder="Cédula"
          value={formData.cedula} onChange={handleChange} disabled={cargando} />

        <input type="text" name="telefono" placeholder="Número de teléfono"
          value={formData.telefono} onChange={handleChange} disabled={cargando} />

        <input type="email" name="email" placeholder="tucorreo@ejemplo.com"
          value={formData.email} onChange={handleChange} disabled={cargando} />

        <input type="password" name="password" placeholder="Contraseña"
          value={formData.password} onChange={handleChange} disabled={cargando} />

        <input type="password" name="password_confirmation" placeholder="Repite tu contraseña"
          value={formData.password_confirmation} onChange={handleChange} disabled={cargando} />

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
        alt="Estudiantes"
      />
      <h1>Bienvenido al portal de estudiantes</h1>
      <p>Regístrate para acceder a tus cursos, inscripciones y más.</p>
    </div>
  </div>
);

}
