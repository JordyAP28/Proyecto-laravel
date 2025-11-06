<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Recuperar Contraseña</title>
  <link rel="stylesheet" href="{{ asset('css/recuperar.css') }}">
</head>
<body>
  <div class="recuperar-container">
    <h2>Recuperar Contraseña</h2>
    <form method="POST" action="#">
      @csrf
      <label for="email">Correo electrónico:</label>
      <input type="email" id="email" name="email" required placeholder="Ingresa tu correo">
      <button type="submit">Enviar enlace</button>
    </form>
     
    <p class="links">
    ¿Ya recibiste el código en tu correo?
  <a href="{{ route('reestablecer.contrasena') }}">Haz clic aquí para reestablecer tu contraseña</a>
</p>
    <p><a href="{{ route('login') }}">Volver al inicio de sesión</a></p>
  </div>
</body>
</html>
