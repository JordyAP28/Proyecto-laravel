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

                <div class="modal fade modal-slide-in-rigth" id="errorModal" aria-hidden="true" role="dialog" tabindex="-1">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">

                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">x</span>                   
                                </button>
                                <h4 class="modal-title">Error al iniciar sesión</h4>
                            </div>

                            <div class="modal-body">
                                <p id="errorMessage"></p>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" data-dismiss="modal">Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>

               @if ($errors->any())
                    <script>
                        document.addEventListener('DOMContentLoaded', function() {
                            document.getElementById('errorMessage').innerText = '{{ $errors->first() }}';
                            $('#errorModal').modal('show');
                        });
                    </script>
                @endif

                <form action="{{ route('login') }}" method="POST">
                    @csrf
                    <div class="form-group has-feedback">
                        <input type="email" class="form-control" name="email" placeholder="Correo Electrónico" required autofocus style="border-radius: 5px;">
                        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                    </div>

                    <div class="form-group has-feedback">
                        <input type="password" class="form-control" name="password" placeholder="Contraseña" required style="border-radius: 5px;">
                        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                    </div>

                    <div class="row">
                        <div class="col-xs-7">
                            <a href="{{ route('register') }}">Crear un usuario</a>
                        </div>
                        <div class="col-xs-5">
                            <center>
                            <button type="submit" class="btn btn-primary" style="background-color: #3498db; border: none; border-radius: 5px;  cursor: pointer; transition: background-color 0.3s, transform 0.3s;">Iniciar Sesión</button>
                            </center>
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

