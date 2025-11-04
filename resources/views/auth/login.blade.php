<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Iniciar Sesión</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <link rel="stylesheet" href="{{ asset('css/bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ asset('css/font-awesome.css') }}">
        <link rel="stylesheet" href="{{ asset('css/AdminLTE.min.css') }}">
        <link rel="apple-touch-icon" href="{{ asset('img/apple-touch-icon.png') }}">
        <link rel="shortcut icon" href="{{ asset('img/favicon.ico') }}">
        <link rel="stylesheet" href="{{ asset('css/estilo_login.css') }}">
</head>
<body>

  <div class="login-horizontal-container">
    <!-- Lado izquierdo - formulario -->
    <div class="login-left">
      <h2>Iniciar Sesión</h2>

      <?php
        $mensaje = "";
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
          $email = $_POST["email"];
          $password = $_POST["password"];

          // Validar formato de correo
          if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $mensaje = "Por favor ingrese un correo válido.";
          } elseif (strlen($password) < 6) {
            $mensaje = "La contraseña debe tener al menos 6 caracteres.";
          } else {
            // Aquí va la validación con tu base de datos (simulada)
            if ($email === "usuario@correo.com" && $password === "123456") {
              $mensaje = "Bienvenido, $email";
            } else {
              $mensaje = " Credenciales incorrectas.";
            }
          }
        }
      ?>

      <form action="" method="POST" onsubmit="return validarCampos()">
        <div class="input-group">
          <label for="email">Correo electrónico</label>
          <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" required>
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" name="password" placeholder="Tu contraseña" required minlength="6">
        </div>

        <button type="submit">Ingresar</button>
      </form>

      <?php if (!empty($mensaje)): ?>
        <p class="mensaje"><?= $mensaje ?></p>
      <?php endif; ?>

      <p class="links">

        <a href="recuperar_contrasena.php">¿Olvidaste tu contraseña?</a> |
        <a href="registro.php">Registrarse</a>

      <a href="{{ url('recuperar-contrasena') }}">¿Olvidaste tu contraseña?</a>||
      <a href='register'>Registrarse</a>

      </p>
    </div>


    <!-- Lado derecho - imagen -->
    <div class="login-right">
      <img src="https://www.teatrocentrodearte.org/images/files/2024/0f2f6cd5-31d9-44e4-9c83-e95bf046cb9d.webp" alt="Cursos Vacacionales">
      <div class="info-text">
        <h1>Cursos Vacacionales 2025</h1>
        <p>Aprende, diviértete y aprovecha tus vacaciones con nosotros</p>
      </div>
    </div>
  </div>

  <script>
    function validarCampos() {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!formatoCorreo.test(email)) {
        alert("Por favor ingrese un correo válido.");
        return false;
      }

      if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return false;
      }

      return true;
    }
  </script>

</body>
</html>
