'use client'

import { AdminHeader } from '@/components/admin-header'
import { MainNav } from '@/components/main-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DollarSign, TrendingUp, TrendingDown, Search, Plus, Calendar, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react'
import { useState } from 'react'

export default function ContabilidadPage() {
  const [selectedMonth, setSelectedMonth] = useState('enero')
  const [searchTerm, setSearchTerm] = useState('')

  const resumenFinanciero = {
    ingresosTotales: 15750.00,
    egresosTotales: 8920.50,
    balance: 6829.50,
    ingresosVariacion: '+12.5%',
    egresosVariacion: '+8.3%',
  }

  const [transacciones] = useState([
    {
      id: 1,
      fecha: '2025-01-15',
      concepto: 'Inscripciones Torneo Fútbol',
      categoria: 'Ingresos',
      subcategoria: 'Inscripciones',
      monto: 2400.00,
      tipo: 'ingreso',
      estado: 'Completado',
    },
    {
      id: 2,
      fecha: '2025-01-14',
      concepto: 'Compra de Equipamiento',
      categoria: 'Egresos',
      subcategoria: 'Material Deportivo',
      monto: -1850.00,
      tipo: 'egreso',
      estado: 'Completado',
    },
    {
      id: 3,
      fecha: '2025-01-13',
      concepto: 'Cursos Vacacionales - Natación',
      categoria: 'Ingresos',
      subcategoria: 'Cursos',
      monto: 2250.00,
      tipo: 'ingreso',
      estado: 'Completado',
    },
    {
      id: 4,
      fecha: '2025-01-12',
      concepto: 'Pago Instructores',
      categoria: 'Egresos',
      subcategoria: 'Salarios',
      monto: -3500.00,
      tipo: 'egreso',
      estado: 'Completado',
    },
    {
      id: 5,
      fecha: '2025-01-11',
      concepto: 'Patrocinio Empresa Local',
      categoria: 'Ingresos',
      subcategoria: 'Patrocinios',
      monto: 5000.00,
      tipo: 'ingreso',
      estado: 'Completado',
    },
    {
      id: 6,
      fecha: '2025-01-10',
      concepto: 'Mantenimiento Instalaciones',
      categoria: 'Egresos',
      subcategoria: 'Mantenimiento',
      monto: -1200.50,
      tipo: 'egreso',
      estado: 'Completado',
    },
    {
      id: 7,
      fecha: '2025-01-09',
      concepto: 'Venta de Merchandising',
      categoria: 'Ingresos',
      subcategoria: 'Ventas',
      monto: 850.00,
      tipo: 'ingreso',
      estado: 'Completado',
    },
    {
      id: 8,
      fecha: '2025-01-08',
      concepto: 'Servicios Básicos',
      categoria: 'Egresos',
      subcategoria: 'Servicios',
      monto: -420.00,
      tipo: 'egreso',
      estado: 'Completado',
    },
  ])

  const categorias = [
    { nombre: 'Inscripciones', monto: 4650.00, porcentaje: 29.5 },
    { nombre: 'Cursos', monto: 5250.00, porcentaje: 33.3 },
    { nombre: 'Patrocinios', monto: 5000.00, porcentaje: 31.7 },
    { nombre: 'Ventas', monto: 850.00, porcentaje: 5.4 },
  ]

  const handleCreateTransaction = () => {
    console.log('[v0] Abriendo formulario para crear transacción...')
  }

  const filteredTransacciones = transacciones.filter(transaccion =>
    transaccion.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaccion.subcategoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                Contabilidad
              </h1>
              <p className="mt-2 text-muted-foreground">
                Gestión financiera de la liga deportiva
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {selectedMonth}
              </Button>
              <Button className="gap-2" onClick={handleCreateTransaction}>
                <Plus className="h-4 w-4" />
                Nueva Transacción
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Resumen Financiero */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardDescription>Ingresos Totales</CardDescription>
              <CardTitle className="flex items-baseline gap-2 text-3xl">
                ${resumenFinanciero.ingresosTotales.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-primary">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">{resumenFinanciero.ingresosVariacion}</span>
                <span className="text-muted-foreground">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <CardDescription>Egresos Totales</CardDescription>
              <CardTitle className="flex items-baseline gap-2 text-3xl">
                ${resumenFinanciero.egresosTotales.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-accent">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">{resumenFinanciero.egresosVariacion}</span>
                <span className="text-muted-foreground">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-secondary sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardDescription>Balance Neto</CardDescription>
              <CardTitle className="flex items-baseline gap-2 text-3xl">
                ${resumenFinanciero.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-secondary">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Positivo</span>
                <span className="text-muted-foreground">este mes</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Transacciones */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transacciones Recientes</CardTitle>
                    <CardDescription>Últimos movimientos financieros</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </Button>
                </div>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar transacciones..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTransacciones.map((transaccion) => (
                    <div
                      key={transaccion.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            transaccion.tipo === 'ingreso'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-accent/10 text-accent'
                          }`}
                        >
                          {transaccion.tipo === 'ingreso' ? (
                            <ArrowUpRight className="h-5 w-5" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{transaccion.concepto}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{transaccion.subcategoria}</span>
                            <span>•</span>
                            <span>{new Date(transaccion.fecha).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            transaccion.tipo === 'ingreso' ? 'text-primary' : 'text-accent'
                          }`}
                        >
                          {transaccion.tipo === 'ingreso' ? '+' : ''}$
                          {Math.abs(transaccion.monto).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {transaccion.estado}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categorías de Ingresos */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Categoría</CardTitle>
                <CardDescription>Distribución de ingresos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorias.map((categoria) => (
                  <div key={categoria.nombre}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{categoria.nombre}</span>
                      <span className="text-muted-foreground">
                        ${categoria.monto.toLocaleString('es-ES')}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${categoria.porcentaje}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {categoria.porcentaje}% del total
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
