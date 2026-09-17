import { NextResponse, NextRequest } from "next/server";
import ValidarToken from "@/acciones/validarToken";
import jwt from "jsonwebtoken";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPages = ["/"];
  const publicApiRoutes = [
    "/api/users/login"  // <-- AHORA sí funciona con ?id=
  ];

  if (publicPages.includes(pathname)) return NextResponse.next();

  if (publicApiRoutes.some((route) => pathname.startsWith(route))) return NextResponse.next();

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  // 4. Obtener token de cookie o header
  const cookieToken = await ValidarToken();
  const headerToken = request.headers.get("Authorization")?.replace("Bearer ", "");
  const token = cookieToken || headerToken;

  // 5. Si NO hay token → bloquear
  if (!token) {
    if (pathname.startsWith("/api")) return new Response("Unauthorized", { status: 401 });
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 6. Verificar token
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    return NextResponse.next();
  } catch (error) {
    if (pathname.startsWith("/api")) return new Response("Unauthorized", { status: 401 });
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next|favicon|assets).*)"],
};
