import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 👇 AGORA PEGAMOS O MÉDICO E A UBS AQUI 👇
    const { produtoId, quantidadeStr, medicoId, ubsId } = body; 
    
    const quantidadeDesejada = Number(quantidadeStr);
    const idDoProduto = Number(produtoId); 

    if (!idDoProduto || quantidadeDesejada <= 0) {
      return NextResponse.json({ error: 'Dados inválidos para a saída.' }, { status: 400 });
    }

    const produto = await prisma.produto.findUnique({
      where: { id: idDoProduto },
      include: {
        lotes: {
          where: { quantidade: { gt: 0 } },
          orderBy: { validade: 'asc' }
        }
      }
    });

    if (!produto) {
      return NextResponse.json({ error: 'Item não encontrado.' }, { status: 404 });
    }

    const estoqueTotal = produto.lotes.reduce((acc, lote) => acc + lote.quantidade, 0);
    
    if (quantidadeDesejada > estoqueTotal) {
      return NextResponse.json(
        { error: `Estoque insuficiente! Você tem apenas ${estoqueTotal} unidades disponíveis.` }, 
        { status: 400 }
      );
    }

    let quantidadeRestanteParaDescontar = quantidadeDesejada;
    const operacoesNoBanco = []; 

    for (const lote of produto.lotes) {
      if (quantidadeRestanteParaDescontar === 0) break;

      if (lote.quantidade >= quantidadeRestanteParaDescontar) {
        operacoesNoBanco.push(
          prisma.lote.update({
            where: { id: lote.id },
            data: { quantidade: lote.quantidade - quantidadeRestanteParaDescontar }
          })
        );
        quantidadeRestanteParaDescontar = 0; 
      } else {
        operacoesNoBanco.push(
          prisma.lote.update({
            where: { id: lote.id },
            data: { quantidade: 0 }
          })
        );
        quantidadeRestanteParaDescontar -= lote.quantidade; 
      }
    }

    // 👇 O HISTÓRICO AGORA SALVA TUDO! 👇
    operacoesNoBanco.push(
      prisma.movimentacao.create({
        data: {
          tipo: 'SAIDA',
          quantidade: quantidadeDesejada,
          produtoId: idDoProduto,
          // Converte para número e salva (se não tiver, salva como null)
          medicoId: medicoId ? Number(medicoId) : null,
          ubsId: ubsId ? Number(ubsId) : null
        }
      })
    );

    // Executa tudo de uma vez com segurança
    await prisma.$transaction(operacoesNoBanco);

    return NextResponse.json(
      { message: 'Saída registrada com sucesso!' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Erro na API de Movimentação:", error);
    return NextResponse.json(
      { error: 'Erro interno ao processar a baixa de estoque.' },
      { status: 500 }
    );
  }
}