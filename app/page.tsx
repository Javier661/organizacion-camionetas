"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Login, ErroresLogin } from "@/acciones/modulo_usuarios";

interface FormData {
  correo: string;
  contraseña: string;
}

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({ 
    correo: "",
    contraseña : "" 
  });
  const [error, setErrores] = useState<Partial<Record<keyof {email: string, password: string}, string>>>({});
  const [mensaje, setMensaje] = useState<string>("");

  useEffect(() => {
    const nuevoMensaje = localStorage.getItem("mensaje");
    if (nuevoMensaje) {
      setMensaje(nuevoMensaje);
      localStorage.removeItem("mensaje");
      setTimeout(() => {
        setMensaje("");
      },4000)
    }
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");
    setErrores({});

    // Validar errores antes de enviar
    const validationErrors = await ErroresLogin({
      email: formData.correo,
      password: formData.contraseña
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrores(validationErrors);
      setMensaje("Por favor, corrige los errores antes de continuar");
      return;
    }

    try {
      const { success, message, redirect: redirectUrl } = await Login({
        email: formData.correo,
        password: formData.contraseña,
      });

      if (!success) {
        setMensaje(message);
        return;
      }

      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión. Por favor, intenta nuevamente.";
      setMensaje(errorMessage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-orange-500/10 hover:shadow-3xl">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full mr-3"></div>
            <h1 className="text-zinc-800 dark:text-zinc-100">
              Inicio de sesión
            </h1>
          </div>

          {mensaje && (
            <div className="mb-6 p-4 text-center rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border border-orange-200 dark:border-orange-800">
              <p className="text-orange-700 dark:text-orange-400 animate-fade-in">
                {mensaje}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <Label htmlFor="correo" className="text-zinc-700 dark:text-zinc-300 mb-2">
                Correo Electronico
              </Label>
              <Input
                id="correo"
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200"
              />
              {error.email && (
                <p className="text-orange-600 dark:text-orange-400 mt-2 animate-pulse">
                  {error.email }
                </p>
              )}
              <Label htmlFor="contraseña" className="text-zinc-700 dark:text-zinc-300 mb-2 mt-4">
                Contraseña
              </Label>
              <Input 
                id="contraseña"
                type="password"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                placeholder="Contraseña"
                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-200"
              />
              {error.password && (
                <p className="text-orange-600 dark:text-orange-400 mt-2 animate-pulse">
                  {error.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200"
            >
              Iniciar Sesion
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
