import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// Usamos bcrypt para criptografar a senha antes de salvar no banco!
import bcrypt from "bcrypt"; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, senha, role } = body;

    if (!nome || !email || !senha || !role) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
    }

    // 1. Verifica se o e-mail já está em uso
    const emailJaExiste = await prisma.usuario.findUnique({
      where: { email },
    });

    if (emailJaExiste) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado no sistema." }, { status: 400 });
    }

    // 2. Criptografa a senha (ninguém no banco de dados vai saber a senha real)
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // 3. Salva o novo usuário
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        role,
      },
    });

    return NextResponse.json({ message: "Usuário cadastrado com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}