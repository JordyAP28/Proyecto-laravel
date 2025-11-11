import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return <h1>¡Hola desde React dentro de Laravel!</h1>;
}

ReactDOM.createRoot(document.getElementById('react-root')).render(<App />);
