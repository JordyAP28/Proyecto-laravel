import React, { useState } from "react";
import axios from "axios";
import "../../css/estudiante.css"; // tu CSS original de Blade

export default function EstudiantePanel() {
  const [index, setIndex] = useState(0);
  const [modal, setModal] = useState({ show: false, title: "", text: "" });

  const slides = [
    {
      title: "Curso de Futbol",
      text: "Porque cada paso en la cancha es un paso hacia tus sueños.",
      img: "https://media.istockphoto.com/photos/team-of-unrecognizable-soccer-players-practicing-dribbling-with-balls-picture-id956327194?k=20&m=956327194&s=612x612&w=0&h=XyEhss9Lh0ntB5H_5EHuCdnIq3XWIOINwMoymZOaCkY=",
      info: "Solo los días martes y jueves. ¡Ven e inscríbete!",
      link: "/registro?curso=futbol",
    },
    {
      title: "Curso de Basquetbol",
      text: "En la cancha no se juega solo con el balón, se juega con el corazón.",
      img: "https://s.abcnews.com/images/GMA/school-sports-stock-gty-jef-231020_1697829233330_hpMain_2_16x9_992.jpg",
      info: "Los días jueves y viernes.",
      link: "/registro?curso=basquetbol",
    },
    {
      title: "Curso de Volleyball",
      text: "Donde hay red, hay conexión. Donde hay voleibol, hay pasión.",
      img: "https://tse3.mm.bing.net/th/id/OIP.gZPfbTQityu2Ax_HjEvBuQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
      info: "Los días jueves y sábado.",
      link: "/registro?curso=volleyball",
    },
  ];

  const moveSlide = (n) => {
    setIndex((prev) => (prev + n + slides.length) % slides.length);
  };

  // ============================
  // 🔐 LOGOUT PARA REACT
  // ============================
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    // Redirige a la página principal (login o landing)
    window.location.href = "/";
  };

  return (
    <div className="estudiante-panel">
      <header>
        <div className="logo">Cursos Vacacionales</div>
        <nav>
          <ul>
            <li><a href="#">Mis Cursos</a></li>
            <li><a href="#">Perfil</a></li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="carousel">
          <div
            className="slides"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="slide">
                <img src={slide.img} alt={slide.title} />
                <div className="info">
                  <h2>{slide.title}</h2>
                  <p>{slide.text}</p>
                  <div className="buttons">
                    <button
                      onClick={() =>
                        setModal({ show: true, title: slide.title, text: slide.info })
                      }
                    >
                      Más información
                    </button>
                    <a href={slide.link} className="register-btn">Registrarse</a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <a className="prev" onClick={() => moveSlide(-1)}>&#10094;</a>
          <a className="next" onClick={() => moveSlide(1)}>&#10095;</a>
        </section>
      </main>

      {modal.show && (
        <div className="modal" onClick={() => setModal({ ...modal, show: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span
              className="close"
              onClick={() => setModal({ ...modal, show: false })}
            >
              &times;
            </span>
            <h2>{modal.title}</h2>
            <p>{modal.text}</p>
          </div>
        </div>
      )}

      <footer>
        <p>© 2025 Cursos Vacacionales - Ven y diviértete jugando</p>
      </footer>
    </div>
  );
}
