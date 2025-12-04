import React, { useState, useEffect } from "react";
import "../../css/perfil.css";

export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    id: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    curso: "",
    fechaRegistro: "",
    foto: ""
  });

  // ================= FETCH Real Desde BD =================
  useEffect(() => {
    /*
    fetch("/api/usuario/perfil")
      .then(res => res.json())
      .then(data => setUser(data));
    */
  }, []);
  // =======================================================

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    setEditMode(false);

    /*
    fetch("/api/usuario/actualizar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    */
  };

  return (
    <div className="perfil-container">

      {/* ======================= BARRA SUPERIOR ======================= */}
      <div className="perfil-header">
        <h2>Perfil del Usuario</h2>

        <a href="/estudiante" className="btn-volver">
          ⬅ Regresar a Estudiante
        </a>
      </div>

      {/* ======================= TARJETA CENTRAL ======================= */}
      <div className="perfil-card">

        {/* FOTO */}
        <div className="perfil-foto">
          <img
            src={
              user.foto
                ? user.foto
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Foto del Usuario"
          />

          {editMode && (
            <input
              type="text"
              name="foto"
              placeholder="URL de foto"
              value={user.foto}
              onChange={handleChange}
            />
          )}
        </div>

        {/* INFORMACIÓN */}
        <div className="perfil-info">
          <div className="info-group">
            <label>Nombre</label>
            {editMode ? (
              <input type="text" name="nombre" value={user.nombre} onChange={handleChange} />
            ) : (
              <p>{user.nombre || "—"}</p>
            )}
          </div>

          <div className="info-group">
            <label>Apellido</label>
            {editMode ? (
              <input type="text" name="apellido" value={user.apellido} onChange={handleChange} />
            ) : (
              <p>{user.apellido || "—"}</p>
            )}
          </div>

          <div className="info-group">
            <label>Correo</label>
            {editMode ? (
              <input type="email" name="email" value={user.email} onChange={handleChange} />
            ) : (
              <p>{user.email || "—"}</p>
            )}
          </div>

          <div className="info-group">
            <label>Teléfono</label>
            {editMode ? (
              <input type="text" name="telefono" value={user.telefono} onChange={handleChange} />
            ) : (
              <p>{user.telefono || "—"}</p>
            )}
          </div>

          <div className="info-group">
            <label>Dirección</label>
            {editMode ? (
              <input type="text" name="direccion" value={user.direccion} onChange={handleChange} />
            ) : (
              <p>{user.direccion || "—"}</p>
            )}
          </div>

          <div className="info-group">
            <label>Curso Inscrito</label>
            {editMode ? (
              <input type="text" name="curso" value={user.curso} onChange={handleChange} />
            ) : (
              <p>{user.curso || "—"}</p>
            )}
          </div>

          <div className="info-group">
            <label>Fecha de Registro</label>
            <p>{user.fechaRegistro || "—"}</p>
          </div>
        </div>

        {/* BOTONES */}
        <div className="perfil-botones">
          {!editMode ? (
            <button className="btn-edit" onClick={() => setEditMode(true)}>
              Editar Perfil
            </button>
          ) : (
            <>
              <button className="btn-save" onClick={guardarCambios}>Guardar Cambios</button>
              <button className="btn-cancel" onClick={() => setEditMode(false)}>
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
