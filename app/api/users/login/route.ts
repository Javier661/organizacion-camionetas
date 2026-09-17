import { NextResponse , NextRequest} from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const POST = async (request: NextRequest) => {
    try{
        const { email, password } = await request.json();
        if(!email || !password){
            return NextResponse.json({
                success: false,
                message: "Todos los campos son obligatorios."
            }, { status: 400 } );
        }

        const result = await prisma.usuarios.findUnique({
            where: {
                email: email,
            },
            select :{
                id: true,
                password: true,
                nombre: true,
                role: true
            }
        });
        
        if(!result){   
            return NextResponse.json({
                success: false,
                message: "Credenciales inválidas."
            }, { status: 404 } )
        }
        const contraseñaValida = await bcrypt.compare(password, result.password);
        if(!contraseñaValida){
            return NextResponse.json({
                success: false,
                message: "Usuario Y/O Contraseña incorrecta."
            }, { status: 401 } );
        }

        const token = jwt.sign(
            { id: result.id, nombre : result.nombre, email: email, role: result.role },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1h' }
        );

        return NextResponse.json({
            success: true,
            message: "Login exitoso.",
            redirect: `/dashboard/${result.id}`,
            token: token
        }, { status: 200 });

    }catch(error){
        const newError = error as Error;
        console.error("Error en login:", newError);
        return NextResponse.json({
            success: false,
            message: `Error en el servidor. ${newError.message}`
        }, { status: 500 });
    } finally{
        await prisma.$disconnect();
    }
}

export const GET = async (request: NextRequest) => {
    const authHeader = request.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return new Response("Unauthorized",{ status: 401 } );
    }
    try{
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {email: string , nombre: string, role: string };
        return NextResponse.json({
            success: true,
            message: "Token válido.",
            user: {
                email: decoded.email,
                nombre: decoded.nombre,
                role: decoded.role
            }
        }, { status: 200 });
    }catch(error){
        const newError = error as Error;
        console.error("Error al verificar el token:", newError);
        return NextResponse.json({
            success: false,
            message: `Token inválido. ${newError.message}`
        }, { status: 401 });
    }
}