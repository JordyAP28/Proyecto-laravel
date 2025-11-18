'use client'

import { MainNav } from '@/components/main-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Calendar, MapPin, Users, Clock, Search, Plus, Filter } from 'lucide-react'
import Link from 'next/link'
import { AdminHeader } from '@/components/admin-header'
import { useState } from 'react'

export default function EventosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [eventos, setEventos] = useState([
    {
      id: 1,
      titulo: 'Torneo Interbarrial de Fútbol',
      fecha: '2025-01-15',
      hora: '09:00',
      lugar: 'Estadio Municipal',
      participantes: 120,
      estado: 'En Curso',
      categoria: 'Fútbol',
      descripcion: 'Campeonato de fútbol entre los barrios de Montecristi',
    },
    {
      id: 2,
      titulo: 'Campeonato de Baloncesto Sub-16',
      fecha: '2025-01-20',
      hora: '14:00',
      lugar: 'Coliseo Deportivo',
      participantes: 85,
      estado: 'Próximamente',
      categoria: 'Baloncesto',
      descripcion: 'Torneo juvenil de baloncesto categoría sub-16',
    },
    {
      id: 3,
      titulo: 'Maratón Montecristi 10K',
      fecha: '2025-01-25',
      hora: '06:00',
      lugar: 'Centro de Montecristi',
      participantes: 200,
      estado: 'Inscripciones Abiertas',
      categoria: 'Atletismo',
      descripcion: 'Carrera de 10 kilómetros por las calles de Montecristi',
    },
    {
      id: 4,
      titulo: 'Torneo de Voleibol Femenino',
      fecha: '2025-02-01',
      hora: '10:00',
      lugar: 'Coliseo Deportivo',
      participantes: 64,
      estado: 'Inscripciones Abiertas',
      categoria: 'Voleibol',
      descripcion: 'Campeonato femenino de voleibol',
    },
    {
      id: 5,
      titulo: 'Competencia de Natación Infantil',
      fecha: '2025-02-05',
      hora: '08:00',
      lugar: 'Piscina Olímpica',
      participantes: 45,
      estado: 'Próximamente',
      categoria: 'Natación',
      descripcion: 'Competencia de natación para categorías infantiles',
    },
    {
      id: 6,
      titulo: 'Torneo de Tenis de Mesa',
      fecha: '2025-02-10',
      hora: '15:00',
      lugar: 'Centro Deportivo',
      participantes: 32,
      estado: 'Inscripciones Abiertas',
      categoria: 'Tenis de Mesa',
      descripcion: 'Campeonato abierto de tenis de mesa',
    },
  ])

  const handleCreateEvent = () => {
    console.log('[v0] Abriendo formulario para crear evento...')
    // Aquí se abriría un diálogo para crear evento
  }

  const handleEditEvent = (id: number) => {
    console.log('[v0] Editando evento con ID:', id)
    // Aquí se abriría un diálogo para editar
  }

  const handleViewDetails = (id: number) => {
    console.log('[v0] Viendo detalles del evento con ID:', id)
    // Navegar a página de detalles
  }

  const filteredEventos = eventos.filter(evento => 
    evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'En Curso':
        return 'bg-accent text-accent-foreground'
      case 'Próximamente':
        return 'bg-secondary text-secondary-foreground'
      case 'Inscripciones Abiertas':
        return 'bg-primary text-primary-foreground'
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
                Eventos Deportivos
              </h1>
              <p className="mt-2 text-muted-foreground">
                Gestiona y visualiza todos los eventos de la liga
              </p>
            </div>
            <Button className="gap-2" onClick={handleCreateEvent}>
              <Plus className="h-4 w-4" />
              Crear Evento
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEventos.map((evento) => (
            <Card key={evento.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <img
                  src={`/.jpg?key=6qry2&height=300&width=400&query=${evento.categoria}+sports+event`}
                  alt={evento.titulo}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Badge className={getEstadoColor(evento.estado)}>
                    {evento.estado}
                  </Badge>
                  <Badge variant="outline">{evento.categoria}</Badge>
                </div>
                <CardTitle className="text-xl text-balance">{evento.titulo}</CardTitle>
                <CardDescription className="text-pretty">
                  {evento.descripcion}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(evento.fecha).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{evento.hora}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{evento.lugar}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{evento.participantes} participantes</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" size="sm" onClick={() => handleViewDetails(evento.id)}>
                    Ver Detalles
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditEvent(evento.id)}>
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
