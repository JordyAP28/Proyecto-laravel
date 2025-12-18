const roles = {
  1: "Administrador",
  2: "Secretaria",
  3: "Deportista",
  4: "Entrenador",
  5: "Tutor",
};

const rolColores = {
  1: "#8b5cf6",
  2: "#f59e0b",
  3: "#3b82f6",
  4: "#6366f1",
  5: "#ec4899",
};

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const userLocal = localStorage.getItem("user");
      if (userLocal) {
        setUser(JSON.parse(userLocal));
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setLoading(false);
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8000/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {}
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) return <p style={{ padding: 40 }}>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return null;

  const nombre = user.nombre_usuario;
  const rol = roles[user.id_rol] || "Usuario";
  const colorRol = rolColores[user.id_rol] || "#6b7280";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      {/* NAV */}
      <nav style={{
        backgroundColor: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <h2>Dashboard</h2>
        <button onClick={handleLogout} style={{ background: "#ef4444", color: "#fff" }}>
          Cerrar sesión
        </button>
      </nav>

      {/* CONTENIDO */}
      <div style={{ padding: "2rem", maxWidth: "1100px", margin: "auto" }}>
        <div style={{
          background: "white",
          padding: "2rem",
          borderRadius: 12,
          marginBottom: "2rem"
        }}>
          <h1>👋 Bienvenido, {nombre}</h1>
          <p>
            Has iniciado sesión como{" "}
            <span style={{
              background: colorRol,
              color: "white",
              padding: "4px 10px",
              borderRadius: 20
            }}>
              {rol}
            </span>
          </p>
        </div>

        {/* ACCIONES */}
        <div style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: 12
        }}>
          <h3>Acciones rápidas</h3>

          <button
            onClick={() => window.location.href = "/admin/perfil"}
            style={{
              marginTop: 15,
              padding: "1rem",
              width: 220,
              borderRadius: 10,
              cursor: "pointer"
            }}
          >
            👤 Editar perfil
          </button>
        </div>
      </div>
    </div>
  );
}
