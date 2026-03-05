import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    return NextResponse.json({ message: "UBS cadastrada!", ubs: novaUbs });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar UBS" }, { status: 500 });
  }
}

// Aproveite para criar o GET para listar no select de médicos
export async function GET() {
  const ubs = await prisma.ubs.findMany({ orderBy: { nome: 'asc' } });
  return NextResponse.json(ubs);
}