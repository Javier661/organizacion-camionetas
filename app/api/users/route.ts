import { NextResponse , NextRequest} from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";
export const POST = async (request: NextRequest) => {
    const authHeader = request.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return NextResponse.json("Unauthorized",{ status: 401 } );
    }
    try{
        const { nombre, email, password, role, imagen } = await request.json();
        let urlImage = "";
        if(!nombre || !email || !password || !role){
            return NextResponse.json({
                success: false,
                message: "Todos los campos son obligatorios."
            }, { status: 400 } );
        }
        
        const existingUser = await prisma.usuarios.findUnique({
            where: {
                email: email,
            }
        });
        if(existingUser){
            return NextResponse.json({
                success: false,
                message: "El correo ya está en uso."
            }, { status: 400 } );
        }

        if (imagen && typeof imagen !== "string") {
            const bytes = await imagen.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const filename = `${nombre}-${Date.now()}.jpg`;
            const filepath = `./public/uploads/${filename}`;

            await fs.promises.writeFile(filepath, buffer);

            urlImage = `/uploads/${filename}`;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await prisma.usuarios.create({
            data: {
                nombre: nombre,
                email: email,
                password: hashedPassword,
                role: role,
                fotografia : urlImage
            },
        })
        if(result){
            return NextResponse.json({
                success: true,
                message: "Usuario agregado exitosamente."
            }, { status: 201 } );
        }
        return NextResponse.json({
            success: false,
            message: "Error al agregar el usuario."
        }, { status: 500 } );
    }catch(error){
        const newMessage = typeof error === 'string' ? error : (error as Error).message;
        return NextResponse.json({
            success: false,
            message: newMessage
        }, { status: 500 } );
    }finally{
        await prisma.$disconnect();
    }
}
export const GET = async (request: NextRequest) => {
    const authHeader = request.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return new Response("Unauthorized",{ status: 401 } );
    }
    try{
        const result = await prisma.usuarios.findMany({
            select: {
                id: true,
                nombre: true,
                email: true,
                role: true,
                fotografia: true,
                createdAt: true,
                updatedAt: true
            },
        });
        if(result.length === 0){
            return NextResponse.json({
                success: false,
                message: "No hay usuarios registrados."
            }, { status: 400 } );
        }
        return NextResponse.json({
            success: true,
            data: result
        }, { status: 200 } );
    }catch(error){
        const newMessage = typeof error === 'string' ? error : (error as Error).message;
        return NextResponse.json({
            success: false,
            message: newMessage
        }, { status: 500 } );
    }finally{
        await prisma.$disconnect();
    }
}

export const PUT = async (request: NextRequest) => {
    const authHeader = request.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return new Response("Unauthorized",{ status: 401 } );
    }
    try{
        const { id, nombre, role, imagen, password, idUsuario } = await request.json();
        let urlImage = "";
        if(!id || !nombre || !role || !idUsuario){
            return NextResponse.json({
                success: false,
                message: "Todos los campos son obligatorios."
            }, { status: 400 } );
        }
        if (imagen && typeof imagen !== "string") {
            const bytes = await imagen.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const filename = `${nombre}-${Date.now()}.jpg`;
            const filepath = `./public/uploads/${filename}`;

            await fs.promises.writeFile(filepath, buffer);

            urlImage = `/uploads/${filename}`;
        }

        const validarUsuario = await prisma.usuarios.findUnique({
            where : {
                id : idUsuario
            },select : {
                role : true,
                password : true
            }
        })

        if(validarUsuario?.role !== "supervisor"){
            return NextResponse.json({
                success: false,
                message: "Solo los supervisores pueden realizar modificaciones."
            }, { status: 403 } );
        }

        if(!bcrypt.compareSync(password, validarUsuario.password)){
            return NextResponse.json({
                success: false,
                message: "Contraseña incorrecta."
            }, { status: 401 } );
        }

        const result = await prisma.usuarios.update({
            where: {
                id: id,
            },
            data: {
                nombre: nombre,
                role: role,
                fotografia : urlImage
            },
        });
        if(result){
            return NextResponse.json({
                success: true,
                message: "Usuario modificado exitosamente."
            }, { status: 200 } );
        }
        return NextResponse.json({
            success: false,
            message: "Error al modificar el usuario."
        }, { status: 404 } );
    }catch(error){
        const newMessage = typeof error === 'string' ? error : (error as Error).message;
        return NextResponse.json({
            success: false,
            message: newMessage
        }, { status: 500 } );
    }finally{
        await prisma.$disconnect();
    }
}