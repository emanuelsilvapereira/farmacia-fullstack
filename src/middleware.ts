import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Regra 1: OPERADOR bloqueado de várias áreas
    if (token?.role === "OPERADOR") {
      const rotasProibidasParaOperador = [
        "/estoque/novo", 
        "/estoque/historico",
        "/usuarios" // Operador não entra na tela de usuários
      ];

      if (rotasProibidasParaOperador.includes(path)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Regra 2: GERENTE não pode acessar a tela de controle de usuários
    if (token?.role === "GERENTE") {
      if (path.startsWith("/usuarios")) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/estoque/:path*",
    "/usuarios/:path*", // Avisamos o middleware para vigiar essa rota também
  ],
};