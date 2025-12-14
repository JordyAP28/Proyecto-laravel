import React, { useState } from "react";
import "../../css/perfil.css";

export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [fotoPreview, setFotoPreview] = useState(null);

  const [user, setUser] = useState({
    nombre: "María",
    apellido: "Mero",
    email: "maria.mero@email.com",
    telefono: "0999999999",
    direccion: "Manta, Ecuador",
    curso: "Fútbol Vacacional",
    fechaRegistro: "2024-02-10"
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const guardarCambios = () => {
    setEditMode(false);
    // Aquí enviarías los datos + foto al backend
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h2>Mi Perfil</h2>
        <a href="/estudiante" className="btn-volver">⬅ Volver</a>
      </div>

      <div className="perfil-card">
        {/* FOTO */}
        <div className="perfil-foto">
          <img
            src={
              fotoPreview ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Foto perfil"
          />

          {editMode && (
            <label className="upload-btn">
              Cambiar foto
              <input type="file" accept="image/*" onChange={handleFotoChange} />
            </label>
          )}
        </div>

        {/* DATOS */}
        <div className="perfil-info">
          {[
            ["Nombre", "nombre"],
            ["Apellido", "apellido"],
            ["Correo", "email"],
            ["Teléfono", "telefono"],
            ["Dirección", "direccion"],
            ["Curso", "curso"]
          ].map(([label, field]) => (
            <div className="info-group" key={field}>
              <label>{label}</label>
              {editMode ? (
                <input
                  type="text"
                  name={field}
                  value={user[field]}
                  onChange={handleChange}
                />
              ) : (
                <p>{user[field]}</p>
              )}
            </div>
          ))}

          <div className="info-group">
            <label>Fecha de Registro</label>
            <p>{user.fechaRegistro}</p>
          </div>
        </div>

        {/* BOTONES */}
        <div className="perfil-botones">
          {!editMode ? (
            <button className="btn-edit" onClick={() => setEditMode(true)}>
              ✏️ Editar Perfil
            </button>
          ) : (
            <>
              <button className="btn-save" onClick={guardarCambios}>
                💾 Guardar
              </button>
              <button className="btn-cancel" onClick={() => setEditMode(false)}>
                ✖ Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
