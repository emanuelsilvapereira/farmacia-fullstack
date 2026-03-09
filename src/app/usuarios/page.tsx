import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Plus, ArrowLeft, Shield, UserCircle } from 'lucide-react';
import { BotaoDeletarUsuario } from "@/components/BotaoDeletarUsuario";

export const dynamic = 'force-dynamic'; 

export default async function UsuariosPage() {
  // 1. Verificação de Segurança (O Leão de Chácara da Rota)
  const session: any = await getServerSession(authOptions);
  const userRole = session?.user?.role || "FUNCIONARIO";

  if (userRole !== "ADMIN") {
    redirect("/"); // Apenas ADMIN passa da porta!
  }

  // 2. Busca todos os usuários cadastrados no banco
  const equipe = await prisma.usuario.findMany({
    orderBy: {
      nome: 'asc'
    }
  });

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Início
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Gerenciar Equipe
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Controle de acessos e permissões dos funcionários.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/usuarios/novo" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Novo Funcionário
          </Link>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700/50 text-sm text-slate-500 dark:text-slate-400">
                <th className="p-4 font-medium">Nome</th>
                <th className="p-4 font-medium">E-mail (Login)</th>
                <th className="p-4 font-medium">Cargo / Permissão</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {equipe.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                equipe.map((membro) => {
                  const isGerenteCard = membro.role === 'GERENTE' || membro.role === 'ADMIN';
                  
                  return (
                    <tr key={membro.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                      <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                        <UserCircle className="w-8 h-8 text-slate-400" />
                        {membro.nome || 'Sem nome'}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        {membro.email}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-semibold border ${
                          isGerenteCard 
                            ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' 
                            : membro.role === 'FARMACEUTICO'
                              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                              : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}>
                          {isGerenteCard && <Shield className="w-3.5 h-3.5" />}
                          {membro.role || 'FUNCIONARIO'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {/* Se o usuário for ele mesmo, não mostramos botão de excluir para evitar que o gerente se delete sem querer */}
                        {session?.user?.email !== membro.email && (
                          <BotaoDeletarUsuario id={membro.id} nome={membro.nome || 'Usuário'} />
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}