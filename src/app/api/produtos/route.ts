import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Nosso cabo de conexão com o banco

export async function POST(request: Request) {
  try {
    // 1. Recebemos os dados que vieram da tela (Frontend)
    const body = await request.json();
    const { nome, fabricante, medida, categoria, estoqueMinimo, lote } = body;

    // 2. BUSCA: O produto já existe no banco?
    // Usamos include para já trazer os lotes dele e poder comparar as validades
    let produto = await prisma.produto.findUnique({
      where: { nome: nome },
      include: { lotes: true }
    });

    // =========================================================
    // CENÁRIO A: PRODUTO NÃO EXISTE (Criar do zero)
    // =========================================================
    if (!produto) {
      produto = await prisma.produto.create({
        data: {
          nome,
          fabricante,
          medida,
          categoria,
          estoqueMinimo: Number(estoqueMinimo) || 10,
          // O Prisma é mágico: ele cria o Produto e o Lote de uma vez só!
          lotes: {
            create: {
              numeroLote: lote.numeroLote,
              validade: new Date(lote.validade),
              quantidade: Number(lote.quantidade)
            }
          }
        },
      include: {
          lotes: true 
        }
      });

      return NextResponse.json(
        { message: 'Produto e Lote criados com sucesso!', produto },
        { status: 201 }
      );
    }

    // =========================================================
    // CENÁRIO B: PRODUTO EXISTE (Vamos analisar os Lotes)
    // =========================================================
    
    // Normalizamos a data de validade que chegou (ex: '2025-10-15') para comparar
    const dataValidadeNova = new Date(lote.validade).toISOString().split('T')[0];

    // Procuramos se já existe um lote com EXATAMENTE a mesma data de validade
    const loteExistente = produto.lotes.find((l) => {
      const dataLoteBanco = new Date(l.validade).toISOString().split('T')[0];
      return dataLoteBanco === dataValidadeNova;
    });

    if (loteExistente) {
      // SITUAÇÃO B1: VALIDADE IGUAL -> Somar a quantidade
      const loteAtualizado = await prisma.lote.update({
        where: { id: loteExistente.id },
        data: {
          quantidade: loteExistente.quantidade + Number(lote.quantidade)
        }
      });

      return NextResponse.json(
        { message: 'Estoque atualizado! Quantidade somada ao lote existente.', lote: loteAtualizado },
        { status: 200 }
      );
    } else {
      // SITUAÇÃO B2: VALIDADE DIFERENTE -> Criar novo Lote para este Produto
      const novoLote = await prisma.lote.create({
        data: {
          numeroLote: lote.numeroLote,
          validade: new Date(lote.validade),
          quantidade: Number(lote.quantidade),
          produtoId: produto.id // Amarramos ao produto existente
        }
      });

      return NextResponse.json(
        { message: 'Novo lote adicionado a este produto!', lote: novoLote },
        { status: 201 }
      );
    }

  } catch (error: any) {
    console.error("Erro na API de Produtos:", error);
    return NextResponse.json(
      { error: 'Erro interno ao processar cadastro de medicamento.' },
      { status: 500 }
    );
  }
}