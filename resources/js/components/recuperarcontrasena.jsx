import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/recuperar.css"; // Importa tu CSS personalizado

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Se envió un enlace al correo: ${email}`);
    // Aquí luego puedes conectar con tu backend Laravel por API
  };

  return (
    <div className="recuperar-page">
      <div className="recuperar-container">
        <h2>Recuperar Contraseña</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
            required
          />

          <button type="submit">Enviar enlace</button>
        </form>

        <p className="info-link">
          ¿Ya recibiste el código?{" "}
          <Link to="/reestablecer">Haz clic aquí</Link>
        </p>

        <p className="info-link">
          <Link to="/">Volver al inicio</Link>
        </p>
      </div>
    </div>
  );
}

