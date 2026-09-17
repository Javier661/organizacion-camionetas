"use server"
import axios from "axios"
import { cookies } from "next/headers";
interface FormData {
    marca : string;
    modelo : string;
    año : number;
    placa : string;
    color : string;
    combustible : string;
    estado : string;
    kilometraje : number;
}

export async function AgregarCamioneta(formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token){
        return {
            errorAuthentication: true,
            message: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar."
        }
    }
    try{
       const response = await axios.post(`http://${process.env.IP}:${process.env.PORT}/api/asignacion/acciones-camionetas`, {
            formData
        }, { headers: {
            'Content-Type': 'application/json',
            'Authorization ': `Bearer ${token}`
        }});
        const { success, message } = response.data;
        return { success, message };
    }catch(error : any){
        const newMessage = error as Error;
        return {
            success: false,
            message: error.response?.data?.message || newMessage.message
        }
    } 
}

export async function ObtenerCamionetas(){
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token){
        return {
            errorAuthentication: true,
            message: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar."
        }
    }
    try{
        const response = await axios.get(`http://${process.env.IP}:${process.env.PORT}/api/asignacion/acciones-camionetas`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const { success, data, message } = response.data;
        return { success, data, message };
    }catch(error : any){
        const newMessage = error as Error;
        return {
            success: false,
            message: error.response?.data?.message || newMessage.message
        }
    }
}

export async function ModificarCamioneta(formData: FormData, password: string, correo : string , id : string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token){
        return {
            errorAuthentication: true,
            message: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar."
        }
    }
    try{
        const response = await axios.put(`http://${process.env.IP}:${process.env.PORT}/api/asignacion/acciones-camionetas`, {
            formData,
            password,
            correo,
            id
        }, { headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
        const { success, message } = response.data;
        return { success, message };
    }catch(error : any){
        const newMessage = error as Error;
        return {
            success: false,
            message: error.response?.data?.message || newMessage.message
        }
    }
}

export async function EliminarCamioneta(placa: string, id: string, contraseña : string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token){
        return {
            errorAuthentication: true,
            message: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar."
        }
    }
    try{
        const response = await axios.delete(`http://${process.env.IP}:${process.env.PORT}/api/asignacion/acciones-camionetas`, {
            data: { placa, id, contraseña },
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const { success, message } = response.data;
        return { success, message };
    }catch(error : any){
        const newMessage = error as Error;
        return {
            success: false,
            message: error.response?.data?.message || newMessage.message
        }
    }
}

export async function ErroresAgregar(formData: FormData) {
    const errores: Partial<Record<keyof FormData, string>> = {};
    if(!formData.marca){
        errores.marca = "La marca es obligatoria.";
    }
    if(!formData.modelo){
        errores.modelo = "El modelo es obligatorio.";
    }
    if(!formData.año){
        errores.año = "El año es obligatorio.";
    }
    if(!formData.placa){
        errores.placa = "La placa es obligatoria.";
    }
    if(!formData.color){
        errores.color = "El color es obligatorio.";
    }
    if(!formData.combustible){
        errores.combustible = "El tipo de combustible es obligatorio.";
    }
    if(!formData.estado){
        errores.estado = "El estado es obligatorio.";
    }
    if(!formData.kilometraje){
        errores.kilometraje = "El kilometraje es obligatorio.";
    }
    return errores;
}