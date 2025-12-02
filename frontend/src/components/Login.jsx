import React, { useState } from 'react';
import '../assets/css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // URL base de tu API Laravel
  const API_URL = 'http://localhost:8000/api';

  // Función de validación
  const validarCampos = () => {
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoCorreo.test(email)) {
      return "Por favor ingrese un correo válido.";
    }

    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    // Validar campos antes de enviar
    const errorValidacion = validarCampos();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Intentando login con:', { email }); // Debug
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      console.log('Respuesta del servidor:', response.status); // Debug
      const data = await response.json();
      console.log('Datos recibidos:', data); // Debug

      if (response.ok && data.success) {
        // Login exitoso
        setMensaje(`¡Bienvenido, ${data.data.primer_nombre} ${data.data.apellido}!`);
        
        // Guardar datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.data));
        
        // Redirigir al dashboard después de 1.5 segundos
        setTimeout(() => {
          window.location.href = '/dashboard'; // Ajusta según tu ruta
        }, 1500);
        
      } else {
        // Error de autenticación
        setError(data.message || 'Credenciales incorrectas');
      }

    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de conexión con el servidor. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {error && <p className="mensaje error">{error}</p>}
        {mensaje && <p className="mensaje success">{mensaje}</p>}

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