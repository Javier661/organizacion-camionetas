import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
export const POST = async (request: NextRequest) => {
    const authHeader = request.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return new Response("Unauthorized",{ status: 401 } );
    }
    const formData = await request.json();
    try{
         if(!formData.marca || !formData.modelo || !formData.año || !formData.placa || !formData.color || !formData.combustible || !formData.estado || !formData.kilometraje){
            return NextResponse.json({
                success: false,
                message: "Todos los campos son obligatorios."
            }, { status: 400 });
        }
        const validPlaca = await prisma.camionetas.findUnique({
            where: {
                placa: formData.placa,
            },
        });

        if(validPlaca){
            return NextResponse.json({
                success: false,
                message: "La placa ya está registrada."
            }, { status: 400 });
        }
        
        const result = await prisma.camionetas.create({
            data: {
                marca: formData.marca,
                modelo: formData.modelo,
                año: formData.año,
                placa: formData.placa,
                color: formData.color,
                combustible: formData.combustible,
                estado: formData.estado,
                kilometraje: formData.kilometraje,
            },
        })

        if(result){
            return NextResponse.json({
                success: true,  
                message: "Camioneta agregada exitosamente."
            }, { status: 201 });
        }
        return NextResponse.json({
            success: false,
            message: "Error al agregar la camioneta."
        }, { status: 500 });
    }catch(error){
        const newError = error as Error
        return NextResponse.json( {
            success: false,
            message : `Error al crear la asignación: ${newError.message}`
        }, { status: 500 });
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
        const result = await prisma.camionetas.findMany({
            where:{
                activo : true,
            },
            select : {
                id: true,
                marca: true,
                modelo: true,
                año: true,
                placa: true,
                color: true,
                combustible: true,
                estado: true,
                kilometraje: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        if(!result || result.length === 0){
            return NextResponse.json({
                success: false,
                message: "No hay camionetas registradas."
            }, { status: 400 });
        }
        return NextResponse.json({
            success: true,
            data: result
        }, { status: 200 });
    }catch(error){
        const newMessage = typeof error === 'string' ? error : (error as Error).message;
        return NextResponse.json( {
            success: false,
            message: newMessage
        }, { status: 500 });
    } finally{
        await prisma.$disconnect();
    }
}

export const DELETE = async (request: NextRequest) => {
    const authHeader = request.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return new Response("Unauthorized",{ status: 401 } );
    }
    try{
        const { placa, id, contraseña } = await request.json();
        if(!placa){
            return NextResponse.json({
                success: false,
                message: "La placa es obligatoria para eliminar la camioneta."
            }, { status: 400 });
        }

        if(!contraseña){
            return NextResponse.json({
                success: false,
                message: "La contraseña es obligatoria para eliminar la camioneta."
            }, { status: 400 });
        }

        const recuperarAdministrador = await prisma.usuarios.findFirst({
            where: {
                id : id,
            },select : {
                role : true,
                password : true,
                id: true
            }
        });

        if(recuperarAdministrador!.role !== "supervisor"){
            return NextResponse.json({
                success: false,
                message: "Solo un supervisor puede eliminar una camioneta."
            }, { status: 400 });
        }
        if(!bcrypt.compareSync(contraseña, recuperarAdministrador!.password)){
            return NextResponse.json({
                success: false,
                message: "Contraseña incorrecta."
            }, { status: 400 });
        }

        const result = await prisma.camionetas.update({
            where: {
                placa: placa,
            },
            data : {
                activo : false,
            },
            select : {
                id: true,
            }
        })
        if(result){
            const updateModificaciones = await prisma.modificaciones.create({
                data: {
                    camionetaId: result.id,
                    usuarioId: id,
                    supervisor : recuperarAdministrador!.id,
                    fecha : new Date(),
                    estado : "eliminada"
                }
            })
            if(!updateModificaciones){
                return NextResponse.json({
                    success: false,
                    message: "Error al registrar la eliminación."
                }, { status: 400 });
            }
            return NextResponse.json({
                success: true,
                message: "Camioneta eliminada exitosamente."
            }, { status: 200 });
        }
        return NextResponse.json({
            success: false,
            message: "Error al eliminar la camioneta."
        }, { status: 400 });
    }catch(error){
        const newMessage = typeof error === 'string' ? error : (error as Error).message;
        return NextResponse.json({
            success: false,
            message: newMessage
        }, { status: 500 });
    } finally{
        await prisma.$disconnect();
    }
}

export const PUT = async (request: NextRequest) => {
    const authHeader = request.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return new Response("Unauthorized",{ status: 401 } );
    }
    try{
        const { formData, password, correo, id } =  await request.json();
        if(!formData.marca || !formData.modelo || !formData.año  || !formData.color || !formData.combustible || !formData.estado || !formData.kilometraje){
            return NextResponse.json({
                success: false,
                message: "Todos los campos son obligatorios."
            }, { status: 400 });
        }

        if(!password || !correo){
            return NextResponse.json({
                success: false,
                message: "Las credenciales son obligatoria para modificar la camioneta."
            }, { status: 400 });
        }

        const recuperarAdministrador = await prisma.usuarios.findFirst({
            where: {
                email : correo,
            },select : {
                role : true,
                password : true,
                id: true
            }
        });

        if(recuperarAdministrador!.role !== "supervisor"){
            return NextResponse.json({
                success: false,
                message: "Solo un supervisor puede modificar una camioneta."
            }, { status: 400 });
        }
        
        if(!bcrypt.compareSync(password, recuperarAdministrador!.password)){
            return NextResponse.json({
                success: false,
                message: "Contraseña incorrecta."
            }, { status: 400 });
        }
        
        const result = await prisma.camionetas.update({
            where: {
                placa: formData.placa,
            },
            data: {
                marca: formData.marca,
                modelo: formData.modelo,
                año: formData.año,
                color: formData.color,
                combustible: formData.combustible,
                estado: formData.estado,
                kilometraje: formData.kilometraje,
            },select : {
                id: true,
            }
        })
        if(result){
            const updateModificaciones = await prisma.modificaciones.create({
                data: {
                    camionetaId: result.id,
                    usuarioId: id,
                    supervisor : recuperarAdministrador!.id,
                    fecha : new Date(),
                    estado : "modificada"
                }
            })
            if(!updateModificaciones){
                return NextResponse.json({
                    success: false,
                    message: "Error al registrar la modificación."
                }, { status: 400 });
            }
            return NextResponse.json({
                success: true,
                message: "Camioneta modificada exitosamente."
            }, { status: 200 });
        }
        return NextResponse.json({
            success: false,
            message: "Error al modificar la camioneta."
        }, { status: 400 });
    }catch(error){
        const newMessage = typeof error === 'string' ? error : (error as Error).message;
        return NextResponse.json({
            success: false,
            message: newMessage
        }, { status: 500 });
    } finally{
        await prisma.$disconnect();
    }
}