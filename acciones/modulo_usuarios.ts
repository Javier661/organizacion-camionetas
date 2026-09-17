"use server";
import axios from "axios";
import { cookies } from "next/headers";
interface Usuario {
    nombre : string;
    email : string;
    password : string;
    role : string;
    imagen?: File | null;
}
export async function Login({email, password}: {email: string, password: string}) {
    try{
        const response = await axios.post("http://localhost:3000/api/users/login", { email, password }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            withXSRFToken: true
        });
        const { success, message, redirect, token } = response.data;
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 // 1 hour
        });
        return { success, message, redirect };
    }catch(error : any){
        const errorAxios = error.response?.data?.message;
        return {
            success : false,
            message : errorAxios || `Error en el login: ${error.message}`
        }
    }
}

export const ErroresLogin = async ({email, password}: {email: string, password: string}) => {
    const errores: Partial<Record<keyof {email: string, password: string}, string>> = {};
    if(email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)){
        errores.email = "El correo no es válido.";
    }
    if(!password){
        errores.password = "La contraseña es obligatoria.";
    }
    return errores;
}

export const Errores = async (formData: Usuario) => {
    const errores: Partial<Record<keyof Usuario, string>> = {};
    if(!formData.email){
        errores.email = "El correo es obligatorio.";
    }
    if(formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)){
        errores.email = "El correo no es válido.";
    }
    if(!formData.password){
        errores.password = "La contraseña es obligatoria.";
    }
    if(formData.password && formData.password.length < 6){
        errores.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    if(!formData.nombre){
        errores.nombre = "El nombre es obligatorio.";
    }
    if(!formData.role){
        errores.role = "El rol es obligatorio.";
    }
    if(!formData.imagen){
        errores.imagen = "la imagen es obligatoria"
    }
    return errores;
}

export const AgregarPersona = async (formData: Usuario) => {    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token){
        return {
            errorAuthentication: true,
            message: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar."
        }
    }
    try{
        const response = await axios.post("http://localhost:3000/api/users", formData , {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
            withXSRFToken: true
        })
        const { success, message } = response.data;
        return { success, message };
    }catch(error: any){
        const errorAxios = error.response?.data?.message;
        return {
            success : false,
            message : errorAxios || `Error al agregar el usuario: ${error.message}`
        }
    }
}

export const ObtenerUsuarios = async () => {    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if(!token){
        return {
            errorAuthentication: true,
            message: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar."
        }
    }
    try{
        const response = await axios.get("http://localhost:3000/api/users", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
            withXSRFToken: true
        });
        const { success, data, message } = response.data;
        return { success, data, message };
    }catch(error: any){
        const errorAxios = error.response?.data?.message;
        return {
            success : false,
            message : errorAxios || `Error: ${error.message}`
        }
    }
}

export const UsuarioValidado = async () => {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if(!token){
            return {
                errorAuthentication: true,
                message: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo para continuar."
            }
        }
        const response = await axios.get(`http://${process.env.IP}:${process.env.PORT}/api/users/login`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
            withXSRFToken: true
        });
        const { success, user, message } = response.data;
        return { success, user, message };
    }catch(error : any){
        const errorAxios = error.response?.data?.message;
        return {
            success : false,
            message : errorAxios || `Error al validar el usuario: ${error.message}`
        }
    }
}