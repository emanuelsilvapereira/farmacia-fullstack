import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Função para SALVAR um novo médico
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novoMedico = await prisma.medico.create({
      data: {
        nome: body.nome,
        crm: body.crm,
        ubsId: Number(body.ubsId), // Importante converter para número!
      },
    });
    return NextResponse.json({ message: "Médico cadastrado!", medico: novoMedico });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar médico" }, { status: 500 });
  }
}

// 👇 NOVA FUNÇÃO: Busca os médicos para preencher o <select> 👇
export async function GET() {
  try {
    const medicos = await prisma.medico.findMany({
      orderBy: { nome: 'asc' } // Já traz organizado em ordem alfabética
    });
    return NextResponse.json(medicos);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar a lista de médicos" }, { status: 500 });
  }
}