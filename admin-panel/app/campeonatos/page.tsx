'use client'

import { useState } from 'react'
import { AdminHeader } from '@/components/admin-header'
import { MainNav } from '@/components/main-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Trophy, Calendar, Users, Search, Plus, Medal, Target } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function CampeonatosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [campeonatos] = useState([
    {
      id: 1,
      nombre: 'Liga Cantonal de Fútbol 2025',
      deporte: 'Fútbol',
      fechaInicio: '2025-01-10',
      fechaFin: '2025-06-30',
      equipos: 16,
      partidos: 120,
      partidosJugados: 45,
      estado: 'En Curso',
      premio: '$5,000',
    },
    {
      id: 2,
      nombre: 'Campeonato Provincial de Baloncesto',
      deporte: 'Baloncesto',
      fechaInicio: '2025-02-01',
      fechaFin: '2025-05-15',
      equipos: 12,
      partidos: 66,
      partidosJugados: 0,
      estado: 'Próximamente',
      premio: '$3,500',
    },
    {
      id: 3,
      nombre: 'Torneo Relámpago de Voleibol',
      deporte: 'Voleibol',
      fechaInicio: '2025-01-15',
      fechaFin: '2025-01-20',
      equipos: 8,
      partidos: 28,
      partidosJugados: 24,
      estado: 'En Curso',
      premio: '$1,500',
    },
    {
      id: 4,
      nombre: 'Copa Montecristi de Atletismo',
      deporte: 'Atletismo',
      fechaInicio: '2025-03-01',
      fechaFin: '2025-03-03',
      equipos: 0,
      partidos: 0,
      partidosJugados: 0,
      estado: 'Inscripciones Abiertas',
      premio: '$2,000',
    },
  ])

  const handleCreateCampeonato = () => {
    console.log('[v0] Abriendo formulario para crear campeonato...')
  }

  const handleViewDetails = (id: number) => {
    console.log('[v0] Viendo detalles del campeonato con ID:', id)
  }

  const handleManage = (id: number) => {
    console.log('[v0] Gestionando campeonato con ID:', id)
  }

  const filteredCampeonatos = campeonatos.filter(campeonato =>
    campeonato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campeonato.deporte.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'En Curso':
        return 'bg-accent text-accent-foreground'
      case 'Próximamente':
        return 'bg-secondary text-secondary-foreground'
      case 'Inscripciones Abiertas':
        return 'bg-primary text-primary-foreground'
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
                Campeonatos
              </h1>
              <p className="mt-2 text-muted-foreground">
                Administra torneos y competencias deportivas
              </p>
            </div>
            <Button className="gap-2" onClick={handleCreateCampeonato}>
              <Plus className="h-4 w-4" />
              Crear Campeonato
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar campeonatos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCampeonatos.map((campeonato) => {
            const progreso = campeonato.partidos > 0 
              ? (campeonato.partidosJugados / campeonato.partidos) * 100 
              : 0

            return (
              <Card key={campeonato.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge className={getEstadoColor(campeonato.estado)}>
                          {campeonato.estado}
                        </Badge>
                        <Badge variant="outline">{campeonato.deporte}</Badge>
                      </div>
                      <CardTitle className="text-2xl text-balance">{campeonato.nombre}</CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(campeonato.fechaInicio).toLocaleDateString('es-ES')} - {new Date(campeonato.fechaFin).toLocaleDateString('es-ES')}
                      </CardDescription>
                    </div>
                    <Trophy className="h-10 w-10 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border border-border bg-muted/50 p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Equipos</span>
                        </div>
                        <div className="mt-1 text-2xl font-bold text-foreground">
                          {campeonato.equipos || 'N/A'}
                        </div>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/50 p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Target className="h-4 w-4" />
                          <span>Partidos</span>
                        </div>
                        <div className="mt-1 text-2xl font-bold text-foreground">
                          {campeonato.partidos || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    {campeonato.partidos > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium text-foreground">
                            {campeonato.partidosJugados} / {campeonato.partidos} partidos
                          </span>
                        </div>
                        <Progress value={progreso} className="h-2" />
                      </div>
                    )}

                    {/* Prize */}
                    <div className="flex items-center gap-2 rounded-lg bg-secondary/20 p-3">
                      <Medal className="h-5 w-5 text-secondary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Premio Total</div>
                        <div className="text-xl font-bold text-foreground">{campeonato.premio}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => handleViewDetails(campeonato.id)}>
                        Ver Detalles
                      </Button>
                      <Button variant="outline" onClick={() => handleManage(campeonato.id)}>
                        Gestionar
                      </Button>
                    </div>
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
