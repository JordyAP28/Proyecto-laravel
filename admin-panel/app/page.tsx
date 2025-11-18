import { AdminHeader } from '@/components/admin-header'
import { MainNav } from '@/components/main-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Calendar, GraduationCap, DollarSign, BarChart3, Users, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const stats = [
    {
      title: 'Eventos Activos',
      value: '12',
      description: 'Este mes',
      icon: Calendar,
      trend: '+3',
    },
    {
      title: 'Campeonatos',
      value: '8',
      description: 'En curso',
      icon: Trophy,
      trend: '+2',
    },
    {
      title: 'Participantes',
      value: '450',
      description: 'Registrados',
      icon: Users,
      trend: '+45',
    },
    {
      title: 'Cursos',
      value: '5',
      description: 'Disponibles',
      icon: GraduationCap,
      trend: '+1',
    },
  ]

  const recentEvents = [
    {
      title: 'Torneo Interbarrial de Fútbol',
      date: '15 Enero 2025',
      status: 'En Curso',
      participants: 120,
    },
    {
      title: 'Campeonato de Baloncesto Sub-16',
      date: '20 Enero 2025',
      status: 'Próximamente',
      participants: 85,
    },
    {
      title: 'Curso Vacacional de Natación',
      date: '25 Enero 2025',
      status: 'Inscripciones Abiertas',
      participants: 45,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <MainNav />
      
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute inset-0 bg-[url('/abstract-athletic-pattern.jpg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-secondary text-secondary-foreground" variant="secondary">
              Sistema de Gestión Deportiva
            </Badge>
            <h1 className="mb-6 text-balance font-display text-5xl font-bold tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl">
              Liga Deportiva Cantonal
              <br />
              <span className="text-secondary-foreground">de Montecristi</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/90 sm:text-xl">
              Gestiona eventos deportivos, campeonatos, contabilidad y cursos vacacionales en una plataforma integral y moderna.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/eventos">
                <Button size="lg" variant="secondary" className="gap-2">
                  Ver Eventos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/campeonatos">
                <Button size="lg" className="gap-2 border-primary-foreground/20 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  Campeonatos
                  <Trophy className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <Badge variant="secondary" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Eventos Recientes</h2>
            <p className="mt-2 text-muted-foreground">Actividades deportivas y cursos destacados</p>
          </div>
          <Link href="/eventos">
            <Button variant="outline" className="gap-2">
              Ver Todos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentEvents.map((event) => (
            <Card key={event.title} className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <img
                  src={`/sports-.jpg?height=300&width=400&query=sports+${event.title.split(' ')[0]}`}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="secondary">{event.status}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {event.participants}
                  </div>
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {event.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full gap-2" variant="outline">
                  Ver Detalles
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
            Acceso Rápido
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/usuarios">
              <Card className="transition-all hover:scale-105 hover:shadow-lg">
                <CardHeader>
                  <Users className="mb-2 h-12 w-12 text-primary" />
                  <CardTitle>Usuarios</CardTitle>
                  <CardDescription>
                    Administra usuarios del sistema
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/contabilidad">
              <Card className="transition-all hover:scale-105 hover:shadow-lg">
                <CardHeader>
                  <DollarSign className="mb-2 h-12 w-12 text-primary" />
                  <CardTitle>Contabilidad</CardTitle>
                  <CardDescription>
                    Gestiona ingresos y egresos
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/informes">
              <Card className="transition-all hover:scale-105 hover:shadow-lg">
                <CardHeader>
                  <BarChart3 className="mb-2 h-12 w-12 text-secondary" />
                  <CardTitle>Informes</CardTitle>
                  <CardDescription>
                    Reportes y estadísticas
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/cursos">
              <Card className="transition-all hover:scale-105 hover:shadow-lg">
                <CardHeader>
                  <GraduationCap className="mb-2 h-12 w-12 text-accent" />
                  <CardTitle>Cursos Vacacionales</CardTitle>
                  <CardDescription>
                    Programas deportivos
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-muted-foreground">
            © 2025 Liga Deportiva Cantonal de Montecristi. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
