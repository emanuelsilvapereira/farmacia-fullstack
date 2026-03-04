import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const valorTratado = await bcrypt.hash('123456', 10);

    // O createMany insere vários registros de uma vez e ignora se o e-mail já existir
    await (prisma as any).usuario.createMany({
      data: [
        {
          nome: 'Gerente Silva',
          email: 'gerente@sistema.com',
          senha: valorTratado,
          role: 'GERENTE'
        },
        {
          nome: 'Operador Santos',
          email: 'operador@sistema.com',
          senha: valorTratado,
          role: 'OPERADOR'
        }
      ],
      skipDuplicates: true
    });

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: 'Contas da equipe geradas com sucesso!' 
    });

  } catch (error: any) {
    console.error("ERRO COMPLETO:", error);
    return NextResponse.json({ erro: 'Falha no processo.', motivo: error.message }, { status: 500 });
  }
}