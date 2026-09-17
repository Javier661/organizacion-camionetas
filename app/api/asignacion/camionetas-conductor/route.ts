import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
export const GET = async (request : NextRequest) => {
    const authHeader = request.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return new Response("Unauthorized",{ status: 401 } );
    }
    try{
        const camionetas = await prisma.camionetas.findMany(
        { where: { 
            AND : {
                activo: true,
                asignado : false
            }
        }, select : {
            id : true,
            marca : true,
            modelo : true
        } }
        );
        const conductores = await prisma.usuarios.findMany({
            where: {
                role : "conductor"
            }, select : {
                id : true,
                nombre : true,
                fotografia : true
            }
        });

        if(!conductores || conductores.length === 0){
            return NextResponse.json({
                success: false,
                message: "No se encontraron conductores disponibles."
            }, { status: 404 } );
        }
        if(!camionetas || camionetas.length === 0){
            return NextResponse.json({
                success: false,
                message: "No se encontraron camionetas disponibles."
            }, { status: 404 } );
        }
        return NextResponse.json({
            success: true,
            camionetas,
            conductores
        }, { status: 200 } );
    }catch(error){
        const newError = error as Error;
        return NextResponse.json({
            success: false,
            message: `Error al obtener los resultados. ${newError.message}`
        }, { status: 500 } );
    }finally{
        await prisma.$disconnect();
    }
}