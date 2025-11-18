'use client'

import { AdminHeader } from '@/components/admin-header'
import { MainNav } from '@/components/main-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Users, Search, Plus, Edit, Trash2, UserCog, Shield } from 'lucide-react'
import { useState } from 'react'

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('todos')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@liga.ec',
      rol: 'Administrador',
      estado: 'Activo',
      fechaRegistro: '10 Ene 2025',
    },
    {
      id: 2,
      nombre: 'María González',
      email: 'maria.gonzalez@liga.ec',
      rol: 'Editor',
      estado: 'Activo',
      fechaRegistro: '12 Ene 2025',
    },
    {
      id: 3,
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@liga.ec',
      rol: 'Visor',
      estado: 'Inactivo',
      fechaRegistro: '08 Ene 2025',
    },
    {
      id: 4,
      nombre: 'Ana Martínez',
      email: 'ana.martinez@liga.ec',
      rol: 'Editor',
      estado: 'Activo',
      fechaRegistro: '15 Ene 2025',
    },
  ])

  const [newUser, setNewUser] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'Visor',
  })

  const handleAddUser = () => {
    console.log('[v0] Agregando nuevo usuario:', newUser)
    const nuevoUsuario = {
      id: usuarios.length + 1,
      nombre: newUser.nombre,
      email: newUser.email,
      rol: newUser.rol,
      estado: 'Activo',
      fechaRegistro: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    }
    setUsuarios([...usuarios, nuevoUsuario])
    setNewUser({ nombre: '', email: '', password: '', rol: 'Visor' })
  }

  const handleDeleteUser = (id: number) => {
    console.log('[v0] Eliminando usuario con ID:', id)
    setUsuarios(usuarios.filter(user => user.id !== id))
  }

  const handleToggleStatus = (id: number) => {
    console.log('[v0] Cambiando estado de usuario con ID:', id)
    setUsuarios(usuarios.map(user => 
      user.id === id 
        ? { ...user, estado: user.estado === 'Activo' ? 'Inactivo' : 'Activo' }
        : user
    ))
  }

  const filteredUsers = usuarios.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'todos' || user.rol === roleFilter
    const matchesStatus = statusFilter === 'todos' || user.estado === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <MainNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Usuarios</h1>
            <p className="mt-2 text-muted-foreground">Administra los usuarios del sistema</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                <DialogDescription>
                  Complete la información del nuevo usuario del sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={newUser.nombre}
                    onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="usuario@liga.ec"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Contraseña segura"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rol">Rol</Label>
                  <Select value={newUser.rol} onValueChange={(value) => setNewUser({ ...newUser, rol: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrador">Administrador</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Visor">Visor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddUser}>Crear Usuario</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuarios Registrados
            </CardTitle>
            <CardDescription>
              Total de {usuarios.length} usuarios en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los roles</SelectItem>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Visor">Visor</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nombre}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant={usuario.rol === 'Administrador' ? 'default' : 'secondary'} className="gap-1">
                          {usuario.rol === 'Administrador' && <Shield className="h-3 w-3" />}
                          {usuario.rol}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={usuario.estado === 'Activo' ? 'default' : 'secondary'}>
                          {usuario.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{usuario.fechaRegistro}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(usuario.id)}
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => console.log('[v0] Editando usuario:', usuario.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUser(usuario.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
