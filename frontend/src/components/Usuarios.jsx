import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí pondrías tu endpoint Laravel, por ahora simulamos
    // axios.get('http://localhost:8000/api/usuarios')
    //  .then(res => setUsuarios(res.data))
    //  .catch(err => console.log(err))
    //  .finally(() => setLoading(false));

    // Simulación de datos si tu backend no está listo
    setTimeout(() => {
      setUsuarios([
        { id: 1, nombre: 'Juan', email: 'juan@email.com' },
        { id: 2, nombre: 'María', email: 'maria@email.com' }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.nombre} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Usuario;
