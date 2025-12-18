import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/perfil.css";

export default function UserProfile() {
  const [editMode, setEditMode] = useState(false);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState([]);

  const [user, setUser] = useState({
    id_usuario: null,
    primer_nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    cedula: "",
    nombre_usuario: "",
    id_rol: null,
    id_estado: null
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      setCargando(true);
      
      // Obtener datos del usuario desde localStorage
      const userLocal = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!userLocal || !token) {
        setErrores(["No hay sesión activa. Por favor inicia sesión."]);
        return;
      }

      // Obtener datos actualizados del servidor
      const response = await axios.get(
        `http://localhost:8000/api/usuarios/${userLocal.id_usuario}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.data);
        console.log("✅ Datos del usuario cargados:", response.data.data);
      }
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      if (error.response?.status === 401) {
        setErrores(["Sesión expirada. Por favor inicia sesión nuevamente."]);
      } else {
        setErrores(["Error al cargar los datos del perfil."]);
      }
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrores(["La imagen no debe superar 2MB"]);
        return;
      }
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const guardarCambios = async () => {
    try {
      setGuardando(true);
      setErrores([]);
      setMensaje("");

      const token = localStorage.getItem("token");

      if (!token) {
        setErrores(["No hay sesión activa."]);
        return;
      }

      // Preparar datos a enviar
      const datosActualizar = {
        primer_nombre: user.primer_nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        cedula: user.cedula,
        nombre_usuario: user.nombre_usuario || user.email,
      };

      console.log("📤 Enviando datos:", datosActualizar);

      const response = await axios.put(
        `http://localhost:8000/api/usuarios/${user.id_usuario}`,
        datosActualizar,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("✅ Perfil actualizado:", response.data.data);
        
        // Actualizar localStorage con los nuevos datos
        localStorage.setItem("user", JSON.stringify(response.data.data));
        
        setUser(response.data.data);
        setMensaje("✔ Perfil actualizado exitosamente");
        setEditMode(false);

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch (error) {
      console.error("❌ Error al guardar:", error);

      const nuevosErrores = [];

      if (error.response) {
        if (error.response.status === 422) {
          // Errores de validación
          if (error.response.data.errors) {
            for (const campo in error.response.data.errors) {
              nuevosErrores.push(...error.response.data.errors[campo]);
            }
          } else if (error.response.data.message) {
            nuevosErrores.push(error.response.data.message);
          }
        } else if (error.response.status === 401) {
          nuevosErrores.push("Sesión expirada. Por favor inicia sesión nuevamente.");
        } else if (error.response.data.message) {
          nuevosErrores.push(error.response.data.message);
        } else {
          nuevosErrores.push("Error al actualizar el perfil.");
        }
      } else {
        nuevosErrores.push("Error de conexión con el servidor.");
      }

      setErrores(nuevosErrores);
    } finally {
      setGuardando(false);
    }
  };

  const cancelarEdicion = () => {
    setEditMode(false);
    setFotoPreview(null);
    setErrores([]);
    setMensaje("");
    cargarDatosUsuario(); // Recargar datos originales
  };

  if (cargando) {
    return (
      <div className="perfil-container">
        <div className="perfil-card" style={{ textAlign: "center", padding: "50px" }}>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h2>Mi Perfil</h2>
        <button onClick={() => window.history.back()} className="btn-volver">
          ⬅ Volver
        </button>
      </div>

      <div className="perfil-card">
        {/* MENSAJES */}
        {mensaje && <div className="mensaje-ok">{mensaje}</div>}
        
        {errores.length > 0 && (
          <div className="alert">
            <ul>
              {errores.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

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
          <div className="info-group">
            <label>Nombre</label>
            {editMode ? (
              <input
                type="text"
                name="primer_nombre"
                value={user.primer_nombre}
                onChange={handleChange}
                required
              />
            ) : (
              <p>{user.primer_nombre}</p>
            )}
          </div>

          <div className="info-group">
            <label>Apellido</label>
            {editMode ? (
              <input
                type="text"
                name="apellido"
                value={user.apellido}
                onChange={handleChange}
                required
              />
            ) : (
              <p>{user.apellido}</p>
            )}
          </div>

          <div className="info-group">
            <label>Cédula</label>
            {editMode ? (
              <input
                type="text"
                name="cedula"
                value={user.cedula}
                onChange={handleChange}
                maxLength="10"
                required
              />
            ) : (
              <p>{user.cedula}</p>
            )}
          </div>

          <div className="info-group">
            <label>Correo</label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            ) : (
              <p>{user.email}</p>
            )}
          </div>

          <div className="info-group">
            <label>Teléfono</label>
            {editMode ? (
              <input
                type="text"
                name="telefono"
                value={user.telefono}
                onChange={handleChange}
                maxLength="15"
                required
              />
            ) : (
              <p>{user.telefono}</p>
            )}
          </div>

          <div className="info-group">
            <label>Usuario</label>
            <p>{user.nombre_usuario}</p>
          </div>

          <div className="info-group info-readonly">
            <label>Rol</label>
            <p className="readonly-field">{user.rol?.rol || "No asignado"}</p>
          </div>

          <div className="info-group info-readonly">
            <label>Estado</label>
            <p className="readonly-field">{user.estado?.estado || "No asignado"}</p>
          </div>
        </div>

        {/* BOTONES */}
        <div className={`perfil-botones ${!editMode ? 'single-button' : ''}`}>
          {!editMode ? (
            <button className="btn-edit" onClick={() => setEditMode(true)}>
              ✏️ Editar Perfil
            </button>
          ) : (
            <>
              <button 
                className="btn-save" 
                onClick={guardarCambios}
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "💾 Guardar"}
              </button>
              <button 
                className="btn-cancel" 
                onClick={cancelarEdicion}
                disabled={guardando}
              >
                ✖ Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}