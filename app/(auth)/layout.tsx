"use client"
import Navegacion from "@/components/Navegacion";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/modeToggle";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Home } from "lucide-react"

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  const params = useParams<{ id: string }>();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="md:hidden">
                  <Navegacion />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg flex items-center justify-center">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <Link href={`/dashboard/${params.id}`} className="text-zinc-800 dark:text-zinc-100 text-sm sm:text-base">
                    Sistema de Gestión
                  </Link>
                </div>
                <div className="hidden md:block md:ml-8">
                  <Navegacion />
                </div>
              </div>
              <ModeToggle />
            </div>
          </div>
        </nav>
        {children}
      </ThemeProvider>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-600 dark:text-zinc-400">
          <p>© 2025 Sistema de Gestión. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
