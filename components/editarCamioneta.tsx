"use client"
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
import { ModificarCamioneta } from "@/acciones/modulo_camioneta";
import { Truck, ArrowLeft, Save, X, CheckCircle2, AlertCircle,  AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Datos {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  placa: string;
  color: string;
  combustible: string;
  estado: string;
  kilometraje: number;
}

interface props {
  open: boolean;
  close: () => void;
  datos?: Datos;
  id: string;
}

interface contraseña {
    correo : string;
    password : string;
}

export default function EditarCamioneta({ open, close, datos , id}: props) {
  const [formData, setFormData] = useState<Datos>({
    id: "",
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
  const [statusMessage, setStatusMessage] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");

  useEffect(() => {
    if (datos) {
      setFormData(datos);
    }
  }, [datos]);

  const [aprobado, setAprobado] = useState<boolean>(false);
  const [password, setPassword] = useState<contraseña>({
    correo : "",
    password : ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "año" || name === "kilometraje" ? Number(value) : value,
    }));
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name , value} = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAprovacion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAprobado(true);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success, message } = await ModificarCamioneta(formData, password.password, password.correo, id);
      if(!success){
       setAprobado(false);
      }
      setStatusMessage(success);
      setAprobado(false);
      setMensaje(message);
    } catch (error) {
      const err = error as Error;
      setStatusMessage(false);
      setMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;


  if(aprobado){
    return (
      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleSubmit}>
            
            <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                    </div>
                    <div>
                        <DialogTitle className="text-zinc-900 dark:text-zinc-100">
                            Confirmar las credenciales del supervisor
                        </DialogTitle>
                    </div>
                </div>
                <DialogDescription className="text-zinc-600 dark:text-zinc-400 pt-2">
                    Por seguridad, ingresa las credenciales del supervisor para confirmar la modificacion de{" "}
                    <span className="text-zinc-900 dark:text-zinc-100">
                        {datos?.id}
                    </span>
                </DialogDescription>
            </DialogHeader>

            <div className="py-6">
                <div className="space-y-2 mb-4">
                    <Label
                        htmlFor="email"
                        className="text-zinc-700 dark:text-zinc-300"
                    >
                        Correo
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="correo"
                        value={password.correo}
                        onChange={handlePassword}
                        placeholder="Ingresa tu correo"
                        required
                        disabled={loading}
                        className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                        autoFocus
                    />
                </div>
                <div className="space-y-2">
                    <Label
                        htmlFor="password"
                        className="text-zinc-700 dark:text-zinc-300"
                    >
                        Contraseña
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={password.password}
                        onChange={handlePassword}
                        placeholder="Ingresa tu contraseña"
                        required
                        disabled={loading}
                        className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                        autoFocus
                    />
                </div>
                
            </div>

            <DialogFooter className="gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setPassword({ correo: "", password: "" });
                        setAprobado(false);
                    }}
                    disabled={loading}
                    className="border-zinc-300 dark:border-zinc-700"
                >
                    Atrás
                </Button>
                <Button
                    type="submit"
                    variant="destructive"
                    disabled={loading || !password.password}
                    className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 dark:text-white"
                >
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
                    <span>Modificando...</span>
                    </>
                    ) : "Modificar"}
                </Button>
            </DialogFooter>
        </form>
        </DialogContent>
      </Dialog>
    )
  }
  return (
<div className="w-full max-w-7xl mx-auto">
      {/* Back Button and Header */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={close}
          className="mb-6 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al listado
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-zinc-800 dark:text-zinc-100">
              Editar Camioneta
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Modifica la información de {datos?.marca} {datos?.modelo}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Message */}
      {mensaje && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <Alert
            className={`${
              statusMessage
                ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            {statusMessage ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <AlertTitle
              className={
                statusMessage
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }
            >
              {statusMessage ? "¡Éxito!" : "Error"}
            </AlertTitle>
            <AlertDescription
              className={
                statusMessage
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }
            >
              {mensaje}
            </AlertDescription>
          </Alert>
        </div>
      )}


      {/* Form Container */}
      <div className="w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-orange-500/10 hover:shadow-3xl">
        <form onSubmit={handleAprovacion} className="space-y-6">
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
                disabled
              />
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
                value={formData.color || datos?.color}
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
                value={formData.combustible || datos?.combustible}
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
                value={formData.estado || datos?.estado}
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
            </div>
          </div>

          {/* ID Display (hidden but available) */}
          <input type="hidden" name="id" value={datos?.id} />

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
                    <Save className="h-5 w-5" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </div>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 border-2 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:border-zinc-400 dark:hover:border-zinc-600"
              onClick={close}
            >
              <div className="flex items-center justify-center gap-2">
                <X className="h-5 w-5" />
                <span>Cancelar</span>
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
