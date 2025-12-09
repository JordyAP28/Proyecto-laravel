import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importa tus componentes según los archivos que tienes
import EstudiantePanel from "./components/EstudiantePanel";
import Login from "./components/Login";
import RecuperarContrasena from "./components/recuperarcontrasena";
import ReestablecerContrasena from "./components/reestablecercontrasena";
import Register from "./components/register";
import Registro from "./components/registro";
import Perfil from "./components/perfil";
import Curso from "./components/curso";
import Administracion from "./components/administracion";



// Montaje principal de React
ReactDOM.createRoot(document.getElementById("react-root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route path="/reestablecer-contrasena" element={<ReestablecerContrasena />} />

        
        <Route path="/register" element={<Register />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/estudiante" element={<EstudiantePanel />} />
        <Route path="/Administracion" element={<Administracion />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/curso" element={<Curso />} />


      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
