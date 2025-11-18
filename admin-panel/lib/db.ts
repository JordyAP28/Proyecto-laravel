import mysql from 'mysql2/promise'

// Configuración de la conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'liga_deportiva',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Crear pool de conexiones
let pool: mysql.Pool | null = null

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
    console.log('[v0] Pool de conexiones MySQL creado')
  }
  return pool
}

// Función helper para ejecutar queries
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await getConnection()
  const [results] = await connection.execute(sql, params)
  return results as T
}

// Funciones de utilidad para usuarios
export async function getUsers() {
  return query('SELECT * FROM usuarios ORDER BY id DESC')
}

export async function getUserById(id: number) {
  const results = await query('SELECT * FROM usuarios WHERE id = ?', [id])
  return Array.isArray(results) && results.length > 0 ? results[0] : null
}

export async function createUser(user: {
  nombre: string
  email: string
  password: string
  rol: string
}) {
  return query(
    'INSERT INTO usuarios (nombre, email, password, rol, estado, fecha_registro) VALUES (?, ?, ?, ?, ?, NOW())',
    [user.nombre, user.email, user.password, user.rol, 'Activo']
  )
}

export async function updateUser(id: number, user: Partial<{
  nombre: string
  email: string
  rol: string
  estado: string
}>) {
  const fields = Object.keys(user).map(key => `${key} = ?`).join(', ')
  const values = [...Object.values(user), id]
  return query(`UPDATE usuarios SET ${fields} WHERE id = ?`, values)
}

export async function deleteUser(id: number) {
  return query('DELETE FROM usuarios WHERE id = ?', [id])
}

// Funciones para eventos
export async function getEventos() {
  return query('SELECT * FROM eventos ORDER BY fecha DESC')
}

export async function createEvento(evento: {
  titulo: string
  descripcion: string
  fecha: string
  ubicacion: string
  tipo: string
  capacidad: number
}) {
  return query(
    'INSERT INTO eventos (titulo, descripcion, fecha, ubicacion, tipo, capacidad, participantes_actuales) VALUES (?, ?, ?, ?, ?, ?, 0)',
    [evento.titulo, evento.descripcion, evento.fecha, evento.ubicacion, evento.tipo, evento.capacidad]
  )
}

// Funciones para campeonatos
export async function getCampeonatos() {
  return query('SELECT * FROM campeonatos ORDER BY fecha_inicio DESC')
}

export async function createCampeonato(campeonato: {
  nombre: string
  deporte: string
  categoria: string
  fecha_inicio: string
  fecha_fin: string
  numero_equipos: number
}) {
  return query(
    'INSERT INTO campeonatos (nombre, deporte, categoria, fecha_inicio, fecha_fin, numero_equipos, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [campeonato.nombre, campeonato.deporte, campeonato.categoria, campeonato.fecha_inicio, campeonato.fecha_fin, campeonato.numero_equipos, 'Planificado']
  )
}

// Funciones para contabilidad
export async function getTransacciones() {
  return query('SELECT * FROM transacciones ORDER BY fecha DESC')
}

export async function createTransaccion(transaccion: {
  tipo: string
  categoria: string
  monto: number
  descripcion: string
  fecha: string
}) {
  return query(
    'INSERT INTO transacciones (tipo, categoria, monto, descripcion, fecha) VALUES (?, ?, ?, ?, ?)',
    [transaccion.tipo, transaccion.categoria, transaccion.monto, transaccion.descripcion, transaccion.fecha]
  )
}

export async function getResumenContable() {
  const ingresos = await query<any[]>('SELECT SUM(monto) as total FROM transacciones WHERE tipo = "Ingreso"')
  const egresos = await query<any[]>('SELECT SUM(monto) as total FROM transacciones WHERE tipo = "Egreso"')
  
  return {
    ingresos: ingresos[0]?.total || 0,
    egresos: egresos[0]?.total || 0,
    balance: (ingresos[0]?.total || 0) - (egresos[0]?.total || 0),
  }
}
