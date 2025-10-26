import {BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { Usuario} from './components/Admin/Usuarios';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/Login" replace />} />

          <Route path='/Usuarios' element={<Usuario/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;