'use client'

import { MainNav } from '@/components/main-nav'
import { AdminHeader } from '@/components/admin-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Download, TrendingUp, Users, Trophy, DollarSign, Calendar, FileText } from 'lucide-react'
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

export default function InformesPage() {
  const datosIngresos = [
    { mes: 'Ene', ingresos: 15750, egresos: 8920 },
    { mes: 'Feb', ingresos: 18200, egresos: 9500 },
    { mes: 'Mar', ingresos: 16800, egresos: 10200 },
    { mes: 'Abr', ingresos: 19500, egresos: 9800 },
    { mes: 'May', ingresos: 21000, egresos: 11000 },
    { mes: 'Jun', ingresos: 17500, egresos: 9200 },
  ]

  const datosParticipacion = [
    { mes: 'Ene', participantes: 450 },
    { mes: 'Feb', participantes: 520 },
    { mes: 'Mar', participantes: 480 },
    { mes: 'Abr', participantes: 610 },
    { mes: 'May', participantes: 580 },
    { mes: 'Jun', participantes: 650 },
  ]

  const datosDeportes = [
    { nombre: 'Fútbol', valor: 35, color: '#2d5f3f' },
    { nombre: 'Baloncesto', valor: 25, color: '#e67e22' },
    { nombre: 'Voleibol', valor: 20, color: '#b89d5e' },
    { nombre: 'Natación', valor: 12, color: '#3498db' },
    { nombre: 'Atletismo', valor: 8, color: '#9b59b6' },
  ]

  const reportesDisponibles = [
    {
      titulo: 'Informe Financiero Mensual',
      descripcion: 'Resumen completo de ingresos y egresos',
      fecha: '2025-01-31',
      tipo: 'Financiero',
      icono: DollarSign,
    },
    {
      titulo: 'Estadísticas de Participación',
      descripcion: 'Análisis de participantes por evento',
      fecha: '2025-01-31',
      tipo: 'Participación',
      icono: Users,
    },
    {
      titulo: 'Reporte de Campeonatos',
      descripcion: 'Resultados y estadísticas de torneos',
      fecha: '2025-01-30',
      tipo: 'Deportivo',
      icono: Trophy,
    },
    {
      titulo: 'Análisis de Cursos Vacacionales',
      descripcion: 'Evaluación de programas formativos',
      fecha: '2025-01-28',
      tipo: 'Educativo',
      icono: Calendar,
    },
  ]

  const metricas = [
    {
      titulo: 'Crecimiento Anual',
      valor: '+24.5%',
      descripcion: 'Comparado con 2024',
      tendencia: 'up',
      icono: TrendingUp,
    },
    {
      titulo: 'Total Participantes',
      valor: '3,290',
      descripcion: 'Este año',
      tendencia: 'up',
      icono: Users,
    },
    {
      titulo: 'Eventos Realizados',
      valor: '48',
      descripcion: 'En lo que va del año',
      tendencia: 'up',
      icono: Calendar,
    },
    {
      titulo: 'Ingresos Totales',
      valor: '$108,750',
      descripcion: 'Acumulado 2025',
      tendencia: 'up',
      icono: DollarSign,
    },
  ]

  const handleExportReport = () => {
    console.log('[v0] Exportando informe completo...')
    // Aquí se implementaría la lógica de exportación
  }

  const handleDownloadReport = (titulo: string) => {
    console.log('[v0] Descargando reporte:', titulo)
    // Aquí se implementaría la descarga del reporte específico
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <MainNav />

      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Informes y Estadísticas
              </h1>
              <p className="mt-2 text-muted-foreground">
                Análisis y reportes de la liga deportiva
              </p>
            </div>
            <Button className="gap-2" onClick={handleExportReport}>
              <Download className="h-4 w-4" />
              Exportar Informe
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Métricas Principales */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metricas.map((metrica) => {
            const Icon = metrica.icono
            return (
              <Card key={metrica.titulo}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metrica.titulo}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{metrica.valor}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{metrica.descripcion}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Gráficos */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Ingresos vs Egresos */}
          <Card>
            <CardHeader>
              <CardTitle>Ingresos vs Egresos</CardTitle>
              <CardDescription>Comparativa mensual de flujo financiero</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosIngresos}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#2d5f3f" name="Ingresos" />
                  <Bar dataKey="egresos" fill="#e67e22" name="Egresos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Participación */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Participación</CardTitle>
              <CardDescription>Número de participantes por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosParticipacion}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="participantes" 
                    stroke="#2d5f3f" 
                    strokeWidth={2}
                    name="Participantes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Distribución por Deporte */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Deporte</CardTitle>
              <CardDescription>Participación por disciplina</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={datosDeportes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nombre, valor }) => `${nombre}: ${valor}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {datosDeportes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reportes Disponibles */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Reportes Disponibles</CardTitle>
              <CardDescription>Informes generados recientemente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reportesDisponibles.map((reporte, index) => {
                const Icon = reporte.icono
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{reporte.titulo}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {reporte.tipo}
                          </Badge>
                          <span>•</span>
                          <span>{new Date(reporte.fecha).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleDownloadReport(reporte.titulo)}
                    >
                      <Download className="h-4 w-4" />
                      Descargar
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
