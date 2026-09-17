import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return new Response("Unauthorized",{ status: 401 } );
    }
  try{
      const result = await prisma.asignacion.findMany({
          select : {
              id : true,
              Usuarios : {
                  select : {
                      nombre : true,
                      role : true,
                      fotografia : true
                  }
              },
              Camionetas : {
                  select : {
                      marca : true,
                      modelo : true,
                      año : true,
                      placa : true,
                      color : true,
                      kilometraje : true,
                      estado : true,
                      asignado : true
                  }
              },
              fechaAsignacion : true
          },
      })

      if(!result || result.length === 0){
        return NextResponse.json({
            success : false,
            message : "No existen asignaciones registradas."
        }, { status: 404 });
      }

      return NextResponse.json({
          success : true,
          result
      }, { status: 200 });

  }catch(error){
      const newError = error as Error
      return NextResponse.json( {
          success: false,
          message : `Error al obtener los resultados: ${newError.message}`
      }, { status: 500 });
  }finally{
      await prisma.$disconnect();
  }
}

export const POST = async (req : NextRequest) => {
    const authHeader = req.headers.get("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return new Response("Unauthorized",{ status: 401 } );
    }
    try{
        const { idCamioneta, idUsuario } = await req.json();
        if(!idCamioneta || !idUsuario){
            return NextResponse.json({
                success : false,
                message : "Todos los datos son obligatorios"
            }, { status : 400 } );
        }
        const result = await prisma.asignacion.create({
            data : {
                camionetaId : idCamioneta,
                usuarioId : idUsuario
            }
        })
        if(result){
            const updateCamioneta = await prisma.camionetas.update({
                where : {
                    id : idCamioneta
                },
                data : {
                    asignado : true
                }
            })
            if(updateCamioneta){
                return NextResponse.json({
                    success : true,
                    message : "La camioneta a sido asignada exitosamente"
                }, { status : 200 });
            }
            return NextResponse.json({
                success : false,
                message : "Algun dato no corresponde para realizar la asignacion"
            }, { status : 400 });
        }
        return NextResponse.json({
            success : false,
            message : "No pude asignar la camioneta"
        }, { status : 400 });
    }catch(error){
        const newError = error as Error
        return NextResponse.json({
            success : false,
            message : `Error aqui : ${newError}`
        }, { status : 500 });
    }finally{
        await prisma.$disconnect();
    }
}
