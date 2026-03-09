import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 👇 Avisamos o Next.js que params agora é uma Promise
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 👇 A MÁGICA NOVA: Esperamos os parâmetros carregarem antes de usar!
    const parametros = await params;
    
    // Agora sim extraímos o número em segurança
    const idNumerico = Number(parametros.id);

    await prisma.usuario.delete({
      where: { id: idNumerico },
    });

    return NextResponse.json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    console.error("Erro no servidor ao excluir:", error);
    return NextResponse.json({ error: "Erro ao excluir o usuário." }, { status: 500 });
  }
}