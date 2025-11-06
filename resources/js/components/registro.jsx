import React, { useState } from "react";
import "../../css/registro.css"; // tu CSS adaptado

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    curso: "",
    password: "",
    password_confirmation: "",
    pago: "",
    comprobante: null,
  });

  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas
    const nuevosErrores = [];
    if (!formData.nombre.trim()) nuevosErrores.push("El nombre es obligatorio.");
    if (!formData.correo.includes("@")) nuevosErrores.push("El correo no es válido.");
    if (!formData.curso) nuevosErrores.push("Debe seleccionar un curso.");
    if (formData.password.length < 6)
      nuevosErrores.push("La contraseña debe tener al menos 6 caracteres.");
    if (formData.password !== formData.password_confirmation)
      nuevosErrores.push("Las contraseñas no coinciden.");
    if (!formData.pago) nuevosErrores.push("Debe indicar si realizó el pago.");

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      setMensaje("");
      return;
    }

    console.log("Datos enviados:", formData);
    setErrores([]);
    setMensaje("✅ Registro completado correctamente. ¡Bienvenido al curso vacacional!");
  };

  return (
    <div className="registro-container">
      <div className="registro-box">
        <h2>Registro de Estudiante</h2>

        {mensaje && <div className="mensaje">{mensaje}</div>}

        {errores.length > 0 && (
          <div className="mensaje">
            <ul>
              {errores.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Curso a inscribirse</label>
            <select
              name="curso"
              value={formData.curso}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un curso</option>
              <option value="futbol">Fútbol</option>
              <option value="basquetbol">Básquetbol</option>
              <option value="volleyball">Vóleibol</option>
            </select>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>¿Has realizado el pago?</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="pago"
                  value="si"
                  checked={formData.pago === "si"}
                  onChange={handleChange}
                />{" "}
                Sí
              </label>
              <label>
                <input
                  type="radio"
                  name="pago"
                  value="no"
                  checked={formData.pago === "no"}
                  onChange={handleChange}
                />{" "}
                No
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Adjuntar comprobante de pago</label>
            <input
              type="file"
              name="comprobante"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="register-btn">
            Registrarse
          </button>
        </form>

        <div className="login-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
}
