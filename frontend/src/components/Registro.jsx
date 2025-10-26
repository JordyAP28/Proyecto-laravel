import React, { useState } from "react";
import axios from "axios";
import "../assets/css/Registro.css";

export const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    curso: "",
    password: "",
    confirmarPassword: "",
    rol: "Usuario",
    foto: null,
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "foto") {
      setFormData({ ...formData, foto: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validarCampos = () => {
    // Nombre y Apellido solo letras
    const letras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!letras.test(formData.nombre)) return "Nombre inválido (solo letras).";
    if (!letras.test(formData.apellido)) return "Apellido inválido (solo letras).";

    // Edad solo números
    if (!/^\d+$/.test(formData.edad)) return "Edad inválida (solo números).";

    // Fecha de nacimiento formato YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.fechaNacimiento)) return "Fecha de nacimiento inválida (2004-10-04).";

    // Teléfono mínimo 10 dígitos
    if (!/^\d{10,}$/.test(formData.telefono)) return "Teléfono inválido (mínimo 10 dígitos).";

    // Email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Email inválido.";

    // Contraseña mínimo 6 caracteres y debe coincidir
    if (formData.password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    if (formData.password !== formData.confirmarPassword) return "Las contraseñas no coinciden.";

    // Curso seleccionado
    if (!formData.curso) return "Debe seleccionar un curso.";
    // Foto
    if (!formData.foto) return "Debe subir una foto.";

    // Dirrecion
    if (!formData.dirrecion) return "Ingrese su dirrecion.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validarCampos();
    if (error) {
      setMensaje(error);
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await axios.post("http://localhost:8000/api/registro", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMensaje(res.data.message);
      setFormData({
        nombre: "",
        apellido: "",
        edad: "",
        email: "",
        telefono: "",
        fechaNacimiento: "",
        curso: "",
        password: "",
        confirmarPassword: "",
        rol: "Usuario",
        foto: null,
      });
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="registro-horizontal-container">
      <div className="imagen-lado">
        <img src="https://tse4.mm.bing.net/th/id/OIP.F7fZwAaY6dyjhKQF1G4aOQHaFu?w=750&h=580&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Verano" />
      </div>
      <div className="form-lado">
        <h2>Inscripción</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required />
          <input type="text" name="edad" placeholder="Edad" value={formData.edad} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
          <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />
          <input type="text" name="fechaNacimiento" placeholder="Fecha de nacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
          <input type="text" name="dirrecion" placeholder="Dirrecion" value={formData.dirrecion} onChange={handleChange} required />
          <select name="curso" value={formData.curso} onChange={handleChange} required>
            <option value="">Seleccione un curso</option>
            <option value="Pintura">Pintura</option>
            <option value="Basquetbol">Basquetbol</option>
            <option value="Futbol">Futbol</option>
            <option value="Música">Música</option>
          </select>
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmarPassword" placeholder="Confirmar contraseña" value={formData.confirmarPassword} onChange={handleChange} required />
          <input type="file" name="foto" accept="image/*" onChange={handleChange} />
          <div className="botones">
            <button type="submit">Registrarse</button>
            <button type="button" className="btn-inicio" onClick={() => window.location.href = "/login"}>Ir a Inicio</button>
          </div>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </div>
    </div>
  );
};
