import React, { useState } from "react";
import "../../css/reestablecer.css"; // asegúrate de que tu CSS esté en resources/css/

export default function ReestablecerContrasena() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    console.log({ token, password, confirmPassword });
    setMensaje("Contraseña actualizada correctamente.");
  };

  return (
    <div className="reestablecer-container">
      <h2>Reestablecer Contraseña</h2>

      <form onSubmit={handleSubmit}>
        <label>Código de verificación:</label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Ingresa el código que recibiste"
          required
        />

        <label>Nueva contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa la nueva contraseña"
          required
        />

        <label>Confirmar contraseña:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirma la contraseña"
          required
        />

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <button type="submit">Actualizar contraseña</button>
      </form>

      <p>
        <a href="/login">Volver al inicio de sesión</a>
      </p>
    </div>
  );
}
