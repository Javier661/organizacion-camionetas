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
import {
  User,
  ArrowLeft,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Upload,
  Camera,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface Datos {
  id: string;
  fotografia: string;
  nombre: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface props {
  open: boolean;
  close: () => void;
  datos?: Datos;
  id: string;
}

interface contraseña {
  password: string;
}

export default function EditarPersonal({ open, close, datos, id }: props) {
  const [formData, setFormData] = useState<Datos>({
    id: "",
    fotografia: "",
    nombre: "",
    email: "",
    role: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (datos) {
      setFormData(datos);
      setPreviewImage(datos.fotografia);
    }
  }, [datos]);

  const [aprobado, setAprobado] = useState<boolean>(false);
  const [password, setPassword] = useState<contraseña>({
    password: "",
  });

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validación de tipo de archivo
      if (!file.type.startsWith("image/")) {
        setMensaje("Por favor selecciona un archivo de imagen válido");
        setStatusMessage(false);
        return;
      }

      // Validación de tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMensaje("La imagen no debe superar los 5MB");
        setStatusMessage(false);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData((prev) => ({
          ...prev,
          fotografia: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAprovacion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre.trim()) {
      setMensaje("El nombre es requerido");
      setStatusMessage(false);
      return;
    }
    
    if (!formData.email.trim()) {
      setMensaje("El email es requerido");
      setStatusMessage(false);
      return;
    }
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMensaje("El email no es válido");
      setStatusMessage(false);
      return;
    }
    
    if (!formData.role) {
      setMensaje("El rol es requerido");
      setStatusMessage(false);
      return;
    }
    
    setMensaje("");
    setAprobado(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Aquí iría la llamada a la API para actualizar el usuario
      console.log("Modificando usuario:", formData);
      console.log("Contraseña:", password.password);
      console.log("ID usuario:", id)
      
      // Simulación de delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setStatusMessage(true);
      setMensaje("Usuario modificado exitosamente");
      setAprobado(false);
      setPassword({ password: "" });
      
      // Cerrar después de 2 segundos
      setTimeout(() => {
        close();
        setMensaje("");
      }, 2000);
    } catch (error) {
      const err = error as Error;
      setStatusMessage(false);
      setMensaje(err.message);
      setAprobado(false);
    } finally {
      setLoading(false);
    }
  };

  if (aprobado) {
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
                    Confirmar con contraseña
                  </DialogTitle>
                </div>
              </div>
              <DialogDescription className="text-zinc-600 dark:text-zinc-400 pt-2">
                Por seguridad, ingresa tu contraseña para confirmar la modificación de{" "}
                <span className="text-zinc-900 dark:text-zinc-100">
                  {datos?.nombre}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
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
                  setPassword({ password: "" });
                  setAprobado(false);
                }}
                disabled={loading}
                className="border-zinc-300 dark:border-zinc-700"
              >
                Atrás
              </Button>
              <Button
                type="submit"
                disabled={loading || !password.password}
                className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 dark:text-white"
              >
                {loading ? (<>
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
                </>):(
                    "Confirmar Modificación"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  if (!open) return null;
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
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
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-zinc-800 dark:text-zinc-100">
              Editar Usuario
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Modifica la información de {datos?.nombre}
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
          {/* Fotografía de Perfil */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <Label className="text-zinc-700 dark:text-zinc-300">
              Fotografía de Perfil
            </Label>
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-200 dark:border-zinc-700 shadow-lg transition-all duration-300 group-hover:border-orange-500 dark:group-hover:border-orange-400">
                {previewImage ? (
                  <ImageWithFallback
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                    <User className="h-16 w-16 text-zinc-400 dark:text-zinc-600" />
                  </div>
                )}
              </div>
              <label
                htmlFor="fotografia"
                className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 border-white dark:border-zinc-900"
              >
                <Camera className="h-5 w-5 text-white" />
              </label>
              <input
                id="fotografia"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-center">
              Haz clic en el ícono de cámara para cambiar la foto
            </p>
          </div>

          {/* Nombre Completo */}
          <div className="flex flex-col">
            <Label
              htmlFor="nombre"
              className="text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Nombre Completo
            </Label>
            <Input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez González"
              required
              className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <Label
              htmlFor="email"
              className="text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={datos?.email}
              placeholder="Ej. juan.perez@empresa.com"
              required
              disabled
              className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Rol */}
          <div className="flex flex-col">
            <Label
              htmlFor="role"
              className="text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Rol del Usuario
            </Label>
            <Select
              name="role"
              value={formData.role || datos?.role}
              onValueChange={(value) => handleSelectChange("role", value)}
            >
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <SelectItem value="supervisor">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span>Supervisor</span>
                  </div>
                </SelectItem>
                <SelectItem value="mantenimiento">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>Mantenimiento</span>
                  </div>
                </SelectItem>
                <SelectItem value="conductor">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Conductor</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Información adicional (solo lectura) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col">
              <Label className="text-zinc-500 dark:text-zinc-500 mb-1">
                ID de Usuario
              </Label>
              <p className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg">
                {datos?.id}
              </p>
            </div>
            <div className="flex flex-col">
              <Label className="text-zinc-500 dark:text-zinc-500 mb-1">
                Fecha de Creación
              </Label>
              <p className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg">
                {datos?.createdAt ? new Date(datos.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
          </div>

          {/* ID Hidden */}
          <input type="hidden" name="id" value={datos?.id} />

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading}
            >
              <div className="flex items-center justify-center gap-2">
                <Save className="h-5 w-5" />
                <span>Guardar Cambios</span>
              </div>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 px-8 border-2 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:border-zinc-400 dark:hover:border-zinc-600"
              onClick={close}
              disabled={loading}
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