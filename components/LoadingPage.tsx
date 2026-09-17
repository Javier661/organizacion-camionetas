import { Truck } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-800"></div>
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-transparent border-t-orange-500 border-r-orange-400"></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg animate-pulse">
            <Truck className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-8 text-center">
        <h2 className="text-zinc-700 dark:text-zinc-300 mb-2">
          Cargando datos...
        </h2>
        <div className="flex gap-1 justify-center">
          <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
}
