import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const total = await prisma.usuario.count();
    
    if (total > 0) {
      return NextResponse.json({ aviso: 'Registro já existe.' });
    }

    const valorTratado = await bcrypt.hash('123456', 10);

    await (prisma.usuario as any).create({
      data: {
        nome: 'Usuario Teste',
        email: 'teste@sistema.com',
        senha: valorTratado, // 👈 Mudamos de 'chave' para 'senha' aqui!
        role: 'ADMIN'
      }
    });

    return NextResponse.json({ sucesso: true, email: 'teste@sistema.com' });

  } catch (error: any) {
    // 👇 Mudança aqui: Logando o erro no terminal e enviando para a tela
    console.error("ERRO COMPLETO:", error);
    return NextResponse.json(
      { 
        erro: 'Falha no processo.', 
        motivo: error.message || String(error) // Isso vai mostrar exatamente o que quebrou!
      }, 
      { status: 500 }
    );
  }
}