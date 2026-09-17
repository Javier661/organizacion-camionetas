import { AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReincioSesionProps {
    auth : boolean;
    message : string;
    fetchCamionetas: () => Promise<void>;
    header: string;
    eleccionboton?: string;
}

export default function ReincioSesion({ auth, message, fetchCamionetas, header , eleccionboton}: ReincioSesionProps) {
    return (
        <div>
            {auth && (
                <div className="max-w-md w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-red-200 dark:border-red-900 text-center">
                    <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950 dark:to-red-900 flex items-center justify-center mb-6 shadow-lg">
                        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-zinc-800 dark:text-zinc-100 mb-3">
                        {header}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                        No se pudieron obtener los datos del sistema
                    </p>
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                        <p className="text-red-700 dark:text-red-400 flex items-center justify-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {message}
                        </p>
                    </div>
                    <Button 
                        onClick={fetchCamionetas}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200"
                    >
                        {eleccionboton}
                    </Button>
                </div>
            )}
        </div>
    )
}