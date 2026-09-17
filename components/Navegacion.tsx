"use client"
import { useCallback, useEffect, useState } from "react"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Truck,
  ClipboardCheck,
  Users,
  User,
  TicketCheck,
  LogOut,
  Settings,
  CheckCircle,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { useParams } from "next/navigation"
import { UsuarioValidado } from "@/acciones/modulo_usuarios"
import eliminarSesion from "@/acciones/eliminarSesion"

interface DatosUsuario {
  email?: string
  nombre?: string
  role?: string
}

const LinkBarraNavegacion = [
  {
    nombre: "Camionetas",
    icon: Truck,
    acciones: [
      { name: "Agregar", href: "/agregar-camioneta" },
      { name: "Modificar", href: "/modificar-camioneta" },
    ],
  },
  {
    nombre: "Mantenimiento",
    icon: ClipboardCheck,
    acciones: [
      { name: "Ingresar", href: "/ingresar-mantenimiento" },
      { name: "Verificar", href: "/verificar-mantenimiento" },
      { name: "Historial", href: "/historial-mantenimiento" },
    ],
  },
  {
    nombre: "Personal",
    icon: Users,
    acciones: [
      { name: "Agregar", href: "/agregar-personal" },
      { name: "Modificar", href: "/modificar-personal" },
    ],
  },
  {
    nombre: "Asignacion Camioneta",
    icon: TicketCheck,
    acciones: [
      { name: "Asignar", href: "/asignacion" },
      { name: "Modificar", href: "/modificar-asignacion" },
    ],
  },
]

export default function Navegacion() {
  const [datos, setDatos] = useState<DatosUsuario | null>(null)
  const retornarDatos = useCallback(async () => {
    try {
      const { errorAuthentication, success, message, user } = await UsuarioValidado();
      if (errorAuthentication) {
        console.error(message);
        return;
      }
      if (!success) {
        console.error(message);
        return;
      }
      setDatos(user);
    } catch (error) {
      const newMessage = error as Error;
      console.error("Error al obtener datos del usuario:", newMessage);
    } finally {
      return;
    }
  }, []);

  useEffect(() => {
    retornarDatos();
  }, [retornarDatos]);

  const params = useParams<{ id: string }>()
  const [open, setOpen] = useState(false)
  
  const cerrarSesion = async () => {
    const { message, redirect } = await eliminarSesion();
    console.error(message);
    localStorage.setItem("mensaje", message);
    window.location.href = redirect;
  };


  return (
    <>
    <div className="hidden md:flex md:items-center md:gap-3">
        <Menubar className="border-none bg-transparent">
          {LinkBarraNavegacion.map((seccion) => (
            <MenubarMenu key={seccion.nombre}>
              <MenubarTrigger className="hover:bg-orange-50 dark:hover:bg-orange-950/30 data-[state=open]:bg-orange-100 dark:data-[state=open]:bg-orange-950/50 text-zinc-700 dark:text-zinc-200">
                <seccion.icon className="h-4 w-4 mr-2 text-orange-500" />
                {seccion.nombre}
              </MenubarTrigger>
              <MenubarContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-zinc-200 dark:scrollbar-track-zinc-800">
                {seccion.acciones.map((accion) => (
                  <MenubarItem
                    key={accion.name}
                    className="hover:bg-orange-50 dark:hover:bg-orange-950/30 focus:bg-orange-100 dark:focus:bg-orange-950/50 cursor-pointer"
                  >
                    <Link href={`${accion.href}/${params.id}`} className="w-full">
                      {accion.name}
                    </Link>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          ))}
        </Menubar>

        {/* Desktop User Menu - Botón diferenciado */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-2 border-orange-200 dark:border-orange-900 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-950/70 dark:hover:to-orange-800/70 text-zinc-700 dark:text-zinc-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-orange-500" />
                <span className="max-w-[120px] truncate">{datos?.nombre}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg"
          >
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30">
              <Link href={`/perfil/${params.id}`} className="flex items-center">
                <Settings className="mr-2 h-4 w-4 text-orange-500" />
                <span>Mi Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600 dark:focus:text-red-400"
              onClick={cerrarSesion}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Menu className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-zinc-200 dark:border-zinc-800 flex flex-col p-0"
          >
            {/* Header con información del usuario */}
            <div className="flex-shrink-0 bg-gradient-to-br from-orange-500 to-orange-600 p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white truncate font-medium">{datos?.nombre}</h3>
                  <p className="text-xs text-orange-100 truncate">{datos?.role}</p>
                </div>
              </div>
            </div>

            {/* Contenedor con scroll */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-zinc-200 dark:scrollbar-track-zinc-800 p-4">
              <nav className="flex flex-col space-y-3">
                {LinkBarraNavegacion.map((seccion, index) => {
                  const IconComponent = seccion.icon
                  return (
                    <div key={seccion.nombre}>
                      <div className="flex items-center gap-2 mb-2 px-2">
                        <IconComponent className="h-4 w-4 text-orange-500" />
                        <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{seccion.nombre}</h3>
                      </div>
                      <div className="space-y-1 mb-3">
                        {seccion.acciones.map((accion) => (
                          <Link
                            key={accion.name}
                            href={`${accion.href}/${params.id}`}
                            onClick={() => setOpen(false)}
                            className="block px-4 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
                          >
                            {accion.name}
                          </Link>
                        ))}
                      </div>
                      {index < LinkBarraNavegacion.length - 1 && (
                        <Separator className="my-3 bg-zinc-200 dark:bg-zinc-800" />
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>

            {/* Footer con acciones del usuario */}
            <div className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-zinc-300 dark:border-zinc-700 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200 bg-transparent text-sm"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span className="truncate">{datos?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg"
                >
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30">
                    <Link href={`/perfil/${params.id}`} className="flex items-center">
                      <Settings className="mr-2 h-4 w-4 text-orange-500" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600 dark:focus:text-red-400"
                    onClick={cerrarSesion}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}