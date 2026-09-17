"use server";
import axcios from "axios";
import { cookies } from "next/headers";
export const getUsuario = async (id : string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token){
        return {
            errorAuthentication: true,
            message: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar."
        }
    }
    try{
        const response = await axcios.get(`http://${process.env.IP}:${process.env.PORT}/api/users/perfil?id=${id}`, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });
        const { success, user, message } = response.data;
        return { success, user, message };
    }catch(error : any){
        const newMessage = error as Error;
        return {
            success: false,
            message: error.response?.data?.message || newMessage.message
        }
    }
}