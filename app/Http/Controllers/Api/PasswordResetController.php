<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
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

        return response()->json([
            'message' => $status === Password::RESET_LINK_SENT
                ? 'Se ha enviado un enlace de recuperación a tu correo.'
                : 'No se pudo enviar el enlace de recuperación.'
        ], $status === Password::RESET_LINK_SENT ? 200 : 500);
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
                // 🔥 Hasheo manual SIEMPRE y garantizado
                $user->clave = Hash::make($password);
                $user->save();
            }
        );

        return response()->json([
            'message' => $status === Password::PASSWORD_RESET
                ? 'La contraseña se ha restablecido correctamente.'
                : 'El token o el correo no son válidos.',
        ], $status === Password::PASSWORD_RESET ? 200 : 400);
    }
}
