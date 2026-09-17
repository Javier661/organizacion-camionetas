"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Truck, CheckCircle2, XCircle } from "lucide-react";
import { AgregarCamioneta, ErroresAgregar } from '@/acciones/modulo_camioneta';
import ReincioSesion from "@/components/reiniciarSesion";

interface CamionetaData {
  marca: string;
  modelo: string;
  año: number;
  placa: string;
  color: string;
  combustible: string;
  estado: string;
  kilometraje: number;
}

export default function Agregar() {
  const [formData, setFormData] = useState<CamionetaData>({
    marca: "",
    modelo: "",
    año: new Date().getFullYear(),
    placa: "",
    color: "",
    combustible: "",
    estado: "",
    kilometraje: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<boolean>(false);
  const [error, setErrores] = useState<Partial<Record<keyof CamionetaData, string>>>({});
  const [showSessionRestart, setShowSessionRestart] = useState<boolean>(false);

  const handleSelectChange = async (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "año" || name === "kilometraje" ? Number(value) : value,
    }));
  };

  // Auto-ocultar mensaje después de 5 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success, message, errorAuthentication } = await AgregarCamioneta(formData);
      
      if(errorAuthentication){
        setShowSessionRestart(true);
        setMensaje(message)
        return;
      }
      
      const errores = await ErroresAgregar(formData);
      if(success){
        setFormData({
          marca: "",
          modelo: "",
          año: new Date().getFullYear(),
          placa: "",
          color: "",
          combustible: "",
          estado: "",
          kilometraje: 0,
        })
      }
      setErrores(errores);
      setStatusMessage(success);
      setMensaje(message);
    }catch(error){
      const newMessage = typeof error === 'string' ? error : (error as Error).message;
      setMensaje(newMessage);
    }finally{
      setLoading(false);
    }
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Notificación Alert */}
      {mensaje && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-5 fade-in duration-300">
          <Alert 
            variant={statusMessage ? "default" : "destructive"}
            className="shadow-2xl border-2 bg-white dark:bg-zinc-900"
          >
            {statusMessage ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <AlertDescription className="font-medium">
              {mensaje}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-orange-500/10 hover:shadow-3xl">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-zinc-800 dark:text-zinc-100">
                Agregar Camioneta
              </h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Marca y Modelo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label
                  htmlFor="marca"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Marca
                </Label>
                <Input
                  id="marca"
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  placeholder="Ej. Toyota, Ford, Chevrolet"
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                />
                {error.marca && <p className="text-red-500 text-sm mt-1">{error.marca}</p>}
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="modelo"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Modelo
                </Label>
                <Input
                  id="modelo"
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  placeholder="Ej. Hilux, Ranger, Silverado"
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                />
                {error.modelo && <p className="text-red-500 text-sm mt-1">{error.modelo}</p>}
              </div>
            </div>

            {/* Row 2: Año y Placa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label
                  htmlFor="año"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Año
                </Label>
                <Input
                  id="año"
                  type="number"
                  name="año"
                  value={formData.año}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                />
                {error.año && <p className="text-red-500 text-sm mt-1">{error.año}</p>}
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="placa"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Placa
                </Label>
                <Input
                  id="placa"
                  type="text"
                  name="placa"
                  value={formData.placa}
                  onChange={handleChange}
                  placeholder="ABC-123"
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200 uppercase"
                />
                {error.placa && <p className="text-red-500 text-sm mt-1">{error.placa}</p>}
              </div>
            </div>

            {/* Row 3: Color y Combustible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label
                  htmlFor="color"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Color
                </Label>
                <Select
                  name="color"
                  value={formData.color}
                  onValueChange={(value) => handleSelectChange("color", value)}
                >
                  <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400">
                    <SelectValue placeholder="Seleccionar color" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="blanco">Blanco</SelectItem>
                    <SelectItem value="negro">Negro</SelectItem>
                    <SelectItem value="gris">Gris</SelectItem>
                    <SelectItem value="plata">Plata</SelectItem>
                    <SelectItem value="rojo">Rojo</SelectItem>
                    <SelectItem value="azul">Azul</SelectItem>
                    <SelectItem value="verde">Verde</SelectItem>
                    <SelectItem value="amarillo">Amarillo</SelectItem>
                  </SelectContent>
                </Select>
                {error.color && <p className="text-red-500 text-sm mt-1">{error.color}</p>}
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="combustible"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Combustible
                </Label>
                <Select
                  name="combustible"
                  value={formData.combustible}
                  onValueChange={(value) =>
                    handleSelectChange("combustible", value)
                  }
                >
                  <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400">
                    <SelectValue placeholder="Seleccionar combustible" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="gasolina">Gasolina</SelectItem>
                    <SelectItem value="diesel">Diésel</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                    <SelectItem value="electrico">Eléctrico</SelectItem>
                    <SelectItem value="gnv">GNV</SelectItem>
                  </SelectContent>
                </Select>
                {error.combustible && <p className="text-red-500 text-sm mt-1">{error.combustible}</p>}
              </div>
            </div>

            {/* Row 4: Estado y Kilometraje */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label
                  htmlFor="estado"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Estado
                </Label>
                <Select
                  name="estado"
                  value={formData.estado}
                  onValueChange={(value) => handleSelectChange("estado", value)}
                >
                  <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="nueva">Nueva</SelectItem>
                    <SelectItem value="usada">Usada</SelectItem>
                  </SelectContent>
                </Select>
                {error.estado && <p className="text-red-500 text-sm mt-1">{error.estado}</p>}
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="kilometraje"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Kilometraje
                </Label>
                <Input
                  id="kilometraje"
                  type="number"
                  name="kilometraje"
                  value={formData.kilometraje}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                />
                {error.kilometraje && <p className="text-red-500 text-sm mt-1">{error.kilometraje}</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={loading}
              >
                <div className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg 
                        className="animate-spin h-5 w-5" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <svg 
                        className="h-5 w-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      <span>Guardar Camioneta</span>
                    </>
                  )}
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 px-8 border-2 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:border-zinc-400 dark:hover:border-zinc-600"
                onClick={() => setFormData({
                  marca: "",
                  modelo: "",
                  año: new Date().getFullYear(),
                  placa: "",
                  color: "",
                  combustible: "",
                  estado: "",
                  kilometraje: 0,
                })}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg 
                    className="h-5 w-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                  <span>Cancelar</span>
                </div>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
