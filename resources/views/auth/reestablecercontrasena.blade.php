<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reestablecer Contraseña</title>
  <link rel="stylesheet" href="{{ asset('css/reestablecer.css') }}">
</head>
<body>
  <div class="reestablecer-container">
    <h2>Reestablecer Contraseña</h2>
    <form method="POST" action="{{ route('actualizar.contrasena') }}">
      @csrf
      <label for="token">Código de verificación:</label>
      <input type="text" id="token" name="token" required placeholder="Ingresa el código que recibiste">

      <label for="password">Nueva contraseña:</label>
      <input type="password" id="password" name="password" required placeholder="Ingresa la nueva contraseña">

      <label for="password_confirmation">Confirmar contraseña:</label>
      <input type="password" id="password_confirmation" name="password_confirmation" required placeholder="Confirma la contraseña">

      <button type="submit">Actualizar contraseña</button>
    </form>

    <p><a href="{{ route('login') }}">Volver al inicio de sesión</a></p>
  </div>
</body>
</html>
