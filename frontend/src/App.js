import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Usuarios from './components/Usuarios';
import  Login from './components/Login';
import { RecuperarContraseña } from './components/RecuperarContraseña';
import { Registro } from './components/Registro';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Muestra Usuarios directamente en la raíz "/" */}
          <Route path="/" element={<Usuarios />} />
          <Route path="/Login" element={<Login/>} />
         <Route path="/RecuperarContraseña" element={<RecuperarContraseña/>} />
          <Route path="/Registro" element={<Registro/>} />
          

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;