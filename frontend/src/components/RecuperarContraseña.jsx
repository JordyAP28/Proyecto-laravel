import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/RecuperarContraseña.css';

export const RecuperarContraseña = () => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!correo) {
      setMensaje('Por favor, ingrese su correo electrónico.');
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario && usuario.email === correo) {
      localStorage.setItem('recuperacionEnviada', 'true');
      setMensaje('Se ha enviado un enlace de recuperación al correo proporcionado.');
      setTimeout(() => navigate('/ReestablecerContraseña'), 2500);
    } else {
      setMensaje(' Este correo no está registrado en el sistema.');
    }
  };

  return (
    <div className="recuperar-container">
      <div className="recuperar-card">
        <div className="recuperar-header">
          <h2>Recuperar Contraseña</h2>
          <p>Ingresa tu correo registrado para recibir un enlace de recuperación</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <button type="submit">Enviar enlace</button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <div className="volver">
          <a href="/login">← Volver al inicio de sesión</a>
        </div>
      </div>
    </div>
  );
};
