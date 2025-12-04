import React, { useState } from "react";
import "../../css/registro.css";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    curso: "",
    password: "",
    password_confirmation: "",
    pago: "",
    foto: null,
    comprobante: null,
  });

  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState([]);
  const [mostrarPagoInfo, setMostrarPagoInfo] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

    if (name === "pago" && value === "no") {
      setMostrarPagoInfo(true);
    } else if (name === "pago" && value === "si") {
      setMostrarPagoInfo(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = [];
    if (!formData.nombre.trim()) nuevosErrores.push("El nombre es obligatorio.");
    if (!formData.correo.includes("@")) nuevosErrores.push("El correo no es válido.");
    if (!formData.curso) nuevosErrores.push("Debe seleccionar un curso.");
    if (formData.password.length < 6)
      nuevosErrores.push("La contraseña debe tener al menos 6 caracteres.");
    if (formData.password !== formData.password_confirmation)
      nuevosErrores.push("Las contraseñas no coinciden.");
    if (!formData.pago) nuevosErrores.push("Debe indicar si realizó el pago.");
    if (!formData.foto) nuevosErrores.push("Debe subir su foto de perfil.");

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      setMensaje("");
      return;
    }

    console.log("Datos enviados:", formData);

    setErrores([]);
    setMensaje(" Registro completado correctamente.");
  };

  return (
    <div className="registro-container">
      <div className="registro-box">
        <h2>Registro de Estudiante</h2>

        {mensaje && <div className="mensaje">{mensaje}</div>}

        {errores.length > 0 && (
          <div className="mensaje error">
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
            <select name="curso" value={formData.curso} onChange={handleChange} required>
              <option value="">Seleccione un curso</option>
              <option value="futbol">Fútbol</option>
              <option value="basquetbol">Básquetbol</option>
              <option value="volleyball">Vóleibol</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subir foto de perfil</label>
            <input type="file" name="foto" accept="image/*" onChange={handleChange} required />
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
                />
                Sí
              </label>

              <label>
                <input
                  type="radio"
                  name="pago"
                  value="no"
                  checked={formData.pago === "no"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Adjuntar comprobante (opcional si aún no paga)</label>
            <input type="file" name="comprobante" accept="image/*" onChange={handleChange} />
          </div>

          <button type="submit" className="register-btn">
            Registrarse
          </button>
        </form>

        <div className="login-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </div>

      {/* Modal de información de pago */}
      {mostrarPagoInfo && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Información de Pago</h3>
            <p>Debe realizar el pago para completar su inscripción.</p>

            <ul className="lista-pago">
              <li><strong>Número de cuenta:</strong> 1234567890</li>
              <li><strong>Banco:</strong> Banco Pichincha</li>
              <li><strong>Titular:</strong> Vacacionales ULEAM</li>
              <li><strong>Monto:</strong> $25.00</li>
            </ul>

            <button className="cerrar-modal" onClick={() => setMostrarPagoInfo(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
