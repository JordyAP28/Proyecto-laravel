'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trophy, Calendar, GraduationCap, DollarSign, BarChart3, Menu, X, Users } from 'lucide-react'
import { useState } from 'react'

export function MainNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const routes = [
    {
      href: '/',
      label: 'Inicio',
      icon: Trophy,
    },
    {
      href: '/eventos',
      label: 'Eventos',
      icon: Calendar,
    },
    {
      href: '/campeonatos',
      label: 'Campeonatos',
      icon: Trophy,
    },
    {
      href: '/cursos',
      label: 'Cursos Vacacionales',
      icon: GraduationCap,
    },
    {
      href: '/usuarios',
      label: 'Usuarios',
      icon: Users,
    },
    {
      href: '/contabilidad',
      label: 'Contabilidad',
      icon: DollarSign,
    },
    {
      href: '/informes',
      label: 'Informes',
      icon: BarChart3,
    },
  ]

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none text-foreground">LIGA DEPORTIVA</span>
              <span className="text-xs text-muted-foreground">Montecristi</span>
            </div>
          </Link>

          <div className="hidden gap-1 lg:flex">
            {routes.map((route) => {
              const Icon = route.icon
              return (
                <Link key={route.href} href={route.href}>
                  <Button
                    variant={pathname === route.href ? 'default' : 'ghost'}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {route.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {routes.map((route) => {
                const Icon = route.icon
                return (
                  <Link key={route.href} href={route.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={pathname === route.href ? 'default' : 'ghost'}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {route.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
