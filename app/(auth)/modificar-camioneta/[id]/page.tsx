"use client";
import { useCallback, useEffect, useState } from "react";
import { ObtenerCamionetas } from "@/acciones/modulo_camioneta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Truck,
  Calendar,
  Gauge,
  Fuel,
  Palette,
  FileText,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import LoadingPage from "@/components/LoadingPage";
import EditarCamioneta from "@/components/editarCamioneta";
import EliminarModal from "@/components/eliminarModal";
import { useParams } from 'next/navigation'
import Link from "next/link";
import ReincioSesion from "@/components/reiniciarSesion";
interface Camioneta {
    id: string;
    marca: string;
    modelo: string;
    año: number;
    placa: string;
    color: string;
    combustible: string;
    estado: string;
    kilometraje: number;
    createdAt: Date;
    updatedAt: Date;
}

const getEstadoColor = (estado: string) => {
  switch (estado.toLowerCase()) {
    case "nueva":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800";
    case "usada":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
  }
};
interface datosEliminar {
    id: string;
    placa?: string;
    marca?: string;
    modelo?: string;
}
export default function Modificar() {
    const params = useParams<{ id: string }>();
    const [mensaje, setMensaje] = useState<string>("");
    const [datos, setDatos] = useState<Camioneta[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [statusMensaje, setStatusMessage] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [authError, setAuthError] = useState<boolean>(false);
    const [datosEditar, setDatosEditar] = useState<Camioneta | undefined>(undefined);
    const [laData, setData] = useState<datosEliminar>({
        id: "",
        placa: "",
        marca: "",
        modelo: "",
    });
    const [openEliminar, setOpenEliminar] = useState<boolean>(false);
    const fetchCamionetas = useCallback(async () => {
        setLoading(true);
        try{
            const {success, data, message, errorAuthentication} = await ObtenerCamionetas();
            
            if(errorAuthentication){
                setMensaje(message)
                setAuthError(true);
                setStatusMessage(true);
                return;
            }

            if(!success){
                setMensaje(message ? message : "Error al obtener las camionetas.")
                setStatusMessage(true);
            }
            setDatos(data ? data : []);
        }catch(error){
            const newMessage = typeof error === 'string' ? error : (error as Error).message;
            setMensaje(newMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCamionetas();
    }, [fetchCamionetas]);

    if(loading){
        return <LoadingPage />;
    }

    if(statusMensaje && mensaje){
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        {mensaje == "No hay camionetas registradas." ? (
                            <div className="max-w-md w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center">
                                <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-950 dark:to-green-900 flex items-center justify-center mb-6 shadow-lg">
                                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-zinc-800 dark:text-zinc-100 mb-3">
                                    {mensaje}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                    Comienza agregando una nueva camioneta al sistema para gestionar tu flota
                                </p>
                                <Link href={`/agregar-camioneta/${params.id}`} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200">
                                    <Truck className="h-4 w-4 mr-2" />
                                    Agregar Primera Camioneta
                                </Link>
                            </div>
                        ) : (
                            <ReincioSesion auth={statusMensaje} message={authError ? mensaje : mensaje} fetchCamionetas={authError ? async () => {window.location.href = "/"} : fetchCamionetas} header={authError ? "Error de autenticación" : "Error al obtener las camionetas"} eleccionboton={authError ? "Iniciar sesión" : "Intentar nuevamente"}/>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
            <main className="flex flex-1 flex-col px-6 py-12">
                <div className="w-full max-w-7xl mx-auto">
                    {!open ? (
                            <>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                                        <Truck className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-zinc-800 dark:text-zinc-100">
                                        Modificar Camioneta
                                        </h1>
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                        {datos.length} {datos.length === 1 ? "camioneta" : "camionetas"}{" "}
                                        registradas
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {datos.map((camioneta) => (
                            <Card
                                key={camioneta.id}
                                className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-200"
                            >
                                <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-zinc-800 dark:text-zinc-100">
                                            {camioneta.marca} {camioneta.modelo}
                                        </CardTitle>
                                        <CardDescription className="text-zinc-600 dark:text-zinc-400 mt-1">
                                            Placa: {camioneta.placa}
                                        </CardDescription>
                                        </div>
                                        <Badge
                                        variant="outline"
                                        className={getEstadoColor(camioneta.estado)}
                                        >
                                        {camioneta.estado}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                    <Calendar className="h-4 w-4 text-orange-500" />
                                    <span className="text-zinc-600 dark:text-zinc-400">
                                    Año: {camioneta.año}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                    <Palette className="h-4 w-4 text-orange-500" />
                                    <span className="text-zinc-600 dark:text-zinc-400">
                                    Color: {camioneta.color}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                    <Fuel className="h-4 w-4 text-orange-500" />
                                    <span className="text-zinc-600 dark:text-zinc-400">
                                    Combustible: {camioneta.combustible}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                    <Gauge className="h-4 w-4 text-orange-500" />
                                    <span className="text-zinc-600 dark:text-zinc-400">
                                    Kilometraje: {camioneta.kilometraje.toLocaleString()} km
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
                                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500">
                                    <FileText className="h-3 w-3" />
                                    <span className="text-xs">
                                        Ingresada: {new Date(camioneta.createdAt).toLocaleDateString()}
                                    </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500">
                                    <FileText className="h-3 w-3" />
                                    <span className="text-xs">
                                        Última Actualización:{" "}
                                        {new Date(camioneta.updatedAt).toLocaleDateString()}
                                    </span>
                                    </div>
                                </div>
                                </CardContent>

                                <CardFooter className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
                                    onClick={() => {
                                        setOpen(true);
                                        setDatosEditar(camioneta);
                                    }}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-zinc-300 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                                    onClick={() => {
                                        setOpenEliminar(true);
                                        setData({
                                            id: camioneta.id,
                                            placa: camioneta.placa,
                                            marca: camioneta.marca,
                                            modelo: camioneta.modelo,
                                        });
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                </CardFooter>
                            </Card>
                            ))}
                        </div>
                        </>
                        ) : (
                            <EditarCamioneta open={open} close={() => setOpen(false)} datos={datosEditar} id={params.id}/>
                        )}
                </div>
            </main>   
            {<EliminarModal data={laData} open={openEliminar} close={() => setOpenEliminar(false)}/>}
        </div>
    );
}
