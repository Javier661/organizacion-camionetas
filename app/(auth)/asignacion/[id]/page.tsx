"use client"
import { useCallback, useEffect, useState } from "react";
import { RetornoCamionetas } from "@/acciones/asignaciones";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import { Truck, User, CheckCircle2, XCircle, ArrowLeftRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AgregarAsignacion } from "@/acciones/asignaciones";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingPage from "@/components/LoadingPage";
import ReincioSesion from "@/components/reiniciarSesion";
interface Camioneta {
    id: string;
    marca: string;
    modelo: string;
}
interface Conductor {
    id: string;
    nombre: string;
    fotografia?: string | null;
}
interface FormData {
    camionetaId: string;
    conductorId: string;
}
export default function Home(){
    const [mensaje, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [camionetas, setCamionetas] = useState<Camioneta[]>([]);
    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [agregarCamioneta, setAgregarCamioneta] = useState<FormData>({
        camionetaId: "",
        conductorId: "",
    });
    const [showSessionRestart, setShowSessionRestart] = useState<boolean>(false);
    const [statusMensaje, setStatusMensaje] = useState<boolean>(true);
    const [errors, setErrors] = useState<{ camionetaId?: string; conductorId?: string }>({});
    const retornarCamionetas = useCallback(async () => {
        setLoading(true);
        try{
            const {success, camionetas, conductores, message, errorAuthentication} = await RetornoCamionetas();
            if(errorAuthentication){
                setShowSessionRestart(true);
                setMessage(message!)
                setLoading(false);
                return;
            }
            
            if(!success){
                setMessage(message!);
                setStatusMensaje(success);
                setLoading(false);
                return;
            }
            setCamionetas(camionetas!);
            setConductores(conductores!);
            setStatusMensaje(success);
        }catch(error){
            const newError = error as Error;
            setMessage(`Error al obtener las camionetas. ${newError.message}`);
            setStatusMensaje(false);
        }finally{
            setLoading(false);
        }
    },[]);
    useEffect(() => {
        retornarCamionetas();
    }, [retornarCamionetas]);

    const handleSelectChange = (name: string, value: string) => {
        setAgregarCamioneta((prev) => ({
        ...prev,
        [name]: value,
        }));

        setErrors((prev) => ({
        ...prev,
        [name]: undefined,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const errores: { camionetaId?: string; conductorId?: string } = {};
        if (!agregarCamioneta.camionetaId) {
            errores.camionetaId = "Por favor, selecciona una camioneta.";
        }
        if (!agregarCamioneta.conductorId) {
            errores.conductorId = "Por favor, selecciona un conductor.";
        }
        if (Object.keys(errores).length > 0) {
            setErrors(errores);
            setMessage("Por favor, corrige los errores antes de continuar.");
            setStatusMensaje(false);
            return;
        }
        e.preventDefault();
        try {
            const {success,message, errorAuthentication} = await AgregarAsignacion({idCamioneta : agregarCamioneta.camionetaId, idUsuario : agregarCamioneta.conductorId})
            if(errorAuthentication){
                setShowSessionRestart(true);
                setMessage(message!)
                setSubmitting(false);
                return;
            }
            if(success){
              setAgregarCamioneta({
                camionetaId : "",
                conductorId : ""
              })
            }
            setMessage(message);
            setStatusMensaje(success);
        } catch (error) {
            const newError = error as Error;
            setMessage(`Error al asignar la camioneta. ${newError.message}`);
            setStatusMensaje(false);
        } finally {
            setSubmitting(false);
        }
    };
    
    if(loading){
        return <LoadingPage />
    }

    if(showSessionRestart){
        return (
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
            <div className="w-full max-w-7xl mx-auto">
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <ReincioSesion  auth={showSessionRestart} message={mensaje} header="Sesion Expirada" fetchCamionetas={async () => {window.location.href = "/"}} eleccionboton="Iniciar Sesion"/>
              </div>
            </div>
          </div>
        )
    }
    if (!statusMensaje && mensaje) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
                <main className="flex flex-1 items-center justify-center px-4 sm:px-6 py-12">
                    <div className="w-full max-w-md">
                        <Alert className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <AlertTitle className="text-red-800 dark:text-red-200">
                            Error
                        </AlertTitle>
                        <AlertDescription className="text-red-700 dark:text-red-300">
                            {mensaje}
                        </AlertDescription>
                        </Alert>
                        <Button
                            onClick={retornarCamionetas}
                            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                            >
                            Reintentar
                        </Button>
                    </div>
                </main>
            </div>
        );
    }
    return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Notificación Alert */}
      {mensaje && statusMensaje && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-5 fade-in duration-300">
          <Alert className="shadow-2xl border-2 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200">
              ¡Éxito!
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              {mensaje}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {mensaje && !statusMensaje && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-5 fade-in duration-300">
          <Alert className="shadow-2xl border-2 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertTitle className="text-red-800 dark:text-red-200">
              Error
            </AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
              {mensaje}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="flex flex-1 items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-orange-500/10 hover:shadow-3xl">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <ArrowLeftRight className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-zinc-800 dark:text-zinc-100">
                  Asignar Camioneta
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Asigna una camioneta a un conductor
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview del conductor seleccionado */}
            {agregarCamioneta.conductorId && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-2 border-orange-200 dark:border-orange-900 rounded-2xl p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-4">
                  {/* Avatar grande */}
                  <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-zinc-800 shadow-xl">
                    <AvatarImage 
                      src={conductores.find((c) => c.id === agregarCamioneta.conductorId)?.fotografia || undefined} 
                      alt={conductores.find((c) => c.id === agregarCamioneta.conductorId)?.nombre}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-2xl">
                      {conductores.find((c) => c.id === agregarCamioneta.conductorId)?.nombre[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Información del conductor */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                      {conductores.find((c) => c.id === agregarCamioneta.conductorId)?.nombre}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                        Conductor seleccionado
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )}

            {/* Selector de Conductor */}
            <div className="flex flex-col">
              <Label
                htmlFor="conductorId"
                className="text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Conductor <span className="text-red-500">*</span>
              </Label>
              <Select
                name="conductorId"
                value={agregarCamioneta.conductorId}
                onValueChange={(value) => handleSelectChange("conductorId", value)}
                disabled={submitting}
              >
                <SelectTrigger
                  className={`bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 h-14 ${
                    errors.conductorId ? "border-red-500 dark:border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Selecciona un conductor">
                    {agregarCamioneta.conductorId && (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={conductores.find((c) => c.id === agregarCamioneta.conductorId)?.fotografia || undefined}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm">
                            {conductores.find((c) => c.id === agregarCamioneta.conductorId)?.nombre[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{conductores.find((c) => c.id === agregarCamioneta.conductorId)?.nombre}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                  {conductores.map((conductor) => (
                    <SelectItem key={conductor.id} value={conductor.id} className="cursor-pointer">
                      <div className="flex items-center gap-3 py-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conductor.fotografia || undefined} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-zinc-500 to-zinc-600 text-white">
                            {conductor.nombre[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{conductor.nombre}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.conductorId && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  {errors.conductorId}
                </p>
              )}
            </div>

            {/* Selector de Camioneta */}
            <div className="flex flex-col">
              <Label
                htmlFor="camionetaId"
                className="text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2"
              >
                <Truck className="h-4 w-4" />
                Camioneta <span className="text-red-500">*</span>
              </Label>
              <Select
                name="camionetaId"
                value={agregarCamioneta.camionetaId}
                onValueChange={(value) => handleSelectChange("camionetaId", value)}
                disabled={submitting}
              >
                <SelectTrigger
                  className={`bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 h-12 ${
                    errors.camionetaId ? "border-red-500 dark:border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Selecciona una camioneta" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                  {camionetas.map((camioneta) => (
                    <SelectItem key={camioneta.id} value={camioneta.id}>
                      {camioneta.marca} {camioneta.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.camionetaId && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  {errors.camionetaId}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Información:</strong> Selecciona un conductor y una camioneta para realizar la asignación.
                Esta acción puede ser modificada posteriormente si es necesario.
              </p>
            </div>

            {/* Resumen de selección */}
            {(agregarCamioneta.conductorId || agregarCamioneta.camionetaId) && (
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2">
                  Resumen de asignación:
                </h3>
                <div className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
                  {agregarCamioneta.conductorId && (
                    <p>
                      • Conductor:{" "}
                      <span className="font-medium">
                        {conductores.find((c) => c.id === agregarCamioneta.conductorId)?.nombre || "N/A"}
                      </span>
                    </p>
                  )}
                  {agregarCamioneta.camionetaId && (
                    <p>
                      • Camioneta:{" "}
                      <span className="font-medium">
                        {camionetas.find((c) => c.id === agregarCamioneta.camionetaId)
                          ? `${camionetas.find((c) => c.id === agregarCamioneta.camionetaId)?.marca} ${
                              camionetas.find((c) => c.id === agregarCamioneta.camionetaId)?.modelo
                            }`
                          : "N/A"}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={submitting}
              >
                <div className="flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Asignando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Asignar Camioneta</span>
                    </>
                  )}
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 px-8 border-2 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:border-zinc-400 dark:hover:border-zinc-600"
                onClick={() => {
                  setAgregarCamioneta({ camionetaId: "", conductorId: "" });
                  setErrors({});
                }}
                disabled={submitting}
              >
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="h-5 w-5" />
                  <span>Limpiar</span>
                </div>
              </Button>
            </div>
          </form>

          {/* Información adicional */}
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {conductores.length}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Conductores disponibles
                </p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {camionetas.length}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Camionetas disponibles
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    )
}