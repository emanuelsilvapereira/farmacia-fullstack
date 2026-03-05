import React from 'react';
import prisma from '@/lib/prisma';
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle"; // 👈 Importamos o botão
import { Users, Shield, UserCog, User } from "lucide-react";

export default async function UsuariosPage() {
  const equipe = await (prisma as any).usuario.findMany({
    orderBy: { role: 'asc' }
  });

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
      case 'GERENTE':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      case 'OPERADOR':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="w-4 h-4" />;
      case 'GERENTE': return <UserCog className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Cabeçalho Atualizado com o Botão de Tema */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Controle de Acessos
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Gerencie a equipe e os níveis de permissão do sistema.
          </p>
        </div>

        {/* 👇 O botão de Dark Mode agora aparece aqui também! */}
      </header>

      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="py-4 px-6 font-medium text-sm text-slate-500 dark:text-slate-400">Nome do Usuário</th>
                <th className="py-4 px-6 font-medium text-sm text-slate-500 dark:text-slate-400">E-mail de Acesso</th>
                <th className="py-4 px-6 font-medium text-sm text-slate-500 dark:text-slate-400">Nível (Role)</th>
                <th className="py-4 px-6 font-medium text-sm text-right text-slate-500 dark:text-slate-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {equipe.map((membro: any) => (
                <tr key={membro.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-900 dark:text-white">{membro.nome}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{membro.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getRoleStyle(membro.role)}`}>
                      {getRoleIcon(membro.role)}
                      {membro.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}