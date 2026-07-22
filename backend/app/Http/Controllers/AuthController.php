<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->only('name', 'email', 'password'));
        $user->wallet()->create();
        $token = $user->createToken('api')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('api')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function me(): JsonResponse
    {
        return response()->json(Auth::user());
    }

    public function logout(): JsonResponse
    {
        Auth::user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }
}
