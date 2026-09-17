"use client";
import { useState } from "react";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
interface datosEliminar {
    id : string;
    nombre?: string;
}

interface props {
    close : () => void;
    open : boolean;
    data : datosEliminar;
}

interface contraseña {
    password : string;
}

export default function EliminarModal({close, open, data}: props) {
    const params = useParams<{ id: string }>();
    const [aprobado, setAprobado] = useState<boolean>(false);
    const [password, setPassword] = useState<contraseña>({
        password : ""
    });
    const [mensaje, setMensaje] = useState<string>("");
    const [statusMensaje, setStatusMessage] = useState<boolean>(false);
    const [mostrarMensaje, setMostrarMensaje] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    
    if(!open) return null;
    
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);    
        try{    
            setStatusMessage(true);
            setMensaje("eliminando...");
            setMostrarMensaje(true);
        } catch(err){
            console.log(err);
            setStatusMessage(false);
            setMensaje("Ocurrió un error al eliminar la camioneta.");
            setMostrarMensaje(true);
        } finally{
            setLoading(false);
        }
    }
    
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassword((prev) => ({
            ...prev,
            [name] : value
        }));
    }

    const handleCancel = () => {
        setPassword({ password: "" });
        setAprobado(false);
        setMostrarMensaje(false);
        setMensaje("");
        close();
    };

    if(aprobado){
        return (
            <Dialog open={open} onOpenChange={handleCancel}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    {mostrarMensaje ? (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                        statusMensaje 
                                            ? "bg-green-100 dark:bg-green-950/30" 
                                            : "bg-red-100 dark:bg-red-950/30"
                                    }`}>
                                        {statusMensaje ? (
                                            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                                        ) : (
                                            <XCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
                                        )}
                                    </div>
                                    <div>
                                        <DialogTitle className="text-zinc-900 dark:text-zinc-100">
                                            {statusMensaje ? "Eliminación exitosa" : "Error al eliminar"}
                                        </DialogTitle>
                                    </div>
                                </div>
                                <DialogDescription className="text-zinc-600 dark:text-zinc-400 pt-2">
                                    {mensaje}
                                </DialogDescription>
                            </DialogHeader> 
                            <DialogFooter className="gap-2">
                                <Button
                                    type="button"
                                    variant={statusMensaje ? "default" : "outline"}
                                    onClick={handleCancel}
                                    className={statusMensaje 
                                        ? "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700" 
                                        : "border-zinc-300 dark:border-zinc-700"
                                    }
                                >
                                    {statusMensaje ? "Aceptar" : "Reintentar"}
                                </Button>
                                {!statusMensaje && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="border-zinc-300 dark:border-zinc-700"
                                    >
                                        Cancelar
                                    </Button>
                                )}
                            </DialogFooter>
                        </>
                    ) : (
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
                                    Por seguridad, ingresa tu contraseña para confirmar la eliminación de{" "}
                                    <span className="text-zinc-900 dark:text-zinc-100">
                                        {data.id}
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
                                        onChange={handleChange}
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
                                    variant="destructive"
                                    disabled={loading || !password.password}
                                    className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                                >
                                    {loading ? "Eliminando..." : "Eliminar definitivamente"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        )
    }
    
    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-zinc-900 dark:text-zinc-100">
                                Confirmar eliminación
                            </DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="text-zinc-600 dark:text-zinc-400 pt-2">
                        ¿Estás seguro que deseas eliminar este usuario?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4 border border-zinc-200 dark:border-zinc-700">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                            Usuario a eliminar:
                        </p>
                        <p className="text-zinc-900 dark:text-zinc-100">
                            {data.nombre}
                        </p>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
                        Esta acción no se puede deshacer. Todos los datos asociados a este usuario serán eliminados permanentemente.
                    </p>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="border-zinc-300 dark:border-zinc-700"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setAprobado(true)}
                        className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                        Continuar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}