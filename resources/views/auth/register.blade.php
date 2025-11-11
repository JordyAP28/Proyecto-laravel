<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Registro</title>
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
            <a href="#"><b>Registro</b> de Usuario</a>
        </div>

        <div class="login-box-body" style="border-radius: 5px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);">
            <p class="login-box-msg" style="font-size: 17px;">Crear Usuario</p>

            {{-- Mostrar mensaje de error general --}}
            @if(session('error'))
                <div class="alert alert-danger alert-dismissible">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                    {{ session('error') }}
                </div>
            @endif

            {{-- Mostrar todos los errores de validación --}}
            @if ($errors->any())
                <div class="alert alert-danger alert-dismissible">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                    <h4><i class="icon fa fa-ban"></i> Errores en el formulario</h4>
                    <ul style="margin-bottom: 0;">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('register.store') }}" method="POST">
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

                {{-- Selector de Rol --}}
                <div class="form-group @error('id_rol') has-error @enderror">
                    <label>Tipo de Usuario</label>
                    <select class="form-control" name="id_rol" required style="border-radius: 5px;">
                        <option value="">Selecciona...</option>
                        @foreach($roles as $rol)
                            <option value="{{ $rol->id_rol }}" {{ old('id_rol') == $rol->id_rol ? 'selected' : '' }}>
                                {{ $rol->rol }}
                            </option>
                        @endforeach
                    </select>
                    @error('id_rol')
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
                    <small class="text-muted">Mínimo 8 caracteres</small>
                </div>

                <div class="form-group has-feedback @error('clave') has-error @enderror">
                    <input type="password" 
                        class="form-control" 
                        name="clave_confirmation" 
                        placeholder="Confirmar Contraseña" 
                        required 
                        style="border-radius: 5px;">
                    <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                </div>

                <div class="row">
                    <div class="col-xs-7">
                        <a href="{{ route('login') }}">Ya tengo un usuario</a>
                    </div>

                    <div class="col-xs-5">
                        <button type="submit" 
                                class="btn btn-primary btn-block btn-flat" 
                                style="background-color: #3498db; border: none; border-radius: 5px;">
                            Registrarse
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
