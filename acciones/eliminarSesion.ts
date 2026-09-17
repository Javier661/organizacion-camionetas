"use server"
import { cookies } from "next/headers";
export default async function eliminarSesion(){
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return {
        success: true,
        message: "Sesión cerrada correctamente.",
        redirect: "/"
    }
}