<?php
$mensaje = "";
$errores = [];

// Inicializar datos para mantenerlos al recargar
$formData = [
    'nombre' => '',
    'apellido' => '',
    'edad' => '',
    'email' => '',
    'telefono' => '',
    'fechaNacimiento' => '',
    'dirrecion' => '',
    'curso' => '',
    'password' => '',
    'confirmarPassword' => ''
];

// Procesar formulario
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $formData = array_map('trim', $_POST);

    // Validaciones
    if (!preg_match("/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/", $formData['nombre'])) $errores[] = "Nombre inválido (solo letras).";
    if (!preg_match("/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/", $formData['apellido'])) $errores[] = "Apellido inválido (solo letras).";
    if (!preg_match("/^\d+$/", $formData['edad'])) $errores[] = "Edad inválida (solo números).";
    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $formData['fechaNacimiento'])) $errores[] = "Fecha de nacimiento inválida (YYYY-MM-DD).";
    if (!preg_match("/^\d{10,}$/", $formData['telefono'])) $errores[] = "Teléfono inválido (mínimo 10 dígitos).";
    if (!filter_var($formData['email'], FILTER_VALIDATE_EMAIL)) $errores[] = "Correo electrónico inválido.";
    if (strlen($formData['password']) < 6) $errores[] = "La contraseña debe tener al menos 6 caracteres.";
    if ($formData['password'] !== $formData['confirmarPassword']) $errores[] = "Las contraseñas no coinciden.";
    if (empty($formData['curso'])) $errores[] = "Debe seleccionar un curso.";
    if (empty($formData['dirrecion'])) $errores[] = "Debe ingresar su dirección.";

    if (empty($errores)) {
        // Aquí podrías insertar a la base de datos
        $mensaje = "Usuario registrado correctamente ";
        // Limpiar formulario
        $formData = array_map(function() { return ''; }, $formData);
    }
}

// Cursos disponibles
$cursos = ['Pintura', 'Basquetbol', 'Futbol', 'Música'];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Registro</title>
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <link rel="stylesheet" href="{{ asset('css/Register.css') }}">

</head>
<body>

<div class="login-horizontal-container">
    <!-- Lado izquierdo - formulario -->
    <div class="login-left">
        <h2>Registro</h2>

        <!-- Mensajes -->
        <?php if(!empty($mensaje)): ?>
            <p class="mensaje"><?= $mensaje ?></p>
        <?php endif; ?>

        <?php if(!empty($errores)): ?>
            <div class="alert alert-danger">
                <ul>
                    <?php foreach($errores as $error): ?>
                        <li><?= $error ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <form action="" method="POST">
            <input type="text" name="nombre" placeholder="Nombre" value="<?= htmlspecialchars($formData['nombre']) ?>" required>
            <input type="text" name="apellido" placeholder="Apellido" value="<?= htmlspecialchars($formData['apellido']) ?>" required>
            <input type="text" name="edad" placeholder="Edad" value="<?= htmlspecialchars($formData['edad']) ?>" required>
            <input type="email" name="email" placeholder="Correo electrónico" value="<?= htmlspecialchars($formData['email']) ?>" required>
            <input type="text" name="telefono" placeholder="Teléfono" value="<?= htmlspecialchars($formData['telefono']) ?>" required>
            <input type="text" name="fechaNacimiento" placeholder="Fecha de nacimiento (YYYY-MM-DD)" value="<?= htmlspecialchars($formData['fechaNacimiento']) ?>" required>
            <input type="text" name="dirrecion" placeholder="Dirección" value="<?= htmlspecialchars($formData['dirrecion']) ?>" required>
            
            <select name="curso" required>
                <option value="">Seleccione un curso</option>
                <?php foreach($cursos as $curso): ?>
                    <option value="<?= $curso ?>" <?= ($formData['curso'] === $curso) ? 'selected' : '' ?>><?= $curso ?></option>
                <?php endforeach; ?>
            </select>

            <input type="password" name="password" placeholder="Contraseña" required>
            <input type="password" name="confirmarPassword" placeholder="Confirmar contraseña" required>

            <div class="botones">
                <button type="submit">Registrarse</button>
                <button type="button" onclick="window.location.href='login.php'">Ir a Inicio</button>
            </div>
        </form>
    </div>

    <!-- Lado derecho - imagen -->
    <div class="login-right">
        <img src="https://tse4.mm.bing.net/th/id/OIP.F7fZwAaY6dyjhKQF1G4aOQHaFu?w=750&h=580&rs=1&pid=ImgDetMain&o=7&rm=3" alt="Cursos Vacacionales">
        <div class="info-text">
            <h1>Cursos Vacacionales 2025</h1>
            <p>Aprende, diviértete y aprovecha tus vacaciones con nosotros</p>
        </div>
    </div>
</div>

</body>
</html>
