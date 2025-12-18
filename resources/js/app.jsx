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
import AdminDashboard from "./components/AdminDashboard";
import Historial from "./components/historial";
//rutas admin
import DashboardAdmin from "./components/Admin/Dashboard";
import PerfilAdmin from "./components/Admin/Perfil";
//rutas entrenador
import DashboardEntrenador from "./components/Entrenador/Dashboard";
import PerfilEntrenador from "./components/Entrenador/Perfil";
//rutas deportista
import DashboardDeportista from "./components/Deportista/Dashboard";
import PerfilDeportista from "./components/Deportista/Perfil";
//rutas secretaria
import DashboardSecretaria from "./components/Secretaria/Dashboard";
import PerfilSecretaria from "./components/Secretaria/Perfil";
//rutas tutor
import DashboardTutor from "./components/Tutor/Dashboard";
import PerfilTutor from "./components/Tutor/Perfil";



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
    <Route path="/Administracion" element={<AdminDashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/curso" element={<Curso />} />
                <Route path="/historial" element={<Historial />} />
        //rutas admin
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/perfil" element={<PerfilAdmin />} />
        //rutas entrenador
        <Route path="/entrenador/dashboard" element={<DashboardEntrenador />} />
        <Route path="/entrenador/perfil" element={<PerfilEntrenador />} />
        //rutas deportista
        <Route path="/deportista/dashboard" element={<DashboardDeportista />} />
        <Route path="/deportista/perfil" element={<PerfilDeportista />} />
        //rutas secretaria
        <Route path="/secretaria/dashboard" element={<DashboardSecretaria />} />
        <Route path="/secretaria/perfil" element={<PerfilSecretaria />} />
        //rutas tutor
        <Route path="/tutor/dashboard" element={<DashboardTutor />} />
        <Route path="/tutor/perfil" element={<PerfilTutor />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);