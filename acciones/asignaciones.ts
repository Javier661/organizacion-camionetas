"use server"
import { cookies } from "next/headers";
import axios from "axios"
export const RetornoCamionetas = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token){
        return {
            errorAuthentication: true,
            message: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar."
        }
    }
    try{
        const response = await axios.get(`http://${process.env.IP}:${process.env.PORT}/api/asignacion/camionetas-conductor`,{
            headers : { 
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            }
        });
        const { success, camionetas, conductores, message } = response.data;
        return { success, camionetas, conductores, message };
    }catch(error : any){
        const newError = error as Error;
        const mensage = error?.response?.data?.message;
        return {
            success : false,
            message : mensage || `Error al obtener las camionetas: ${newError.message}`
        }
    }
}

export const AgregarAsignacion = async ({idCamioneta, idUsuario} : {idCamioneta : string, idUsuario : string}) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token){
        return {
            errorAuthentication: true,
            message: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar."
        }
    }
    try{
        const response = await axios.post(`http://${process.env.IP}:${process.env.PORT}/api/asignacion`, 
            {idCamioneta, idUsuario},
            { headers : { "Content-Type" : "application/json" , "Authorization" : `Bearer ${token}`},
        });
        const { success, message } = response.data;
        return { success, message };
    }catch(error : any){
        const newError = error as Error;
        return {
            success : false,
            message : error?.response?.data?.message || `Error al agregar la asignacion: ${newError.message}`
        }
    }
}

export const DevolverAsignacion = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token){
        return {
            errorAuthentication: true,
            message: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar."
        }
    }
    try{
        const response = await axios.get(`http://${process.env.IP}:${process.env.PORT}/api/asignacion`, {
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            }
        });
        const { success, result, message } = response.data;
        return { success, result, message };
    }catch(error : any){
        const newError = error as Error;
        return {
            success : false,
            message : error?.response?.data?.message || `Error aqui : ${newError.message}`  
        }   
    }
}
