<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Registro de Estudiante</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="{{ asset('css/Register.css') }}">
</head>
<body>

<div class="login-horizontal-container">
    {{-- Lado izquierdo: formulario --}}
    <div class="login-left">
        <h2>Crear cuenta de estudiante</h2>

        {{-- Mensajes de éxito --}}
        @if (session('success'))
            <div class="alert success">{{ session('success') }}</div>
        @endif

        {{-- Errores de validación --}}
        @if ($errors->any())
            <div class="alert">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        {{-- Formulario --}}
        <form method="POST" action="{{ route('register.store') }}">
            @csrf

            <label for="username">Nombre completo</label>
            <input type="text" id="username" name="username" placeholder="Tu nombre completo" value="{{ old('username') }}" required>

            <label for="email">Correo electrónico</label>
            <input type="email" id="email" name="email" placeholder="tucorreo@ejemplo.com" value="{{ old('email') }}" required>

            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" placeholder="Mínimo 6 caracteres" required minlength="6">

            <label for="password_confirmation">Confirmar contraseña</label>
            <input type="password" id="password_confirmation" name="password_confirmation" placeholder="Repite tu contraseña" required minlength="6">

            <div class="botones">
                <button type="submit">Registrarse</button>
            </div>
        </form>

        <div class="links">
            <p>¿Ya tienes una cuenta? <a href="{{ route('login') }}">Inicia sesión</a></p>
        </div>
    </div>

    {{-- Lado derecho: imagen e información --}}
    <div class="login-right">
        <img src="{{ asset('images/estudiante-register.jpg') }}" alt="Registro de estudiante">
        <div class="info-text">
            <h1>Bienvenido al portal de estudiantes</h1>
            <p>Regístrate para acceder a tus cursos, inscripciones y más.</p>
        </div>
    </div>
</div>

</body>
</html>
