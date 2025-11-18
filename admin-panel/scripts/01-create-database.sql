-- Script para crear la base de datos y las tablas principales
-- Liga Deportiva Cantonal de Montecristi

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS liga_deportiva CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE liga_deportiva;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('Administrador', 'Editor', 'Visor') NOT NULL DEFAULT 'Visor',
  estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_conexion TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_rol (rol),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de eventos deportivos
CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  hora TIME,
  ubicacion VARCHAR(200),
  tipo ENUM('Torneo', 'Partido', 'Entrenamiento', 'Reunión', 'Otro') NOT NULL,
  capacidad INT DEFAULT 0,
  participantes_actuales INT DEFAULT 0,
  estado ENUM('Planificado', 'En Curso', 'Finalizado', 'Cancelado') NOT NULL DEFAULT 'Planificado',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_fecha (fecha),
  INDEX idx_tipo (tipo),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de campeonatos
CREATE TABLE IF NOT EXISTS campeonatos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  deporte VARCHAR(50) NOT NULL,
  categoria VARCHAR(50),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  numero_equipos INT DEFAULT 0,
  estado ENUM('Planificado', 'En Curso', 'Finalizado', 'Cancelado') NOT NULL DEFAULT 'Planificado',
  descripcion TEXT,
  reglas TEXT,
  premio VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_deporte (deporte),
  INDEX idx_estado (estado),
  INDEX idx_fecha_inicio (fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de equipos
CREATE TABLE IF NOT EXISTS equipos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  campeonato_id INT,
  capitan VARCHAR(100),
  contacto VARCHAR(100),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campeonato_id) REFERENCES campeonatos(id) ON DELETE CASCADE,
  INDEX idx_campeonato (campeonato_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de cursos vacacionales
CREATE TABLE IF NOT EXISTS cursos_vacacionales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  deporte VARCHAR(50) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  edad_minima INT,
  edad_maxima INT,
  cupos_totales INT NOT NULL,
  cupos_disponibles INT NOT NULL,
  costo DECIMAL(10, 2) DEFAULT 0.00,
  instructor VARCHAR(100),
  horario VARCHAR(100),
  estado ENUM('Abierto', 'En Curso', 'Cerrado', 'Cancelado') NOT NULL DEFAULT 'Abierto',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_deporte (deporte),
  INDEX idx_estado (estado),
  INDEX idx_fecha_inicio (fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de inscripciones a cursos
CREATE TABLE IF NOT EXISTS inscripciones_cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_id INT NOT NULL,
  nombre_participante VARCHAR(100) NOT NULL,
  edad INT NOT NULL,
  nombre_responsable VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado_pago ENUM('Pendiente', 'Pagado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
  FOREIGN KEY (curso_id) REFERENCES cursos_vacacionales(id) ON DELETE CASCADE,
  INDEX idx_curso (curso_id),
  INDEX idx_estado_pago (estado_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de transacciones contables
CREATE TABLE IF NOT EXISTS transacciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('Ingreso', 'Egreso') NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  comprobante VARCHAR(50),
  usuario_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_tipo (tipo),
  INDEX idx_categoria (categoria),
  INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de participantes
CREATE TABLE IF NOT EXISTS participantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  fecha_nacimiento DATE,
  genero ENUM('M', 'F', 'Otro'),
  telefono VARCHAR(20),
  email VARCHAR(100),
  direccion TEXT,
  estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cedula (cedula),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de relación participantes-eventos
CREATE TABLE IF NOT EXISTS participantes_eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  participante_id INT NOT NULL,
  evento_id INT NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  asistio BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (participante_id) REFERENCES participantes(id) ON DELETE CASCADE,
  FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
  UNIQUE KEY unique_participante_evento (participante_id, evento_id),
  INDEX idx_participante (participante_id),
  INDEX idx_evento (evento_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Base de datos y tablas creadas exitosamente!' as Mensaje;
