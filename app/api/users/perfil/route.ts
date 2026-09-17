import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken";
export const GET = async (req : NextRequest) => {
    const authHeader = req.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")) return new Response("Unauthorized",{ status: 401 } );
    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get("id");
    if(!id) return NextResponse.json({
        success: false,
        message: "El ID del usuario es obligatorio."
    }, { status: 400 });
    const token = authHeader.replace("Bearer ", "");
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {id : string};
        if(decoded.id !== id) return new Response("Forbidden",{ status: 403 } );
        const user = await prisma.usuarios.findUnique({
            where: {
                id: id
            }, select : {
                id : true,
                nombre : true,
                email : true,
                role : true,
                fotografia : true,
                createdAt : true,
                updatedAt : true
            }
        });
        if(!user){
            return NextResponse.json({
                success: false,
                message: "Usuario no encontrado."
            }, { status: 404 } );
        }
        return NextResponse.json({
            success: true,
            user
        }, { status: 200} );
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: `Error en el servidor. ${(error as Error).message}`
        }, { status: 500 } );
    }finally{
        await prisma.$disconnect();
    }
}