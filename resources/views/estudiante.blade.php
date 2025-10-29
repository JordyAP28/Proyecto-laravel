<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panel del Estudiante</title>
  <link rel="stylesheet" href="{{ asset('css/estudiante.css') }}">
</head>
<body>
  <!-- ===== HEADER ===== -->
  <header>
    <div class="logo">Cursos Vacacionales</div>
    <nav>
      <ul>
        <li><a href="#">Mis Cursos</a></li>
        <li><a href="#">Perfil</a></li>
        <li>
          <form action="{{ route('logout') }}" method="POST" style="display:inline;">
            @csrf
            <button type="submit" class="logout-btn">Cerrar Sesión</button>
          </form>
        </li>
      </ul>
    </nav>
  </header>

  <!-- ===== CARRUSEL ===== -->
  <main>
    <section class="carousel">
      <div class="slides">

        <!-- Curso 1 -->
        <div class="slide active">
          <img src="https://media.istockphoto.com/photos/team-of-unrecognizable-soccer-players-practicing-dribbling-with-balls-picture-id956327194?k=20&m=956327194&s=612x612&w=0&h=XyEhss9Lh0ntB5H_5EHuCdnIq3XWIOINwMoymZOaCkY=" alt="Curso 1">
          <div class="info">
            <h2>Curso de Futbol</h2>
            <p>Porque cada paso en la cancha es un paso hacia tus sueños.</p>
            <div class="buttons">
              <button onclick="openModal('Curso de futbol', 'Solo los dias Martes y jueves ven e incribete ')" class="info-btn">Más información</button>
              <form action="{{ route('curso.inscribirse', 1) }}" method="POST">
                @csrf
                <button type="submit" class="register-btn">Registrarse</button>
              </form>
            </div>
          </div>
        </div>

        <!-- Curso 2 -->
        <div class="slide">
          <img src="https://s.abcnews.com/images/GMA/school-sports-stock-gty-jef-231020_1697829233330_hpMain_2_16x9_992.jpg" alt="Curso 2">
          <div class="info">
            <h2>Curso de Basquetbol</h2>
            <p>En la cancha no se juega solo con el balón, se juega con el corazón.”</p>
            <div class="buttons">
              <button onclick="openModal('Curso de Basquetbol', 'Los dias jueves y viernes')" class="info-btn">Más información</button>
              <form action="{{ route('curso.inscribirse', 2) }}" method="POST">
                @csrf
                <button type="submit" class="register-btn">Registrarse</button>
              </form>
            </div>
          </div>
        </div>

        <!-- Curso 3 -->
        <div class="slide">
          <img src="https://tse3.mm.bing.net/th/id/OIP.gZPfbTQityu2Ax_HjEvBuQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Curso 3">
          <div class="info">
            <h2>Curso de Volleyball</h2>
            <p>“Donde hay red, hay conexión. Donde hay voleibol, hay pasión.</p>
            <div class="buttons">
              <button onclick="openModal('Curso de Volleyball', 'Los dia jueves y sabado')" class="info-btn">Más información</button>
              <form action="{{ route('curso.inscribirse', 3) }}" method="POST">
                @csrf
                <button type="submit" class="register-btn">Registrarse</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de navegación -->
      <a class="prev" onclick="moveSlide(-1)">&#10094;</a>
      <a class="next" onclick="moveSlide(1)">&#10095;</a>
    </section>
  </main>

  <!-- ===== MODAL ===== -->
  <div id="infoModal" class="modal">
    <div class="modal-content">
      <span class="close" onclick="closeModal()">&times;</span>
      <h2 id="modalTitle"></h2>
      <p id="modalText"></p>
    </div>
  </div>

  <footer>
    <p>© 2025 Cursos Vacacionales - Ven y divierte jugando </p>
  </footer>

  <script>
    let index = 0;
    const slides = document.querySelectorAll('.slide');

    function moveSlide(n) {
      slides[index].classList.remove('active');
      index = (index + n + slides.length) % slides.length;
      slides[index].classList.add('active');
    }

    function openModal(title, text) {
      document.getElementById('modalTitle').innerText = title;
      document.getElementById('modalText').innerText = text;
      document.getElementById('infoModal').style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('infoModal').style.display = 'none';
    }

    window.onclick = function(e) {
      const modal = document.getElementById('infoModal');
      if (e.target === modal) closeModal();
    };
  </script>
</body>
</html>
