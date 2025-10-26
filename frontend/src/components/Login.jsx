import React, { useState } from 'react';
import '../assets/css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Función de validación
  const validarCampos = () => {
    // Validar formato de correo
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoCorreo.test(email)) {
      return "Por favor ingrese un correo válido.";
    }

    // Validar contraseña mínima de 6 caracteres
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    return null; // Todo correcto
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validarCampos();
    if (error) {
      setMensaje(error);
      return;
    }

    // Si pasa validaciones
    setMensaje(` Bienvenido, ${email}`);
  };

  return (
    <div className="login-horizontal-container">
      {/* Lado izquierdo - formulario */}
      <div className="login-left">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit">Ingresar</button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="links">
          <a href="/RecuperarContraseña">¿Olvidaste tu contraseña?</a> |{' '}
          <a href="/Registro">Registrarse</a>
        </p>
      </div>

      {/* Lado derecho - imagen */}
      <div className="login-right">
        <img
          src="https://www.teatrocentrodearte.org/images/files/2024/0f2f6cd5-31d9-44e4-9c83-e95bf046cb9d.webp"
          alt="Cursos Vacacionales"
        />
        <div className="info-text">
          <h1>Cursos Vacacionales 2025</h1>
          <p>Aprende, diviértete y aprovecha tus vacaciones con nosotros</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
