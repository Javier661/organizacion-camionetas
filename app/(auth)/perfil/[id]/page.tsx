"use client";
import { useCallback, useEffect, useState } from "react";
import { getUsuario } from "@/acciones/modulo_perfil";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Lock,
  Trash2,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  role: string;
  fotografia: string;
  createdAt: string;
  updatedAt: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Perfil() {
  const params = useParams<{ id: string }>();
  const [datos, setDatos] = useState<Usuario | null>(null);
  const [mensaje, setMensaje] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const id = params.id;

  const recuperarUsuarios = useCallback(async () => {
    try {
      const { success, user, message } = await getUsuario(id);
      if (!success) {
        setMensaje(message || "No se pudieron obtener los datos del usuario.");
        return;
      }
      setDatos(user);
    } catch (error) {
      const newError = error as Error;
      setMensaje(`Error al obtener los datos del usuario. ${newError.message}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    recuperarUsuarios();
  }, [recuperarUsuarios]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400";
      case "usuario":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    setPasswordMessage(null);
  };

  const handleChangePassword = async () => {
    // Validaciones
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Todos los campos son obligatorios" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "La nueva contraseña debe tener al menos 6 caracteres" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Las contraseñas no coinciden" });
      return;
    }

    setPasswordLoading(true);
    
    // Simular llamada a API (reemplaza con tu función real)
    setTimeout(() => {
      setPasswordMessage({ type: "success", text: "Contraseña actualizada exitosamente" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordLoading(false);
    }, 1500);
  };

  const handleDeleteAccount = async () => {
    // Aquí implementarías la lógica para eliminar la cuenta
    console.log("Eliminando cuenta...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mensaje && !datos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-6">
        <Alert className="max-w-md border-red-200 dark:border-red-800">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600 dark:text-red-400">{mensaje}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-zinc-900 dark:text-zinc-100">Mi Perfil</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar - Información del Usuario */}
          <div className="lg:col-span-1">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  {/* Avatar */}
                  <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-orange-200 dark:border-orange-900/50 shadow-xl ring-4 ring-orange-100 dark:ring-orange-950/30">
                      <AvatarImage src={datos?.fotografia} alt={datos?.nombre} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-3xl">
                        {datos?.nombre?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-full transition-all duration-200" />
                  </div>

                  {/* Nombre */}
                  <div className="text-center space-y-2">
                    <h2 className="text-xl text-zinc-900 dark:text-zinc-100">{datos?.nombre}</h2>
                    <Badge className={`${getRoleColor(datos?.role || "")} border-0`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {datos?.role}
                    </Badge>
                  </div>

                  <Separator className="bg-zinc-200 dark:bg-zinc-800" />

                  {/* Información adicional */}
                  <div className="w-full space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <Mail className="h-4 w-4 text-orange-500" />
                      <span className="truncate">{datos?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">Miembro desde</span>
                        <span>{formatDate(datos?.createdAt || "")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <User className="h-5 w-5 text-orange-500" />
                  Información Personal
                </CardTitle>
                <CardDescription>Detalles de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-zinc-700 dark:text-zinc-300">Nombre Completo</Label>
                    <Input
                      value={datos?.nombre}
                      disabled
                      className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-700 dark:text-zinc-300">Correo Electrónico</Label>
                    <Input
                      value={datos?.email}
                      disabled
                      className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-700 dark:text-zinc-300">Rol</Label>
                    <Input
                      value={datos?.role}
                      disabled
                      className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-700 dark:text-zinc-300">Última Actualización</Label>
                    <Input
                      value={formatDate(datos?.updatedAt || "")}
                      disabled
                      className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cambiar Contraseña */}
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <Lock className="h-5 w-5 text-orange-500" />
                  Cambiar Contraseña
                </CardTitle>
                <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mensaje de estado */}
                {passwordMessage && (
                  <Alert
                    className={`${
                      passwordMessage.type === "success"
                        ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30"
                        : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30"
                    }`}
                  >
                    {passwordMessage.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                    <AlertDescription
                      className={`${
                        passwordMessage.type === "success"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {passwordMessage.text}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Contraseña Actual */}
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-zinc-700 dark:text-zinc-300">
                      Contraseña Actual
                    </Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        className="pr-10 border-zinc-300 dark:border-zinc-700 focus:border-orange-500 dark:focus:border-orange-500"
                        placeholder="Ingresa tu contraseña actual"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                        }
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4 text-zinc-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-zinc-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Nueva Contraseña */}
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-zinc-700 dark:text-zinc-300">
                      Nueva Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        className="pr-10 border-zinc-300 dark:border-zinc-700 focus:border-orange-500 dark:focus:border-orange-500"
                        placeholder="Ingresa tu nueva contraseña"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-zinc-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-zinc-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Mínimo 6 caracteres
                    </p>
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-zinc-700 dark:text-zinc-300">
                      Confirmar Nueva Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        className="pr-10 border-zinc-300 dark:border-zinc-700 focus:border-orange-500 dark:focus:border-orange-500"
                        placeholder="Confirma tu nueva contraseña"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                        }
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-zinc-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-zinc-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Actualizar Contraseña
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Zona de Peligro */}
            <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Zona de Peligro
                </CardTitle>
                <CardDescription className="text-red-600/80 dark:text-red-400/80">
                  Acciones irreversibles en tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 p-4 border border-red-200 dark:border-red-800 rounded-lg bg-white/50 dark:bg-red-950/30">
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm text-red-900 dark:text-red-100">
                      Eliminar mi cuenta
                    </h4>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Esta acción es permanente y no se puede deshacer. Todos tus datos serán eliminados
                      de forma permanente.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 shadow-md"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar Cuenta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-zinc-200 dark:border-zinc-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                          <AlertTriangle className="h-5 w-5" />
                          ¿Estás completamente seguro?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>
                            Esta acción <span className="text-red-600 dark:text-red-400">no se puede deshacer</span>.
                            Esto eliminará permanentemente tu cuenta y removerá todos tus datos de nuestros
                            servidores.
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-2">
                            Se eliminarán: perfil, configuraciones, datos asociados y toda tu información
                            personal.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-300 dark:border-zinc-700">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                          Sí, eliminar mi cuenta
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}