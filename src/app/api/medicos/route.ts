import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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