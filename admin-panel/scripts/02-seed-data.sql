-- Script para insertar datos de prueba
-- Liga Deportiva Cantonal de Montecristi

USE liga_deportiva;

-- Insertar usuarios de prueba
INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES
('Administrador Principal', 'admin@liga.ec', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Administrador', 'Activo'),
('María González', 'maria.gonzalez@liga.ec', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Editor', 'Activo'),
('Carlos Rodríguez', 'carlos.rodriguez@liga.ec', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Visor', 'Activo');

-- Insertar eventos deportivos
INSERT INTO eventos (titulo, descripcion, fecha, hora, ubicacion, tipo, capacidad, participantes_actuales, estado) VALUES
('Torneo Interbarrial de Fútbol', 'Campeonato de fútbol entre equipos de diferentes barrios', '2025-01-25', '09:00:00', 'Estadio Municipal de Montecristi', 'Torneo', 200, 120, 'En Curso'),
('Campeonato de Baloncesto Sub-16', 'Torneo juvenil categoría sub-16', '2025-02-05', '14:00:00', 'Coliseo Deportivo', 'Torneo', 150, 85, 'Planificado'),
('Entrenamiento de Voleibol', 'Sesión de entrenamiento para equipos locales', '2025-01-20', '16:00:00', 'Cancha Municipal', 'Entrenamiento', 50, 30, 'Planificado');

-- Insertar campeonatos
INSERT INTO campeonatos (nombre, deporte, categoria, fecha_inicio, fecha_fin, numero_equipos, estado, descripcion) VALUES
('Copa Montecristi 2025', 'Fútbol', 'Libre', '2025-02-01', '2025-03-15', 16, 'Planificado', 'Torneo anual de fútbol de la liga cantonal'),
('Torneo Relámpago de Baloncesto', 'Baloncesto', 'Sub-16', '2025-02-10', '2025-02-12', 8, 'Planificado', 'Torneo juvenil de fin de semana'),
('Liga de Voleibol Femenino', 'Voleibol', 'Femenino', '2025-03-01', '2025-04-30', 10, 'Planificado', 'Primera liga femenina del cantón');

-- Insertar cursos vacacionales
INSERT INTO cursos_vacacionales (nombre, descripcion, deporte, fecha_inicio, fecha_fin, edad_minima, edad_maxima, cupos_totales, cupos_disponibles, costo, instructor, horario, estado) VALUES
('Curso Vacacional de Natación', 'Aprendizaje de natación para niños', 'Natación', '2025-02-01', '2025-02-28', 6, 12, 50, 35, 25.00, 'Pedro Álvarez', '08:00 - 10:00', 'Abierto'),
('Escuela de Fútbol Infantil', 'Fundamentos del fútbol para niños', 'Fútbol', '2025-02-01', '2025-02-28', 7, 14, 60, 20, 20.00, 'Juan Moreira', '10:00 - 12:00', 'Abierto'),
('Taller de Baloncesto', 'Técnicas básicas de baloncesto', 'Baloncesto', '2025-02-05', '2025-02-26', 8, 15, 40, 25, 22.00, 'Luis Castro', '14:00 - 16:00', 'Abierto');

-- Insertar transacciones contables
INSERT INTO transacciones (tipo, categoria, monto, descripcion, fecha, comprobante, usuario_id) VALUES
('Ingreso', 'Inscripciones', 1500.00, 'Inscripciones cursos vacacionales enero', '2025-01-15', 'ING-2025-001', 1),
('Egreso', 'Mantenimiento', 350.00, 'Reparación de canchas deportivas', '2025-01-10', 'EGR-2025-001', 1),
('Ingreso', 'Patrocinios', 2000.00, 'Patrocinio empresa local', '2025-01-05', 'ING-2025-002', 1),
('Egreso', 'Equipamiento', 800.00, 'Compra de balones y redes', '2025-01-12', 'EGR-2025-002', 2),
('Ingreso', 'Eventos', 450.00, 'Venta de entradas torneo', '2025-01-18', 'ING-2025-003', 2);

-- Insertar participantes
INSERT INTO participantes (nombre, cedula, fecha_nacimiento, genero, telefono, email, estado) VALUES
('Roberto Zambrano', '1312345678', '1995-05-15', 'M', '0998765432', 'roberto.z@email.com', 'Activo'),
('Laura Mendoza', '1323456789', '1998-08-22', 'F', '0987654321', 'laura.m@email.com', 'Activo'),
('Diego Cedeño', '1334567890', '2000-12-10', 'M', '0976543210', 'diego.c@email.com', 'Activo');

SELECT 'Datos de prueba insertados exitosamente!' as Mensaje;
SELECT 'Total de usuarios:', COUNT(*) FROM usuarios;
SELECT 'Total de eventos:', COUNT(*) FROM eventos;
SELECT 'Total de campeonatos:', COUNT(*) FROM campeonatos;
SELECT 'Total de cursos:', COUNT(*) FROM cursos_vacacionales;
