import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novaUbs = await prisma.ubs.create({
      data: {
        nome: body.nome,
        bairro: body.bairro,
        cep: body.cep,
        rua: body.rua,
      },
    });
    return NextResponse.json({ message: "UBS cadastrada com sucesso!" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar UBS." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const ubs = await prisma.ubs.findMany({ orderBy: { nome: 'asc' } });
    return NextResponse.json(ubs);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar UBS" }, { status: 500 });
  }
}