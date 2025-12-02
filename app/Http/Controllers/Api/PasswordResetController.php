<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Models\Usuario;

class PasswordResetController extends Controller
{
    // POST /api/forgot-password
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:usuarios,email',
        ]);

        $status = Password::broker('users')->sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Se ha enviado un enlace de recuperación a tu correo.',
            ], 200);
        }

        return response()->json([
            'message' => 'No se pudo enviar el enlace de recuperación.',
        ], 500);
    }

    // POST /api/reset-password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email|exists:usuarios,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $status = Password::broker('users')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (Usuario $user, string $password) {
                // Gracias al mutator setClaveAttribute se hashea solo
                $user->clave = $password;
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'La contraseña se ha restablecido correctamente.',
            ], 200);
        }

        return response()->json([
            'message' => 'El token o el correo no son válidos.',
        ], 400);
    }
}
