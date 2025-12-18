import React, { useEffect, useState } from "react";
import axios from "axios";

const roles = {
  1: "Administrador",
  2: "Entrenador",
  3: "Deportista",
  4: "Secretaria",
  5: "Tutor",
};

const estados = {
  1: "Activo",
  2: "Inactivo",
};

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    nombre_usuario: "",
    email: "",
    clave: "",
    confirmar_clave: "",
    id_rol: "",
    id_estado: "",
  });
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("user"));
    if (!usuario) return (window.location.href = "/login");

    setUser(usuario);
    setForm({
      nombre_usuario: usuario.nombre_usuario,
      email: usuario.email,
      clave: "",
      confirmar_clave: "",
      id_rol: usuario.id_rol,
      id_estado: usuario.id_estado,
    });
    setLoading(false);
  }, []);

  const validarPassword = (clave, confirmar) => {
    if (!clave && !confirmar) {
      setPasswordError("");
      return;
    }
    if (clave.length < 6) {
      setPasswordError("❌ La contraseña es muy corta (mínimo 6 caracteres)");
      return;
    }
    if (confirmar && clave !== confirmar) {
      setPasswordError("❌ Las contraseñas no coinciden");
      return;
    }
    setPasswordError("✅ Las contraseñas coinciden");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevoForm = { ...form, [name]: value };
    setForm(nuevoForm);

    if (name === "clave" || name === "confirmar_clave") {
      validarPassword(
        name === "clave" ? value : nuevoForm.clave,
        name === "confirmar_clave" ? value : nuevoForm.confirmar_clave
      );
    }
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (form.clave) {
      if (form.clave.length < 6) {
        setError("❌ La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (form.clave !== form.confirmar_clave) {
        setError("❌ Las contraseñas no coinciden");
        return;
      }
    }

    setGuardando(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        nombre_usuario: form.nombre_usuario,
        email: form.email,
        id_estado: form.id_estado,
        id_rol: form.id_rol,
      };

      if (form.clave) payload.clave = form.clave;

      const response = await axios.put(
        "http://localhost:8000/api/perfil",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setMensaje("✅ Perfil actualizado correctamente");
      setUser(response.data.usuario);
      localStorage.setItem("user", JSON.stringify(response.data.usuario));
    } catch {
      setError("❌ Error al actualizar el perfil");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p style={{ padding: 40 }}>Cargando...</p>;
  if (!user) return null;

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh", padding: "2rem" }}>
      <form
        onSubmit={guardarCambios}
        style={{
          maxWidth: 500,
          margin: "auto",
          background: "white",
          padding: "2rem",
          borderRadius: 12,
        }}
      >
        <h2>👤 Mi Perfil</h2>

        {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>Nombre de usuario</label>
        <input name="nombre_usuario" value={form.nombre_usuario} onChange={handleChange} style={input} />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} style={input} />

        <label>Nueva contraseña</label>
        <input
          name="clave"
          type="password"
          value={form.clave}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          style={input}
        />

        <label>Confirmar contraseña</label>
        <input
          name="confirmar_clave"
          type="password"
          value={form.confirmar_clave}
          onChange={handleChange}
          placeholder="Repite la contraseña"
          style={input}
        />

        {passwordError && (
          <p style={{ color: passwordError.startsWith("✅") ? "green" : "red" }}>
            {passwordError}
          </p>
        )}

        <label>Rol</label>
        <select name="id_rol" value={form.id_rol} onChange={handleChange} style={input}>
          {Object.entries(roles).map(([id, nombre]) => (
            <option key={id} value={id}>{nombre}</option>
          ))}
        </select>

        <label>Estado</label>
        <select name="id_estado" value={form.id_estado} onChange={handleChange} style={input}>
          {Object.entries(estados).map(([id, nombre]) => (
            <option key={id} value={id}>{nombre}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={guardando || passwordError.startsWith("❌")}
          style={{
            ...btn,
            opacity: guardando || passwordError.startsWith("❌") ? 0.6 : 1,
            cursor: guardando || passwordError.startsWith("❌") ? "not-allowed" : "pointer",
          }}
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}

const input = {
  width: "100%",
  padding: 8,
  marginBottom: 15,
  borderRadius: 6,
};

const btn = {
  width: "100%",
  padding: 10,
  background: "#3b82f6",
  color: "white",
  borderRadius: 8,
};
