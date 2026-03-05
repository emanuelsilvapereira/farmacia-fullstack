import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const parametros = await params;
    const produtoId = Number(parametros.id); 

    // 1. Apaga o Histórico de Movimentações
    await prisma.movimentacao.deleteMany({
      where: { produtoId: produtoId },
    });

    // 2. Apaga os Lotes
    await prisma.lote.deleteMany({
      where: { produtoId: produtoId },
    });

    // 3. Agora o Produto está livre para ser deletado!
    await prisma.produto.delete({
      where: { id: produtoId },
    });

    return NextResponse.json({ message: "Produto e todo o seu histórico foram excluídos!" });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return NextResponse.json(
      { error: "Erro ao excluir: verifique se existem outras dependências." },
      { status: 500 }
    );
  }
}