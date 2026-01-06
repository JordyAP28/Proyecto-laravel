"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Plus,
  Trash2,
  Download,
  FileSpreadsheet,
  UserCog,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  ChevronRight,
  Shield,
  User,
  Trophy,
  GraduationCap,
  Building2,
  DollarSign,
  BarChart3,
  Clock,
  MapPin,
  Filter,
  RefreshCw,
  Printer,
  Activity,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Target,
  Calendar,
  Award,
  Medal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts"

type Section =
  | "dashboard"
  | "usuarios"
  | "actividades"
  | "cursos"
  | "clubes"
  | "contabilidad"
  | "estadisticas"
  | "reportes"

interface Usuario {
  id_usuario: number
  primer_nombre: string
  apellido: string
  email: string
  id_rol: number
  telefono?: string
  created_at?: string
}

interface ActividadDeportiva {
  id: number
  nombre: string
  descripcion: string
  categoria: string
  deporte: "futbol" | "basquet"
  fechaInicio: string
  fechaFin: string
  equiposInscritos: number
  maxEquipos: number
  ubicacion: string
  estado: "activo" | "finalizado" | "proximo" | "en_curso" | "lleno"
  premios: string
}

interface CursoVacacional {
  id: number
  nombre: string
  descripcion: string
  instructor: string
  fecha_inicio: string
  fecha_fin: string
  horario: string
  capacidad: number
  inscritos: number
  precio: number
  edad_minima: number
  edad_maxima: number
  estado: "abierto" | "cerrado" | "en_curso" | "finalizado"
}

interface Club {
  id: number
  nombre: string
  presidente: string
  fundacion: string
  colores: string
  estadio: string
  jugadores: number
  categoria: string
  estado: "activo" | "inactivo"
  logros: string
  cuota_mensual: number // Added field
  descripcion: string // Added field
}

interface Transaccion {
  id: number
  concepto: string
  tipo: "ingreso" | "egreso"
  monto: number
  fecha: string
  categoria: string
  referencia: string
  estado: "completado" | "pendiente" | "cancelado"
}

interface FormData {
  primer_nombre: string
  apellido: string
  email: string
  password: string
  id_rol: number
}

const API_BASE = "http://127.0.0.1:8000/api"

const navItems = [
  { id: "dashboard" as Section, label: "Dashboard", icon: LayoutDashboard },
  { id: "usuarios" as Section, label: "Usuarios", icon: Users },
  { id: "actividades" as Section, label: "Actividades Deportivas", icon: Trophy },
  { id: "cursos" as Section, label: "Cursos Vacacionales", icon: GraduationCap },
  { id: "clubes" as Section, label: "Clubes", icon: Building2 },
  { id: "contabilidad" as Section, label: "Contabilidad", icon: DollarSign },
  { id: "estadisticas" as Section, label: "Estadísticas", icon: BarChart3 },
  { id: "reportes" as Section, label: "Reportes", icon: FileText },
]

// Sample data for charts
const monthlyData = [
  { mes: "Ene", ingresos: 12500, egresos: 8200, usuarios: 45 },
  { mes: "Feb", ingresos: 15800, egresos: 9100, usuarios: 52 },
  { mes: "Mar", ingresos: 18200, egresos: 10500, usuarios: 68 },
  { mes: "Abr", ingresos: 16900, egresos: 9800, usuarios: 61 },
  { mes: "May", ingresos: 21500, egresos: 12300, usuarios: 78 },
  { mes: "Jun", ingresos: 25800, egresos: 14200, usuarios: 95 },
]

