'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, UserCog, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AdminHeader() {
  const router = useRouter()
  const [adminName] = useState('Administrador')

  const handleLogout = () => {
    console.log('[v0] Cerrando sesión...')
    // Aquí se implementaría la lógica real de logout
    localStorage.removeItem('adminToken')
    router.push('/login')
  }

  const handleChangeAccount = () => {
    console.log('[v0] Cambiando de cuenta...')
    router.push('/cambiar-cuenta')
  }

  return (
    <div className="border-b border-border bg-primary px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary-foreground" />
          <div>
            <h1 className="text-lg font-bold text-primary-foreground">Panel de Administrador</h1>
            <p className="text-xs text-primary-foreground/80">Liga Deportiva Cantonal de Montecristi</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hidden gap-1 sm:flex">
            <Shield className="h-3 w-3" />
            Acceso Total
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{adminName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleChangeAccount} className="cursor-pointer">
                <UserCog className="mr-2 h-4 w-4" />
                Cambiar de Cuenta
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
