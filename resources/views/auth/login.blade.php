<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Iniciar Sesión</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <link rel="stylesheet" href="{{ asset('css/bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ asset('css/font-awesome.css') }}">
        <link rel="stylesheet" href="{{ asset('css/AdminLTE.min.css') }}">
        <link rel="apple-touch-icon" href="{{ asset('img/apple-touch-icon.png') }}">
        <link rel="shortcut icon" href="{{ asset('img/favicon.ico') }}">
    </head>

    <body class="hold-transition login-page">

        <div class="login-box">
            <div class="login-logo">
                <a href="#"><b>Iniciar</b> Sesión</a>
            </div>

            <div class="login-box-body" style="border-radius: 5px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);">
                <p class="login-box-msg" style="font-size: 17px;">Ingresa tus credenciales</p>

                {{-- Mostrar mensaje de éxito (viene del registro) --}}
                @if(session('success'))
                    <div class="alert alert-success alert-dismissible">
                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                        {{ session('success') }}
                    </div>
                @endif

                {{-- Mostrar errores de validación --}}
                @if ($errors->any())
                    <div class="alert alert-danger alert-dismissible">
                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                        <h4><i class="icon fa fa-ban"></i> Error al iniciar sesión</h4>
                        <ul style="margin-bottom: 0;">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form action="{{ route('login') }}" method="POST">
                    @csrf
                    
                    <div class="form-group has-feedback @error('nombre_usuario') has-error @enderror">
                        <input type="text" 
                            class="form-control" 
                            name="nombre_usuario" 
                            placeholder="Nombre de Usuario" 
                            value="{{ old('nombre_usuario') }}"
                            required 
                            autofocus 
                            style="border-radius: 5px;">
                        <span class="glyphicon glyphicon-user form-control-feedback"></span>
                        @error('nombre_usuario')
                            <span class="help-block">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="form-group has-feedback @error('clave') has-error @enderror">
                        <input type="password" 
                            class="form-control" 
                            name="clave" 
                            placeholder="Contraseña" 
                            required 
                            style="border-radius: 5px;">
                        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                        @error('clave')
                            <span class="help-block">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="row">
                        <div class="col-xs-7">
                            <div class="checkbox icheck">
                                <label>
                                    <input type="checkbox" name="remember" value="1"> Recordarme
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-xs-7">
                            <a href="{{ route('register') }}">Crear un usuario</a>
                        </div>
                        <div class="col-xs-5">
                            <button type="submit" 
                                    class="btn btn-primary btn-block btn-flat" 
                                    style="background-color: #3498db; border: none; border-radius: 5px;">
                                Iniciar Sesión
                            </button>
                        </div>
                    </div>
                </form>
            </div>

        </div>

        <script src="{{ asset('js/jQuery-2.1.4.min.js') }}"></script>
        <script src="{{ asset('js/bootstrap.min.js') }}"></script>
        <script src="{{ asset('js/app.min.js') }}"></script>
    </body>
</html>