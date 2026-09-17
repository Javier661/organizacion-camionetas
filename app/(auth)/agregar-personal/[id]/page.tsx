"use client";
import { useState, useEffect, useRef } from "react";
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
import {AlertTitle} from "@/components/ui/alert";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, CheckCircle2, XCircle, RotateCcw, Save, X, Upload} from "lucide-react";
import { AgregarPersona, Errores } from '@/acciones/modulo_usuarios';
interface UsuarioData {
  nombre: string;
  email: string;
  password: string;
  role: string;
  imagen?: File | null;
}
import Image from "next/image";
import ReincioSesion from "@/components/reiniciarSesion";
export default function Agregar() {
  const [formData, setFormData] = useState<UsuarioData>({
    nombre: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<boolean>(false);
  const [error, setErrores] = useState<Partial<Record<keyof UsuarioData, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSessionRestart, setShowSessionRestart] = useState<boolean>(false);
  const handleSelectChange = async (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Validar el campo después de cambiar
    const errores = await Errores(formData);
    setErrores((prev) => ({
      ...prev,
      [name]: errores[name as keyof UsuarioData],
    }));
  };
  
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      imagen: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrores((prev) => ({
          ...prev,
          imagen: "Solo se permiten archivos JPG, PNG o WEBP",
        }));
        return;
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrores((prev) => ({
          ...prev,
          imagen: "La imagen no debe superar los 5MB",
        }));
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setFormData((prev) => ({
        ...prev,
        imagen: file,
      }));

      setErrores((prev) => ({
        ...prev,
        imagen: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success, message, errorAuthentication } = await AgregarPersona(formData);
      
      if(errorAuthentication){
        setShowSessionRestart(true);
        setMensaje(message)
        return;
      }

      const errores = await Errores(formData);
      if(success){
        setFormData({
          nombre: "",
          email: "",
          password: "",
          role: "",
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

  const handleReset = () => {
    setFormData({
      nombre: "",
      email: "",
      password: "",
      role: "",
    });
    setErrores({});
    setMensaje("");
  };
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
            className={`shadow-2xl border-2 ${
              statusMessage 
                ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900" 
                : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
            }`}
          >
            {statusMessage ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            <AlertTitle className={statusMessage ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}>
              {statusMessage ? "¡Éxito!" : "Error"}
            </AlertTitle>
            <AlertDescription className={`${statusMessage ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
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
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-zinc-800 dark:text-zinc-100">
                  Agregar Personal
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Completa los datos del nuevo usuario
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Imagen de perfil */}
            <div className="flex flex-col items-center mb-6">
              <Label className="text-zinc-700 dark:text-zinc-300 mb-4">
                Foto de perfil
              </Label>
              
              <div className="relative">
                {/* Preview de imagen */}
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 border-4 border-white dark:border-zinc-900 shadow-xl flex items-center justify-center">
                  {imagePreview ? (
                    <Image 
                      src={imagePreview}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-zinc-400 dark:text-zinc-600" />
                  )}
                </div>

                {/* Botón de remover imagen */}
                {imagePreview && (
                  <Button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Botones de carga */}
              <div className="flex gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
                  disabled={loading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {imagePreview ? "Cambiar foto" : "Subir foto"}
                </Button>
              </div>

              {/* Input oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Error de imagen */}
              {error.imagen && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  {error.imagen}
                </p>
              )}

              {/* Info de imagen */}
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">
                JPG, PNG o WEBP. Máx 5MB.
              </p>
            </div>

            {/* Row 1: Nombre y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label
                  htmlFor="nombre"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Nombre completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  className={`bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200 ${
                    error.nombre ? "border-red-500 dark:border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                {error.nombre && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {error.nombre}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="email"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Correo electrónico <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="usuario@ejemplo.com"
                  className={`bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200 ${
                    error.email ? "border-red-500 dark:border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                {error.email && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {error.email}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Contraseña y Rol */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label
                  htmlFor="password"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Contraseña <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className={`bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200 ${
                    error.password ? "border-red-500 dark:border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                {error.password && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {error.password}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="role"
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Rol <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="role"
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                  disabled={loading}
                >
                  <SelectTrigger 
                    className={`bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 ${
                      error.role ? "border-red-500 dark:border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Seleccionar un rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="conductor">Conductor</SelectItem>
                  </SelectContent>
                </Select>
                {error.role && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {error.role}
                  </p>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Nota:</strong> Todos los campos marcados con <span className="text-red-500">*</span> son obligatorios.
                La contraseña debe tener al menos 6 caracteres.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
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
                      <span>Agregar Personal</span>
                    </>
                  )}
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 px-8 border-2 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:border-zinc-400 dark:hover:border-zinc-600"
                onClick={handleReset}
                disabled={loading}
              >
                <div className="flex items-center justify-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  <span>Limpiar</span>
                </div>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
