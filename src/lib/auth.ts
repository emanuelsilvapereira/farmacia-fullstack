import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        chave: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.chave) {
          throw new Error("Dados incompletos");
        }

        const usuario = await (prisma as any).usuario.findUnique({
          where: { email: credentials.email }
        });

        if (!usuario) throw new Error("Conta não encontrada");

        const senhaCorreta = await bcrypt.compare(credentials.chave, (usuario as any).senha);

        if (!senhaCorreta) throw new Error("Senha incorreta");

        return {
          id: usuario.id.toString(),
          name: usuario.nome,
          email: usuario.email,
          role: (usuario as any).role, // Aqui pegamos do banco
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role; // Passamos pro token
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        (session.user as any).role = token.role; // Passamos pra sessão final
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};