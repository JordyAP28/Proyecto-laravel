# Sistema de Gestión Deportiva
## Liga Deportiva Cantonal de Montecristi

Sistema completo de administración para liga deportiva con gestión de eventos, campeonatos, cursos vacacionales, contabilidad y usuarios.

## 🎨 Características

- **Panel de Administrador**: Interfaz completa con acceso total al sistema
- **Gestión de Usuarios**: CRUD completo de usuarios con roles (Administrador, Editor, Visor)
- **Eventos Deportivos**: Creación y seguimiento de eventos deportivos
- **Campeonatos**: Gestión de torneos y competencias
- **Cursos Vacacionales**: Administración de programas deportivos para niños y jóvenes
- **Contabilidad**: Control de ingresos, egresos y balance financiero
- **Informes**: Reportes y estadísticas del sistema
- **Base de Datos MySQL**: Integración completa con MySQL

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+ 
- MySQL 8.0+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone [url-del-repositorio]
cd liga-deportiva-montecristi
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env
\`\`\`

Editar `.env` con tus credenciales de MySQL:
\`\`\`env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=liga_deportiva
\`\`\`

4. **Crear base de datos**

Ejecutar los scripts SQL en orden:
\`\`\`bash
# Desde MySQL Workbench o línea de comandos
mysql -u root -p < scripts/01-create-database.sql
mysql -u root -p < scripts/02-seed-data.sql
\`\`\`

O si usas la interfaz de v0, los scripts se pueden ejecutar directamente.

5. **Iniciar el servidor de desarrollo**
\`\`\`bash
npm run dev
\`\`\`

Abrir [http://localhost:3000](http://localhost:3000)

## 🎨 Paleta de Colores

El sistema utiliza la paleta de colores verde, blanco y rojo:
- **Verde**: Color primario (#059669) - Representa el deporte y la naturaleza
- **Blanco**: Color de fondo y contraste
- **Rojo**: Color secundario (#DC2626) - Representa la pasión deportiva

## 👥 Usuarios de Prueba

Después de ejecutar el script de datos de prueba:

- **Email**: admin@liga.ec  
  **Contraseña**: password123  
  **Rol**: Administrador

- **Email**: maria.gonzalez@liga.ec  
  **Contraseña**: password123  
  **Rol**: Editor

## 📦 Estructura del Proyecto

\`\`\`
/
├── app/
│   ├── page.tsx                 # Página principal
│   ├── eventos/                 # Módulo de eventos
│   ├── campeonatos/             # Módulo de campeonatos
│   ├── cursos/                  # Módulo de cursos vacacionales
│   ├── usuarios/                # Módulo de gestión de usuarios
│   ├── contabilidad/            # Módulo de contabilidad
│   └── informes/                # Módulo de informes
├── components/
│   ├── admin-header.tsx         # Header con info de administrador
│   ├── main-nav.tsx             # Navegación principal
│   └── ui/                      # Componentes de UI
├── lib/
│   └── db.ts                    # Configuración y queries de MySQL
├── scripts/
│   ├── 01-create-database.sql   # Script de creación de BD
│   └── 02-seed-data.sql         # Script de datos de prueba
└── public/                      # Archivos estáticos
\`\`\`

## 🔐 Funcionalidades de Administrador

- Cerrar sesión
- Cambiar de cuenta
- Gestión completa de usuarios (crear, editar, eliminar, activar/desactivar)
- Acceso a todos los módulos del sistema
- Visualización de estadísticas en tiempo real

## 🛠️ Tecnologías

- **Frontend**: Next.js 16, React 19, TailwindCSS v4
- **Backend**: Next.js API Routes, MySQL
- **Base de Datos**: MySQL 8.0
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📝 Licencia

© 2025 Liga Deportiva Cantonal de Montecristi. Todos los derechos reservados.
\`\`\`

```json file="" isHidden
