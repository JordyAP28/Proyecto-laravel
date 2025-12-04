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

  // ===== FETCH Real Para BD =====
  useEffect(() => {
    /*
    Ejemplo cuando conectes tu API:

    fetch("/api/usuario/perfil")
      .then(res => res.json())
      .then(data => setUser(data));
    */
  }, []);
  // ==============================

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambios = () => {
    setEditMode(false);

    /*
    POST o PUT para guardar en BD:

    fetch("/api/usuario/actualizar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    */
  };

  return (
    <div className="perfil-container">

      <div className="perfil-card">

        {/* ================== FOTO ================== */}
        <div className="perfil-foto">
          <img
            src={
              user.foto
                ? user.foto
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Foto del usuario"
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

        {/* ================== TITULO ================== */}
        <h2>Mi Perfil</h2>

        {/* ================== INFORMACIÓN ================== */}
        <div className="perfil-info">
          <label>Nombre:</label>
          {editMode ? (
            <input type="text" name="nombre" value={user.nombre} onChange={handleChange} />
          ) : (
            <p>{user.nombre || "—"}</p>
          )}

          <label>Apellido:</label>
          {editMode ? (
            <input type="text" name="apellido" value={user.apellido} onChange={handleChange} />
          ) : (
            <p>{user.apellido || "—"}</p>
          )}

          <label>Correo:</label>
          {editMode ? (
            <input type="email" name="email" value={user.email} onChange={handleChange} />
          ) : (
            <p>{user.email || "—"}</p>
          )}

          <label>Teléfono:</label>
          {editMode ? (
            <input type="text" name="telefono" value={user.telefono} onChange={handleChange} />
          ) : (
            <p>{user.telefono || "—"}</p>
          )}

          <label>Dirección:</label>
          {editMode ? (
            <input type="text" name="direccion" value={user.direccion} onChange={handleChange} />
          ) : (
            <p>{user.direccion || "—"}</p>
          )}

          <label>Curso Inscrito:</label>
          {editMode ? (
            <input type="text" name="curso" value={user.curso} onChange={handleChange} />
          ) : (
            <p>{user.curso || "—"}</p>
          )}

          <label>Fecha de Registro:</label>
          <p>{user.fechaRegistro || "—"}</p>
        </div>

        {/* ================== BOTONES ================== */}
        <div className="perfil-botones">
          {!editMode ? (
            <button className="btn-edit" onClick={() => setEditMode(true)}>
              Editar Perfil
            </button>
          ) : (
            <>
              <button className="btn-save" onClick={guardarCambios}>Guardar Cambios</button>
              <button className="btn-cancel" onClick={() => setEditMode(false)}>Cancelar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
