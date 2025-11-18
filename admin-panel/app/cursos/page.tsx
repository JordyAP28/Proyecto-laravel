'use client'

import { useState } from 'react'
import { AdminHeader } from '@/components/admin-header'
import { MainNav } from '@/components/main-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { GraduationCap, Calendar, Users, Search, Plus, Clock, DollarSign, CheckCircle } from 'lucide-react'

export default function CursosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cursos] = useState([
    {
      id: 1,
      nombre: 'Curso Vacacional de Natación',
      deporte: 'Natación',
      fechaInicio: '2025-01-22',
      fechaFin: '2025-02-15',
      duracion: '4 semanas',
      edadMin: 6,
      edadMax: 14,
      inscritos: 45,
      cuposMax: 60,
      costo: '$50',
      horario: 'Lunes a Viernes 9:00-11:00',
      instructor: 'Carlos Mendoza',
      estado: 'Inscripciones Abiertas',
    },
    {
      id: 2,
      nombre: 'Escuela de Fútbol Infantil',
      deporte: 'Fútbol',
      fechaInicio: '2025-01-15',
      fechaFin: '2025-03-15',
      duracion: '8 semanas',
      edadMin: 7,
      edadMax: 12,
      inscritos: 80,
      cuposMax: 80,
      costo: '$75',
      horario: 'Martes y Jueves 15:00-17:00',
      instructor: 'Miguel Rodríguez',
      estado: 'Cupos Llenos',
    },
    {
      id: 3,
      nombre: 'Iniciación al Baloncesto',
      deporte: 'Baloncesto',
      fechaInicio: '2025-02-01',
      fechaFin: '2025-03-01',
      duracion: '4 semanas',
      edadMin: 8,
      edadMax: 15,
      inscritos: 28,
      cuposMax: 40,
      costo: '$60',
      horario: 'Lunes, Miércoles y Viernes 14:00-16:00',
      instructor: 'Ana López',
      estado: 'Inscripciones Abiertas',
    },
    {
      id: 4,
      nombre: 'Voleibol Juvenil',
      deporte: 'Voleibol',
      fechaInicio: '2025-02-05',
      fechaFin: '2025-03-10',
      duracion: '5 semanas',
      edadMin: 10,
      edadMax: 16,
      inscritos: 32,
      cuposMax: 36,
      costo: '$55',
      horario: 'Martes y Jueves 16:00-18:00',
      instructor: 'Patricia Vera',
      estado: 'Inscripciones Abiertas',
    },
    {
      id: 5,
      nombre: 'Atletismo y Carreras',
      deporte: 'Atletismo',
      fechaInicio: '2025-01-20',
      fechaFin: '2025-02-20',
      duracion: '4 semanas',
      edadMin: 9,
      edadMax: 17,
      inscritos: 25,
      cuposMax: 50,
      costo: '$45',
      horario: 'Lunes a Viernes 7:00-9:00',
      instructor: 'Roberto Sánchez',
      estado: 'Inscripciones Abiertas',
    },
  ])

  const handleCreateCurso = () => {
    console.log('[v0] Abriendo formulario para crear curso...')
  }

  const handleInscribirse = (id: number, estado: string) => {
    if (estado === 'Cupos Llenos') {
      console.log('[v0] No hay cupos disponibles')
      return
    }
    console.log('[v0] Procesando inscripción al curso con ID:', id)
  }

  const handleViewMore = (id: number) => {
    console.log('[v0] Viendo más detalles del curso con ID:', id)
  }

  const filteredCursos = cursos.filter(curso =>
    curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curso.deporte.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Inscripciones Abiertas':
        return 'bg-primary text-primary-foreground'
      case 'Cupos Llenos':
        return 'bg-accent text-accent-foreground'
      case 'En Curso':
        return 'bg-secondary text-secondary-foreground'
      case 'Finalizado':
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <MainNav />

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Cursos Vacacionales
              </h1>
              <p className="mt-2 text-muted-foreground">
                Programas deportivos para niños y jóvenes
              </p>
            </div>
            <Button className="gap-2" onClick={handleCreateCurso}>
              <Plus className="h-4 w-4" />
              Crear Curso
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cursos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCursos.map((curso) => {
            const porcentajeOcupacion = (curso.inscritos / curso.cuposMax) * 100

            return (
              <Card key={curso.id} className="overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-accent" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge className={getEstadoColor(curso.estado)}>
                          {curso.estado}
                        </Badge>
                        <Badge variant="outline">{curso.deporte}</Badge>
                      </div>
                      <CardTitle className="text-2xl text-balance">{curso.nombre}</CardTitle>
                      <CardDescription className="mt-2">
                        Edades: {curso.edadMin}-{curso.edadMax} años
                      </CardDescription>
                    </div>
                    <GraduationCap className="h-10 w-10 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Detalles */}
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Fechas:</span>
                      <span className="font-medium text-foreground">
                        {new Date(curso.fechaInicio).toLocaleDateString('es-ES')} - {new Date(curso.fechaFin).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Horario:</span>
                      <span className="font-medium text-foreground">{curso.horario}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Duración:</span>
                      <span className="font-medium text-foreground">{curso.duracion}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Instructor:</span>
                      <span className="font-medium text-foreground">{curso.instructor}</span>
                    </div>
                  </div>

                  {/* Cupos */}
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Cupos Disponibles</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {curso.inscritos} / {curso.cuposMax}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${porcentajeOcupacion}%` }}
                      />
                    </div>
                  </div>

                  {/* Costo */}
                  <div className="flex items-center justify-between rounded-lg bg-secondary/20 p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-secondary" />
                      <span className="text-sm text-muted-foreground">Inversión</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{curso.costo}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      disabled={curso.estado === 'Cupos Llenos'}
                      onClick={() => handleInscribirse(curso.id, curso.estado)}
                    >
                      {curso.estado === 'Cupos Llenos' ? 'Sin Cupos' : 'Inscribirse'}
                    </Button>
                    <Button variant="outline" onClick={() => handleViewMore(curso.id)}>
                      Ver Más
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