const actividadesData = [
  { nombre: "Alberto Jama Sub-40", inscritos: 12, color: "#22c55e" },
  { nombre: "Sub 14", inscritos: 16, color: "#0ea5e9" },
  { nombre: "Senior", inscritos: 10, color: "#f59e0b" },
  { nombre: "Básquet Femenino", inscritos: 8, color: "#ef4444" },
  { nombre: "Básquet Masculino", inscritos: 8, color: "#8b5cf6" },
]

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444"]

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<Section>("dashboard")
  const [formModal, setFormModal] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [actividadModal, setActividadModal] = useState(false)
  const [cursoModal, setCursoModal] = useState(false)
  const [clubModal, setClubModal] = useState(false)
  const [transaccionModal, setTransaccionModal] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    primer_nombre: "",
    apellido: "",
    email: "",
    password: "",
    id_rol: 3,
  })

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [total, setTotal] = useState(0)

  const [actividades, setActividades] = useState<ActividadDeportiva[]>([
    {
      id: 1,
      nombre: "Campeonato Alberto Jama Sub-40",
      descripcion: "Campeonato de fútbol categoría Sub-40 en honor a Alberto Jama",
      categoria: "Sub-40",
      deporte: "futbol",
      fechaInicio: "2024-03-01",
      fechaFin: "2024-06-30",
      equiposInscritos: 12,
      maxEquipos: 16,
      ubicacion: "Estadio Municipal de Montecristi",
      estado: "en_curso",
      premios: "Trofeo + $2,000",
    },
    {
      id: 2,
      nombre: "Campeonato Sub 14",
      descripcion: "Campeonato de fútbol juvenil categoría Sub-14",
      categoria: "Sub-14",
      deporte: "futbol",
      fechaInicio: "2024-04-15",
      fechaFin: "2024-07-15",
      equiposInscritos: 16,
      maxEquipos: 16,
      ubicacion: "Complejo Deportivo Montecristi",
      estado: "activo",
      premios: "Trofeo + Medallas + Uniformes",
    },
    {
      id: 3,
      nombre: "Campeonato Senior",
      descripcion: "Campeonato de fútbol categoría Senior para mayores de 45 años",
      categoria: "Senior",
      deporte: "futbol",
      fechaInicio: "2024-05-01",
      fechaFin: "2024-08-31",
      equiposInscritos: 10,
      maxEquipos: 12,
      ubicacion: "Estadio Municipal de Montecristi",
      estado: "activo",
      premios: "Trofeo + $1,500",
    },
    {
      id: 4,
      nombre: "Campeonato de Básquet Femenino",
      descripcion: "Campeonato oficial de básquetbol femenino de la Liga Cantonal",
      categoria: "Libre",
      deporte: "basquet",
      fechaInicio: "2024-06-01",
      fechaFin: "2024-09-30",
      equiposInscritos: 8,
      maxEquipos: 10,
      ubicacion: "Coliseo de Montecristi",
      estado: "proximo",
      premios: "Trofeo + $1,000",
    },
    {
      id: 5,
      nombre: "Campeonato de Básquet Masculino",
      descripcion: "Campeonato oficial de básquetbol masculino de la Liga Cantonal",
      categoria: "Libre",
      deporte: "basquet",
      fechaInicio: "2024-06-01",
      fechaFin: "2024-09-30",
      equiposInscritos: 8,
      maxEquipos: 10,
      ubicacion: "Coliseo de Montecristi",
      estado: "proximo",
      premios: "Trofeo + $1,200",
    },
  ])

  const [cursos, setCursos] = useState<CursoVacacional[]>([
    {
      id: 1,
      nombre: "Ajedrez",
      descripcion: "Curso vacacional de ajedrez para niños y jóvenes",
      instructor: "Prof. Marco Cedeño",
      fecha_inicio: "2024-07-01",
      fecha_fin: "2024-08-15",
      horario: "9:00-11:00",
      capacidad: 30,
      inscritos: 30,
      precio: 25,
      edad_minima: 6,
      edad_maxima: 16,
      estado: "cerrado",
    },
    {
      id: 2,
      nombre: "Básquet",
      descripcion: "Curso vacacional de básquetbol - Fundamentos y técnicas",
      instructor: "Prof. Carlos Mendoza",
      fecha_inicio: "2024-07-15",
      fecha_fin: "2024-08-30",
      horario: "8:00-10:00",
      capacidad: 40,
      inscritos: 32,
      precio: 30,
      edad_minima: 8,
      edad_maxima: 17,
      estado: "en_curso",
    },
    {
      id: 3,
      nombre: "Fútbol",
      descripcion: "Escuela de fútbol vacacional - Técnica y táctica",
      instructor: "Prof. Juan Delgado",
      fecha_inicio: "2024-07-15",
      fecha_fin: "2024-08-30",
      horario: "7:00-9:00 / 16:00-18:00",
      capacidad: 60,
      inscritos: 48,
      precio: 35,
      edad_minima: 5,
      edad_maxima: 15,
      estado: "en_curso",
    },
    {
      id: 4,
      nombre: "Boxeo",
      descripcion: "Curso de boxeo recreativo - Defensa personal y condición física",
      instructor: "Prof. Roberto Vera",
      fecha_inicio: "2024-07-20",
      fecha_fin: "2024-08-25",
      horario: "17:00-19:00",
      capacidad: 25,
      inscritos: 18,
      precio: 40,
      edad_minima: 10,
      edad_maxima: 18,
      estado: "en_curso",
    },
    {
      id: 5,
      nombre: "Taekwondo",
      descripcion: "Arte marcial coreano - Disciplina y defensa personal",
      instructor: "Sensei María Loor",
      fecha_inicio: "2024-07-18",
      fecha_fin: "2024-08-28",
      horario: "16:00-18:00",
      capacidad: 35,
      inscritos: 28,
      precio: 45,
      edad_minima: 6,
      edad_maxima: 16,
      estado: "en_curso",
    },
  ])

  const [clubes, setClubes] = useState<Club[]>([
    {
      id: 1,
      nombre: "El Nacional",
      presidente: "José García Mendoza",
      fundacion: "1985",
      colores: "Rojo y Azul",
      estadio: "Cancha El Nacional",
      jugadores: 28,
      categoria: "Primera",
      estado: "activo",
      logros: "Campeón 2022, 2019",
      cuota_mensual: 20, // Added
      descripcion: "Club deportivo de fútbol fundado en 1985.", // Added
    },
    {
      id: 2,
      nombre: "Deportivo Chorrillo",
      presidente: "Manuel López Castro",
      fundacion: "1990",
      colores: "Verde y Blanco",
      estadio: "Cancha El Chorrillo",
      jugadores: 25,
      categoria: "Primera",
      estado: "activo",
      logros: "Subcampeón 2023",
      cuota_mensual: 22, // Added
      descripcion: "Club de fútbol con historia en la región.", // Added
    },
    {
      id: 3,
      nombre: "América del Chorrillo",
      presidente: "Pedro Sánchez Vera",
      fundacion: "1988",
      colores: "Amarillo y Rojo",
      estadio: "Cancha América",
      jugadores: 30,
      categoria: "Primera",
      estado: "activo",
      logros: "Campeón 2021",
      cuota_mensual: 18, // Added
      descripcion: "Club con enfoque en el desarrollo de talento joven.", // Added
    },
    {
      id: 4,
      nombre: "8 de Enero",
      presidente: "Ricardo Delgado Moreira",
      fundacion: "1978",
      colores: "Azul y Blanco",
      estadio: "Estadio 8 de Enero",
      jugadores: 26,
      categoria: "Primera",
      estado: "activo",
      logros: "Campeón histórico 5 veces",
      cuota_mensual: 25, // Added
      descripcion: "Club decano de la liga local.", // Added
    },
    {
      id: 5,
      nombre: "Independiente Colorado",
      presidente: "Carlos Vera Zambrano",
      fundacion: "1995",
      colores: "Rojo",
      estadio: "Cancha Colorado",
      jugadores: 24,
      categoria: "Primera",
      estado: "activo",
      logros: "Campeón 2020",
      cuota_mensual: 20, // Added
      descripcion: "Un club apasionado por el deporte.", // Added
    },
    {
      id: 6,
      nombre: "Independiente Montecristi",
      presidente: "Luis Cedeño García",
      fundacion: "1982",
      colores: "Negro y Blanco",
      estadio: "Cancha Independiente",
      jugadores: 27,
      categoria: "Primera",
      estado: "activo",
      logros: "Subcampeón 2022",
      cuota_mensual: 23, // Added
      descripcion: "Club con fuerte arraigo en la comunidad.", // Added
    },
    {
      id: 7,
      nombre: "Club San José",
      presidente: "Fernando Moreira López",
      fundacion: "1992",
      colores: "Celeste y Blanco",
      estadio: "Cancha San José",
      jugadores: 23,
      categoria: "Primera",
      estado: "activo",
      logros: "3er lugar 2023",
      cuota_mensual: 19, // Added
      descripcion: "Promoviendo el deporte y la sana convivencia.", // Added
    },
    {
      id: 8,
      nombre: "Relámpago Azul",
      presidente: "Andrés Castro Mendoza",
      fundacion: "2000",
      colores: "Azul Eléctrico",
      estadio: "Cancha Relámpago",
      jugadores: 22,
      categoria: "Segunda",
      estado: "activo",
      logros: "Ascenso 2023",
      cuota_mensual: 15, // Added
      descripcion: "Club emergente con gran potencial.", // Added
    },
  ])

  const [transacciones, setTransacciones] = useState<Transaccion[]>([
    {
      id: 1,
      concepto: "Inscripciones Natación",
      tipo: "ingreso",
      monto: 2500,
      fecha: "2024-01-15",
      categoria: "Actividades",
      referencia: "INS-001",
      estado: "completado",
    },
    {
      id: 2,
      concepto: "Mantenimiento Piscina",
      tipo: "egreso",
      monto: 1200,
      fecha: "2024-01-14",
      categoria: "Mantenimiento",
      referencia: "MNT-015",
      estado: "completado",
    },
    {
      id: 3,
      concepto: "Cuotas Club Running",
      tipo: "ingreso",
      monto: 1230,
      fecha: "2024-01-13",
      categoria: "Clubes",
      referencia: "CLB-089",
      estado: "completado",
    },
    {
      id: 4,
      concepto: "Equipamiento Deportivo",
      tipo: "egreso",
      monto: 3500,
      fecha: "2024-01-12",
      categoria: "Equipamiento",
      referencia: "EQP-022",
      estado: "pendiente",
    },
    {
      id: 5,
      concepto: "Cursos Vacacionales",
      tipo: "ingreso",
      monto: 4800,
      fecha: "2024-01-10",
      categoria: "Cursos",
      referencia: "CRS-156",
      estado: "completado",
    },
  ])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [usuariosRes, totalRes] = await Promise.all([
          fetch(`${API_BASE}/admin/usuarios`),
          fetch(`${API_BASE}/admin/contar-usuarios`),
        ])
        const usuariosData = await usuariosRes.json()
        const totalData = await totalRes.json()
        setUsuarios(usuariosData.data || [])
        setTotal(totalData.total || 0)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Demo data for preview
        setUsuarios([
          { id_usuario: 1, primer_nombre: "Admin", apellido: "Principal", email: "admin@sistema.com", id_rol: 1 },
          { id_usuario: 2, primer_nombre: "María", apellido: "García", email: "maria@email.com", id_rol: 3 },
          { id_usuario: 3, primer_nombre: "Juan", apellido: "Pérez", email: "juan@email.com", id_rol: 3 },
          { id_usuario: 4, primer_nombre: "Carlos", apellido: "López", email: "carlos@email.com", id_rol: 2 },
        ])
        setTotal(4)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, id_rol: Number.parseInt(value) })
  }

  const crearUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    const nuevoUsuario: Usuario = {
      id_usuario: Date.now(),
      primer_nombre: formData.primer_nombre,
      apellido: formData.apellido,
      email: formData.email,
      id_rol: formData.id_rol,
      created_at: new Date().toISOString(),
    }
    setUsuarios([...usuarios, nuevoUsuario])
    setTotal(total + 1)
    setFormModal(false)
    setFormData({ primer_nombre: "", apellido: "", email: "", password: "", id_rol: 3 })
  }

  const eliminarUsuario = (id: number) => {
    setUsuarios(usuarios.filter((u) => u.id_usuario !== id))
    setTotal(total - 1)
    setDeleteDialog(null)
  }

  const exportarReporte = async (tipo: string, formato: "excel" | "pdf") => {
    setIsExporting(`${tipo}-${formato}`)
    try {
      const endpoint = formato === "excel" ? `${API_BASE}/reportes/${tipo}/excel` : `${API_BASE}/reportes/${tipo}/pdf`
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(`Error ${formato}`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `reporte_${tipo}.${formato === "excel" ? "xlsx" : "pdf"}`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(`No se pudo descargar el ${formato}`, error)
    } finally {
      setIsExporting(null)
    }
  }

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.primer_nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const adminCount = usuarios.filter((u) => u.id_rol === 1).length
  const userCount = usuarios.filter((u) => u.id_rol !== 1).length

  const totalIngresos = transacciones
    .filter((t) => t.tipo === "ingreso" && t.estado === "completado")
    .reduce((acc, t) => acc + t.monto, 0)
  const totalEgresos = transacciones
    .filter((t) => t.tipo === "egreso" && t.estado === "completado")
    .reduce((acc, t) => acc + t.monto, 0)
  const balance = totalIngresos - totalEgresos

  const getRoleBadge = (rol: number) => {
    if (rol === 1) {
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          <Shield className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      )
    }
    if (rol === 2) {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
          <UserCog className="mr-1 h-3 w-3" />
          Moderador
        </Badge>
      )
    }
    return (
      <Badge variant="secondary">
        <User className="mr-1 h-3 w-3" />
        Usuario
      </Badge>
    )
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
      case "abierto":
      case "completado":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            {estado}
          </Badge>
        )
      case "inactivo":
      case "cerrado":
      case "cancelado":
        return (
          <Badge className="bg-red-500/10 text-red-600">
            <XCircle className="mr-1 h-3 w-3" />
            {estado}
          </Badge>
        )
      case "lleno":
        return (
          <Badge className="bg-amber-500/10 text-amber-600">
            <AlertCircle className="mr-1 h-3 w-3" />
            {estado}
          </Badge>
        )
      case "en_curso":
        return (
          <Badge className="bg-blue-500/10 text-blue-600">
            <Activity className="mr-1 h-3 w-3" />
            En Curso
          </Badge>
        )
      case "pendiente":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600">
            <Clock className="mr-1 h-3 w-3" />
            {estado}
          </Badge>
        )
      // Added states for campeonatos and clubes
      case "proximo":
        return (
          <Badge className="bg-cyan-500/10 text-cyan-600">
            <Clock className="mr-1 h-3 w-3" />
            Próximo
          </Badge>
        )
      case "finalizado":
        return (
          <Badge className="bg-gray-500/10 text-gray-600">
            <Clock className="mr-1 h-3 w-3" />
            Finalizado
          </Badge>
        )
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const getActividadIcon = (deporte: string) => {
    switch (deporte) {
      case "futbol":
        return <Trophy className="h-5 w-5" />
      case "basquet":
        return <Target className="h-5 w-5" />
      default:
        return <Trophy className="h-5 w-5" />
    }
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={`hidden flex-col border-r bg-card md:flex transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"}`}
      >
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && <span className="text-lg font-semibold">Admin Panel</span>}
        </div>

        {!sidebarCollapsed && (
          <div className="flex flex-col gap-1 p-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Administrador</span>
                <span className="text-xs text-muted-foreground">Panel de control</span>
              </div>
            </div>
          </div>
        )}

        <Separator />

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = section === item.id
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && item.label}
                {isActive && !sidebarCollapsed && <ChevronRight className="ml-auto h-4 w-4" />}
              </button>
            )
          })}
        </nav>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            className={`w-full gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive ${sidebarCollapsed ? "justify-center px-2" : "justify-start"}`}
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && "Cerrar sesión"}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">Admin</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <DropdownMenuItem key={item.id} onClick={() => setSection(item.id)}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="container mx-auto max-w-7xl p-6">
          {/* Dashboard Section */}
          {section === "dashboard" && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Bienvenido, Administrador</h1>
                <p className="text-muted-foreground">Aquí tienes un resumen general de tu sistema.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full bg-primary/10" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Usuarios</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{isLoading ? "..." : total}</div>
                    <p className="mt-1 flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-500">+12%</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full bg-emerald-500/10" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">${balance.toLocaleString()}</div>
                    <p className="mt-1 flex items-center text-xs text-muted-foreground">
                      <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-500">+8%</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full bg-amber-500/10" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Actividades</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{actividades.length}</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {actividades.filter((a) => a.estado === "activo").length} activas
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full bg-blue-500/10" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Cursos</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{cursos.length}</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cursos.filter((c) => c.estado === "abierto" || c.estado === "en_curso").length} disponibles
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Ingresos vs Egresos</CardTitle>
                    <CardDescription>Comparativa mensual del flujo financiero</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="mes" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="ingresos"
                          stroke="#22c55e"
                          fillOpacity={1}
                          fill="url(#colorIngresos)"
                        />
                        <Area
                          type="monotone"
                          dataKey="egresos"
                          stroke="#ef4444"
                          fillOpacity={1}
                          fill="url(#colorEgresos)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribución de Actividades</CardTitle>
                    <CardDescription>Inscritos por actividad deportiva</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={actividadesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="inscritos"
                        >
                          {actividadesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>Gestiona tu sistema desde aquí</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button onClick={() => setFormModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Usuario
                  </Button>
                  <Button variant="outline" onClick={() => setActividadModal(true)}>
                    <Trophy className="mr-2 h-4 w-4" />
                    Nueva Actividad
                  </Button>
                  <Button variant="outline" onClick={() => setCursoModal(true)}>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Nuevo Curso
                  </Button>
                  <Button variant="outline" onClick={() => setSection("reportes")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generar Reportes
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Usuarios Section */}
          {section === "usuarios" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
                  <p className="text-muted-foreground">Administra todos los usuarios del sistema</p>
                </div>
                <Button onClick={() => setFormModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Usuario
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Lista de Usuarios</CardTitle>
                      <CardDescription>{total} usuarios en total</CardDescription>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar usuarios..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  ) : filteredUsuarios.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                      <Users className="mb-3 h-12 w-12" />
                      <p className="text-lg font-medium">No se encontraron usuarios</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsuarios.map((u) => (
                            <TableRow key={u.id_usuario}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">
                                      {getInitials(u.primer_nombre, u.apellido)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {u.primer_nombre} {u.apellido}
                                    </p>
                                    <p className="text-xs text-muted-foreground">ID: {u.id_usuario}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{u.email}</TableCell>
                              <TableCell>{getRoleBadge(u.id_rol)}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Ver detalles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => setDeleteDialog(u.id_usuario)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {section === "actividades" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Campeonatos Deportivos</h1>
                  <p className="text-muted-foreground">
                    Liga Deportiva Cantonal de Montecristi - Gestión de campeonatos
                  </p>
                </div>
                <Button onClick={() => setActividadModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Campeonato
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Campeonatos</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{actividades.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">En Curso</CardTitle>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {actividades.filter((a) => a.estado === "en_curso" || a.estado === "activo").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Próximos</CardTitle>
                    <Calendar className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">
                      {actividades.filter((a) => a.estado === "proximo").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Fútbol</CardTitle>
                    <Trophy className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">
                      {actividades.filter((a) => a.deporte === "futbol").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Básquet</CardTitle>
                    <Target className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {actividades.filter((a) => a.deporte === "basquet").length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Campeonatos de Fútbol */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-emerald-600" />
                  Campeonatos de Fútbol
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {actividades
                    .filter((a) => a.deporte === "futbol")
                    .map((campeonato) => (
                      <Card key={campeonato.id} className="overflow-hidden">
                        <CardHeader className="pb-3 bg-gradient-to-r from-emerald-500/10 to-transparent">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600">
                                <Trophy className="h-6 w-6" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{campeonato.nombre}</CardTitle>
                                <Badge variant="outline" className="mt-1">
                                  {campeonato.categoria}
                                </Badge>
                              </div>
                            </div>
                            {getEstadoBadge(campeonato.estado)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                          <p className="text-sm text-muted-foreground">{campeonato.descripcion}</p>
                          <Separator />
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{campeonato.fechaInicio}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{campeonato.ubicacion}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Equipos inscritos</span>
                              <span className="font-medium">
                                {campeonato.equiposInscritos}/{campeonato.maxEquipos}
                              </span>
                            </div>
                            <Progress
                              value={(campeonato.equiposInscritos / campeonato.maxEquipos) * 100}
                              className="h-2"
                            />
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="h-4 w-4 text-amber-500" />
                            <span className="font-medium text-amber-600">{campeonato.premios}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/30 px-6 py-3">
                          <div className="flex w-full gap-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Eye className="mr-2 h-4 w-4" />
                              VerTabla
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Edit className="mr-2 h-4 w-4" />
                              Gestionar
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Campeonatos de Básquet */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Campeonatos de Básquet
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {actividades
                    .filter((a) => a.deporte === "basquet")
                    .map((campeonato) => (
                      <Card key={campeonato.id} className="overflow-hidden">
                        <CardHeader className="pb-3 bg-gradient-to-r from-purple-500/10 to-transparent">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-600">
                                <Target className="h-6 w-6" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{campeonato.nombre}</CardTitle>
                                <Badge variant="outline" className="mt-1">
                                  {campeonato.categoria}
                                </Badge>
                              </div>
                            </div>
                            {getEstadoBadge(campeonato.estado)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                          <p className="text-sm text-muted-foreground">{campeonato.descripcion}</p>
                          <Separator />
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{campeonato.fechaInicio}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{campeonato.ubicacion}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Equipos inscritos</span>
                              <span className="font-medium">
                                {campeonato.equiposInscritos}/{campeonato.maxEquipos}
                              </span>
                            </div>
                            <Progress
                              value={(campeonato.equiposInscritos / campeonato.maxEquipos) * 100}
                              className="h-2"
                            />
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="h-4 w-4 text-amber-500" />
                            <span className="font-medium text-amber-600">{campeonato.premios}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/30 px-6 py-3">
                          <div className="flex w-full gap-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Eye className="mr-2 h-4 w-4" />
                              VerTabla
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Edit className="mr-2 h-4 w-4" />
                              Gestionar
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          )}

          {section === "cursos" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Cursos Vacacionales</h1>
                  <p className="text-muted-foreground">Gestiona los cursos vacacionales disponibles</p>
                </div>
                <Button onClick={() => setCursoModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Curso
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Cursos</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{cursos.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Abiertos</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">
                      {cursos.filter((c) => c.estado === "abierto").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">En Curso</CardTitle>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {cursos.filter((c) => c.estado === "en_curso").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Inscritos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{cursos.reduce((acc, c) => acc + c.inscritos, 0)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lista de Cursos</CardTitle>
                  <CardDescription>Todos los cursos vacacionales registrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Curso</TableHead>
                          <TableHead>Instructor</TableHead>
                          <TableHead>Fechas</TableHead>
                          <TableHead>Edades</TableHead>
                          <TableHead>Capacidad</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cursos.map((curso) => (
                          <TableRow key={curso.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{curso.nombre}</p>
                                <p className="text-xs text-muted-foreground">{curso.horario}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{curso.instructor}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{curso.fecha_inicio}</p>
                                <p className="text-muted-foreground">al {curso.fecha_fin}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {curso.edad_minima}-{curso.edad_maxima} años
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>
                                  {curso.inscritos}/{curso.capacidad}
                                </span>
                                <Progress value={(curso.inscritos / curso.capacidad) * 100} className="h-1.5 w-16" />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">${curso.precio}</TableCell>
                            <TableCell>{getEstadoBadge(curso.estado)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Users className="mr-2 h-4 w-4" />
                                    Ver inscritos
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {section === "clubes" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Clubes Afiliados</h1>
                  <p className="text-muted-foreground">Liga Deportiva Cantonal de Montecristi - Clubes de fútbol</p>
                </div>
                <Button onClick={() => setClubModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Club
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Clubes</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{clubes.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Primera División</CardTitle>
                    <Trophy className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">
                      {clubes.filter((c) => c.categoria === "Primera").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Segunda División</CardTitle>
                    <Medal className="h-4 w-4 text-zinc-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-zinc-600">
                      {clubes.filter((c) => c.categoria === "Segunda").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Jugadores</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{clubes.reduce((acc, c) => acc + c.jugadores, 0)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Clubes de Fútbol Afiliados</CardTitle>
                  <CardDescription>
                    Todos los clubes registrados en la Liga Deportiva Cantonal de Montecristi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Club</TableHead>
                          <TableHead>Presidente</TableHead>
                          <TableHead>Fundación</TableHead>
                          <TableHead>Colores</TableHead>
                          <TableHead>Estadio</TableHead>
                          <TableHead>Jugadores</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Logros</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clubes.map((club) => (
                          <TableRow key={club.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                  <Shield className="h-5 w-5" />
                                </div>
                                <span className="font-medium">{club.nombre}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{club.presidente}</TableCell>
                            <TableCell>{club.fundacion}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{club.colores}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{club.estadio}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {club.jugadores}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={club.categoria === "Primera" ? "default" : "secondary"}>
                                {club.categoria}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-muted-foreground">{club.logros}</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Users className="mr-2 h-4 w-4" />
                                    Ver plantilla
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Cards view for clubs */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {clubes.map((club) => (
                  <Card key={club.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Shield className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{club.nombre}</CardTitle>
                          <Badge variant={club.categoria === "Primera" ? "default" : "secondary"} className="mt-1">
                            {club.categoria}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Colores:</span>
                        <span className="font-medium">{club.colores}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Jugadores:</span>
                        <span className="font-medium">{club.jugadores}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fundación:</span>
                        <span className="font-medium">{club.fundacion}</span>
                      </div>
                      <Separator className="my-2" />
                      <p className="text-xs text-muted-foreground">{club.logros}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {section === "contabilidad" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Contabilidad</h1>
                  <p className="text-muted-foreground">Control financiero del sistema</p>
                </div>
                <Button onClick={() => setTransaccionModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Transacción
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-emerald-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">${totalIngresos.toLocaleString()}</div>
                    <p className="mt-1 text-xs text-muted-foreground">+12% vs mes anterior</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Egresos</CardTitle>
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">${totalEgresos.toLocaleString()}</div>
                    <p className="mt-1 text-xs text-muted-foreground">+5% vs mes anterior</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      ${balance.toLocaleString()}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Balance actual</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">
                      {transacciones.filter((t) => t.estado === "pendiente").length}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Transacciones por procesar</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Historial de Transacciones</CardTitle>
                      <CardDescription>Registro de movimientos financieros</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportarReporte("contabilidad", "excel")}>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Referencia</TableHead>
                          <TableHead>Concepto</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transacciones.map((transaccion) => (
                          <TableRow key={transaccion.id}>
                            <TableCell className="font-mono text-sm">{transaccion.referencia}</TableCell>
                            <TableCell className="font-medium">{transaccion.concepto}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{transaccion.categoria}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{transaccion.fecha}</TableCell>
                            <TableCell>
                              {transaccion.tipo === "ingreso" ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600">
                                  <ArrowUpRight className="mr-1 h-3 w-3" />
                                  Ingreso
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500/10 text-red-600">
                                  <ArrowDownRight className="mr-1 h-3 w-3" />
                                  Egreso
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell
                              className={`font-bold ${transaccion.tipo === "ingreso" ? "text-emerald-600" : "text-red-600"}`}
                            >
                              {transaccion.tipo === "ingreso" ? "+" : "-"}${transaccion.monto.toLocaleString()}
                            </TableCell>
                            <TableCell>{getEstadoBadge(transaccion.estado)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Receipt className="mr-2 h-4 w-4" />
                                    Ver comprobante
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {section === "estadisticas" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Estadísticas</h1>
                  <p className="text-muted-foreground">Análisis y métricas del sistema</p>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="6m">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">Último mes</SelectItem>
                      <SelectItem value="3m">Últimos 3 meses</SelectItem>
                      <SelectItem value="6m">Últimos 6 meses</SelectItem>
                      <SelectItem value="1y">Último año</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Actualizar
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="general" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
                  <TabsTrigger value="financiero">Financiero</TabsTrigger>
                  <TabsTrigger value="actividades">Actividades</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Crecimiento de Usuarios</CardTitle>
                        <CardDescription>Nuevos registros por mes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="mes" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="usuarios" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Flujo de Caja</CardTitle>
                        <CardDescription>Tendencia de ingresos y egresos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="mes" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                              }}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="ingresos"
                              stroke="#22c55e"
                              strokeWidth={2}
                              dot={{ fill: "#22c55e" }}
                            />
                            <Line
                              type="monotone"
                              dataKey="egresos"
                              stroke="#ef4444"
                              strokeWidth={2}
                              dot={{ fill: "#ef4444" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Distribución por Actividad</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <RechartsPieChart>
                            <Pie
                              data={actividadesData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="inscritos"
                              label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                            >
                              {actividadesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Resumen de Métricas</CardTitle>
                        <CardDescription>Indicadores clave de rendimiento</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Tasa de ocupación</span>
                              <span className="font-medium">78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Retención de usuarios</span>
                              <span className="font-medium">92%</span>
                            </div>
                            <Progress value={92} className="h-2" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Satisfacción</span>
                              <span className="font-medium">4.8/5</span>
                            </div>
                            <Progress value={96} className="h-2" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Meta de ingresos</span>
                              <span className="font-medium">85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="usuarios" className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Nuevos este mes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">47</div>
                        <p className="mt-1 flex items-center text-xs text-emerald-600">
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                          +18%
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios activos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">312</div>
                        <p className="mt-1 text-xs text-muted-foreground">Últimos 30 días</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de conversión</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">23.5%</div>
                        <p className="mt-1 flex items-center text-xs text-emerald-600">
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                          +2.3%
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Churn rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">2.1%</div>
                        <p className="mt-1 flex items-center text-xs text-red-600">
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                          -0.5%
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Registro de Usuarios por Mes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyData}>
                          <defs>
                            <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="mes" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="usuarios"
                            stroke="hsl(var(--primary))"
                            fillOpacity={1}
                            fill="url(#colorUsuarios)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="financiero" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparativa Ingresos vs Egresos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="mes" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Bar dataKey="ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} name="Ingresos" />
                          <Bar dataKey="egresos" fill="#ef4444" radius={[4, 4, 0, 0]} name="Egresos" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="actividades" className="space-y-6">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Popularidad de Actividades</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={actividadesData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis type="number" />
                            <YAxis dataKey="nombre" type="category" width={80} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="inscritos" radius={[0, 4, 4, 0]}>
                              {actividadesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Capacidad vs Ocupación</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {actividades.map((actividad) => (
                            <div key={actividad.id} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{actividad.nombre}</span>
                                <span className="text-muted-foreground">
                                  {actividad.equiposInscritos}/{actividad.maxEquipos}
                                </span>
                              </div>
                              <Progress
                                value={(actividad.equiposInscritos / actividad.maxEquipos) * 100}
                                className="h-2"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {section === "reportes" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
                <p className="text-muted-foreground">Genera y descarga reportes del sistema</p>
              </div>

              <Tabs defaultValue="usuarios" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                  <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
                  <TabsTrigger value="actividades">Actividades</TabsTrigger>
                  <TabsTrigger value="cursos">Cursos</TabsTrigger>
                  <TabsTrigger value="clubes">Clubes</TabsTrigger>
                  <TabsTrigger value="contabilidad">Contabilidad</TabsTrigger>
                </TabsList>

                <TabsContent value="usuarios" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reporte de Usuarios</CardTitle>
                      <CardDescription>Exporta información completa de los usuarios del sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Total de registros</p>
                          <p className="text-2xl font-bold">{total}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Administradores</p>
                          <p className="text-2xl font-bold">{adminCount}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Usuarios regulares</p>
                          <p className="text-2xl font-bold">{userCount}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-3 border-t bg-muted/30 px-6 py-4">
                      <Button
                        onClick={() => exportarReporte("usuarios", "excel")}
                        disabled={isExporting === "usuarios-excel"}
                      >
                        {isExporting === "usuarios-excel" ? (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                        )}
                        Exportar Excel
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => exportarReporte("usuarios", "pdf")}
                        disabled={isExporting === "usuarios-pdf"}
                      >
                        {isExporting === "usuarios-pdf" ? (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <FileText className="mr-2 h-4 w-4" />
                        )}
                        Exportar PDF
                      </Button>
                      <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="actividades" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reporte de Actividades Deportivas</CardTitle>
                      <CardDescription>Información detallada de las actividades y sus inscritos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Total actividades</p>
                          <p className="text-2xl font-bold">{actividades.length}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Activas</p>
                          <p className="text-2xl font-bold">
                            {actividades.filter((a) => a.estado === "activo").length}
                          </p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Total inscritos</p>
                          <p className="text-2xl font-bold">
                            {actividades.reduce((acc, a) => acc + a.equiposInscritos, 0)}
                          </p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Ocupación promedio</p>
                          <p className="text-2xl font-bold">
                            {Math.round(
                              actividades.reduce((acc, a) => acc + (a.equiposInscritos / a.maxEquipos) * 100, 0) /
                                actividades.length,
                            )}
                            %
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-3 border-t bg-muted/30 px-6 py-4">
                      <Button
                        onClick={() => exportarReporte("actividades", "excel")}
                        disabled={isExporting === "actividades-excel"}
                      >
                        {isExporting === "actividades-excel" ? (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                        )}
                        Exportar Excel
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => exportarReporte("actividades", "pdf")}
                        disabled={isExporting === "actividades-pdf"}
                      >
                        {isExporting === "actividades-pdf" ? (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <FileText className="mr-2 h-4 w-4" />
                        )}
                        Exportar PDF
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="cursos" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reporte de Cursos Vacacionales</CardTitle>
                      <CardDescription>Detalle de cursos, inscripciones e ingresos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Total cursos</p>
                          <p className="text-2xl font-bold">{cursos.length}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">En curso / Abiertos</p>
                          <p className="text-2xl font-bold">
                            {cursos.filter((c) => c.estado === "abierto" || c.estado === "en_curso").length}
                          </p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Total inscritos</p>
                          <p className="text-2xl font-bold">{cursos.reduce((acc, c) => acc + c.inscritos, 0)}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Ingresos totales</p>
                          <p className="text-2xl font-bold">
                            ${cursos.reduce((acc, c) => acc + c.inscritos * c.precio, 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-3 border-t bg-muted/30 px-6 py-4">
                      <Button
                        onClick={() => exportarReporte("cursos", "excel")}
                        disabled={isExporting === "cursos-excel"}
                      >
                        {isExporting === "cursos-excel" ? (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                        )}
                        Exportar Excel
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => exportarReporte("cursos", "pdf")}
                        disabled={isExporting === "cursos-pdf"}
                      >
                        {isExporting === "cursos-pdf" ? (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <FileText className="mr-2 h-4 w-4" />
                        )}
                        Exportar PDF
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="clubes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reporte de Clubes</CardTitle>
                      <CardDescription>Información de clubes, miembros y cuotas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Total clubes</p>
                          <p className="text-2xl font-bold">{clubes.length}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Clubes activos</p>
                          <p className="text-2xl font-bold">{clubes.filter((c) => c.estado === "activo").length}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Total miembros</p>
                          <p className="text-2xl font-bold">{clubes.reduce((acc, c) => acc + c.jugadores, 0)}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Ingresos mensuales</p>
                          <p className="text-2xl font-bold">
                            ${clubes.reduce((acc, c) => acc + c.jugadores * c.cuota_mensual, 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-3 border-t bg-muted/30 px-6 py-4">
                      <Button
                        onClick={() => exportarReporte("clubes", "excel")}
                        disabled={isExporting === "clubes-excel"}
                      >
                        {isExporting === "clubes-excel" ? (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                        )}
                        Exportar Excel
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => exportarReporte("clubes", "pdf")}
                        disabled={isExporting === "clubes-pdf"}
                      >
                        {isExporting === "clubes-pdf" ? (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <FileText className="mr-2 h-4 w-4" />
                        )}
                        Exportar PDF
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="contabilidad" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reporte Contable</CardTitle>
                      <CardDescription>Resumen financiero completo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950">
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">Total ingresos</p>
                          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                            ${totalIngresos.toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                          <p className="text-sm text-red-600 dark:text-red-400">Total egresos</p>
                          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                            ${totalEgresos.toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                          <p className="text-sm text-blue-600 dark:text-blue-400">Balance</p>
                          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            ${balance.toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="text-sm text-muted-foreground">Transacciones</p>
                          <p className="text-2xl font-bold">{transacciones.length}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-3 border-t bg-muted/30 px-6 py-4">
                      <Button
                        onClick={() => exportarReporte("contabilidad", "excel")}
                        disabled={isExporting === "contabilidad-excel"}
                      >
                        {isExporting === "contabilidad-excel" ? (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                        )}
                        Exportar Excel
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => exportarReporte("contabilidad", "pdf")}
                        disabled={isExporting === "contabilidad-pdf"}
                      >
                        {isExporting === "contabilidad-pdf" ? (
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <FileText className="mr-2 h-4 w-4" />
                        )}
                        Exportar PDF
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>

      {/* Create User Modal */}
      <Dialog open={formModal} onOpenChange={setFormModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>Completa el formulario para agregar un nuevo usuario al sistema.</DialogDescription>
          </DialogHeader>
          <form onSubmit={crearUsuario}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="primer_nombre">Nombre</Label>
                <Input
                  id="primer_nombre"
                  name="primer_nombre"
                  placeholder="Ingresa el nombre"
                  value={formData.primer_nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  name="apellido"
                  placeholder="Ingresa el apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="id_rol">Rol</Label>
                <Select value={formData.id_rol.toString()} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Administrador</SelectItem>
                    <SelectItem value="2">Moderador</SelectItem>
                    <SelectItem value="3">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setFormModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Crear Usuario
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={actividadModal} onOpenChange={setActividadModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva Actividad Deportiva</DialogTitle>
            <DialogDescription>Crea una nueva actividad deportiva para el sistema.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // TODO: Implement actual add activity logic
              setActividadModal(false)
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre de la actividad</Label>
                <Input placeholder="Ej: Natación, Fútbol, etc." required />
              </div>
              <div className="grid gap-2">
                <Label>Descripción</Label>
                <Textarea placeholder="Describe la actividad..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Instructor</Label>
                  <Input placeholder="Nombre del instructor" required />
                </div>
                <div className="grid gap-2">
                  <Label>Capacidad</Label>
                  <Input type="number" placeholder="30" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Horario</Label>
                  <Input placeholder="Lun-Mie-Vie 8:00-10:00" required />
                </div>
                <div className="grid gap-2">
                  <Label>Ubicación</Label>
                  <Input placeholder="Cancha Norte" required />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setActividadModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Crear Actividad
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={cursoModal} onOpenChange={setCursoModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo Curso Vacacional</DialogTitle>
            <DialogDescription>Crea un nuevo curso vacacional.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // TODO: Implement actual add course logic
              setCursoModal(false)
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre del curso</Label>
                <Input placeholder="Ej: Campamento de Verano" required />
              </div>
              <div className="grid gap-2">
                <Label>Descripción</Label>
                <Textarea placeholder="Describe el curso..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Fecha inicio</Label>
                  <Input type="date" required />
                </div>
                <div className="grid gap-2">
                  <Label>Fecha fin</Label>
                  <Input type="date" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Precio ($)</Label>
                  <Input type="number" placeholder="150" required />
                </div>
                <div className="grid gap-2">
                  <Label>Edad mínima</Label>
                  <Input type="number" placeholder="6" required />
                </div>
                <div className="grid gap-2">
                  <Label>Edad máxima</Label>
                  <Input type="number" placeholder="12" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Instructor</Label>
                  <Input placeholder="Nombre del instructor" required />
                </div>
                <div className="grid gap-2">
                  <Label>Capacidad</Label>
                  <Input type="number" placeholder="30" required />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCursoModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Crear Curso
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={clubModal} onOpenChange={setClubModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo Club</DialogTitle>
            <DialogDescription>Crea un nuevo club en el sistema.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // TODO: Implement actual add club logic
              setClubModal(false)
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre del club</Label>
                <Input placeholder="Ej: Club de Ajedrez" required />
              </div>
              <div className="grid gap-2">
                <Label>Descripción</Label>
                <Textarea placeholder="Describe el club..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Presidente</Label>
                  <Input placeholder="Nombre del presidente" required />
                </div>
                <div className="grid gap-2">
                  <Label>Categoría</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deportivo">Deportivo</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="estrategia">Estrategia</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Cuota mensual ($)</Label>
                  <Input type="number" placeholder="25" required />
                </div>
                <div className="grid gap-2">
                  <Label>Fecha fundación</Label>
                  <Input type="date" required />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setClubModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Crear Club
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={transaccionModal} onOpenChange={setTransaccionModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva Transacción</DialogTitle>
            <DialogDescription>Registra una nueva transacción financiera.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // TODO: Implement actual add transaction logic
              setTransaccionModal(false)
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Concepto</Label>
                  <Input placeholder="Ej: Venta de entradas" required />
                </div>
                <div className="grid gap-2">
                  <Label>Categoría</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ingresos">Ingresos</SelectItem>
                      <SelectItem value="egresos">Egresos</SelectItem>
                      <SelectItem value="actividades">Actividades</SelectItem>
                      <SelectItem value="cursos">Cursos</SelectItem>
                      <SelectItem value="clubes">Clubes</SelectItem>
                      <SelectItem value="equipamiento">Equipamiento</SelectItem>
                      <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Monto ($)</Label>
                  <Input type="number" placeholder="150.75" required />
                </div>
                <div className="grid gap-2">
                  <Label>Fecha</Label>
                  <Input type="date" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo de transacción</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ingreso">Ingreso</SelectItem>
                      <SelectItem value="egreso">Egreso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Referencia (Opcional)</Label>
                  <Input placeholder="Ej: FAC-001" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Estado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTransaccionModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Registrar Transacción
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialog !== null} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar este usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Todos los datos asociados a este usuario serán eliminados
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialog(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog !== null && eliminarUsuario(deleteDialog)}
              className="bg-destructive hover:bg-destructive/80"
            >
              Eliminar Usuario
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
