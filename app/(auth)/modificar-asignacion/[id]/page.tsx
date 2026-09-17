"use client"
import {useCallback, useEffect, useState} from "react"
import { DevolverAsignacion } from "@/acciones/asignaciones"
import LoadingPage from "@/components/LoadingPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  User,
  Calendar,
  MapPin,
  Gauge,
  Fuel,
  CircleDot,
  MoreVertical,
  Edit,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import ReincioSesion from "@/components/reiniciarSesion";
interface AsignacionDatos {
    id: string;
    fechaAsignacion: Date;
    Camionetas: {
        color: string;
        marca: string;
        modelo: string;
        año: number;
        placa: string;
        estado: string;
        kilometraje: number;
        asignado: boolean;
    };
    Usuarios: {
        nombre: string;
        role: string;
        fotografia: string;
    };
}
export default function Home(){
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState<string>("");
    const [datos, setDatos] = useState<AsignacionDatos[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [errorAuthentication, setErrorAuthentication] = useState<boolean>(false);
    const devolverDatos = useCallback(async ()=> {
        try{
            const {success, message, result, errorAuthentication} = await DevolverAsignacion();
            if(errorAuthentication){
                setErrorAuthentication(true);
                setMensaje(message!);
                return;
            }
            if(!success){
                setMensaje(message!);    
                return;
            }
            setDatos(result!);
        }catch(error){
            const newError = error as Error
            setMensaje(`Error al devolver la asignación. ${newError.message}`);
        }finally{
            setLoading(false);
        }
    },[])
    useEffect(()=>{
        devolverDatos()
    },[devolverDatos])
    const handleEditar = (id: string) => {
        console.log("Editar asignación:", id);
        // Aquí implementarás la lógica de edición
    };
    const formatearFecha = (fecha: Date) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        });
    };

    const obtenerColorEstado = (estado: string) => {
        switch (estado.toLowerCase()) {
        case "nueva":
            return "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900";
        case "usada":
            return "bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900";
        default:
            return "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
        }
    };

    const handleEliminar = (id: string) => {
        console.log("Eliminar asignación:", id);
        // Aquí implementarás la lógica de eliminación
    };
    const datosFiltrados = datos.filter((dato) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            dato.Usuarios.nombre.toLowerCase().includes(searchLower) ||
            dato.Camionetas.placa.toLowerCase().includes(searchLower) ||
            dato.Camionetas.marca.toLowerCase().includes(searchLower) ||
            dato.Camionetas.modelo.toLowerCase().includes(searchLower)
        );
    });
    if(errorAuthentication){
      return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <ReincioSesion  auth={errorAuthentication} message={mensaje} header="Sesion Expirada" fetchCamionetas={async () => {window.location.href = "/"}} eleccionboton="Iniciar Sesion"/>
            </div>
          </div>
        </div>
      )
    }

    if(loading){
        return <LoadingPage />
    }
    return (
<div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <main className="flex-1 px-4 sm:px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-zinc-800 dark:text-zinc-100">
                Asignaciones Activas
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Gestiona las asignaciones de camionetas a conductores
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Total</p>
                  <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                    {datos.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Conductores</p>
                  <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                    {datos.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Este mes</p>
                  <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                    {datos.filter(d => new Date(d.fechaAsignacion).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido */}
        {mensaje ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Alert className="max-w-md bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-800 dark:text-red-200">Error</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                {mensaje}
              </AlertDescription>
            </Alert>
          </div>
        ) : datos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
            <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <Truck className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
              No hay asignaciones
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-md">
              Aún no se han registrado asignaciones de camionetas. Comienza asignando una camioneta a un conductor.
            </p>
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Barra de búsqueda */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Buscar por conductor, placa, marca o modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <TableHead className="font-semibold">Conductor</TableHead>
                    <TableHead className="font-semibold">Camioneta</TableHead>
                    <TableHead className="font-semibold">Placa</TableHead>
                    <TableHead className="font-semibold">Kilometraje</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Fecha</TableHead>
                    <TableHead className="font-semibold text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                          <p className="text-zinc-600 dark:text-zinc-400">
                            No se encontraron resultados para {searchTerm}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    datosFiltrados.map((dato) => (
                      <TableRow 
                        key={dato.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        {/* Conductor */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-orange-500/20">
                              <AvatarImage
                                src={dato.Usuarios.fotografia}
                                alt={dato.Usuarios.nombre}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm">
                                {dato.Usuarios.nombre[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-zinc-800 dark:text-zinc-100">
                                {dato.Usuarios.nombre}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {dato.Usuarios.role}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Camioneta */}
                        <TableCell>
                          <div>
                            <p className="font-medium text-zinc-800 dark:text-zinc-100">
                              {dato.Camionetas.marca} {dato.Camionetas.modelo}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {dato.Camionetas.año} • {dato.Camionetas.color}
                            </p>
                          </div>
                        </TableCell>

                        {/* Placa */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-100">
                              {dato.Camionetas.placa}
                            </span>
                          </div>
                        </TableCell>

                        {/* Kilometraje */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                            <span className="text-zinc-700 dark:text-zinc-300">
                              {dato.Camionetas.kilometraje.toLocaleString()} km
                            </span>
                          </div>
                        </TableCell>

                        {/* Estado */}
                        <TableCell>
                          <Badge className={`${obtenerColorEstado(dato.Camionetas.estado)} border`}>
                            {dato.Camionetas.estado}
                          </Badge>
                        </TableCell>

                        {/* Fecha */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                            <span className="text-zinc-700 dark:text-zinc-300">
                              {formatearFecha(dato.fechaAsignacion)}
                            </span>
                          </div>
                        </TableCell>

                        {/* Acciones */}
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                              <DropdownMenuItem
                                onClick={() => handleEditar(dato.id)}
                                className="cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar asignación
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEliminar(dato.id)}
                                className="cursor-pointer text-red-600 dark:text-red-400"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Eliminar asignación
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Footer con total de resultados */}
            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Mostrando <span className="font-medium text-zinc-800 dark:text-zinc-100">{datosFiltrados.length}</span> de{" "}
                <span className="font-medium text-zinc-800 dark:text-zinc-100">{datos.length}</span> asignaciones
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
    )
}
