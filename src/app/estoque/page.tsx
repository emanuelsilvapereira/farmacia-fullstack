import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BotaoDeletar } from '@/components/BotaoDeletar';
import { 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  ArrowLeft, 
  ArrowRightLeft 
} from 'lucide-react';

export const dynamic = 'force-dynamic'; 

export default async function EstoquePage() {
  // 1. Verificação de Segurança e Sessão
  const session: any = await getServerSession(authOptions);
  const userRole = session?.user?.role || "FUNCIONARIO";
  const isGerente = userRole === "GERENTE" || userRole === "ADMIN";

  // 2. Busca de dados
  const produtos = await prisma.produto.findMany({
    include: {
      lotes: true,
    },
    orderBy: {
      nome: 'asc'
    }
  });

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Início
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Estoque Atual
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Visualize os itens disponíveis. {isGerente ? "(Acesso Total)" : "(Acesso Restrito)"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/estoque/saida" className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm">
            <ArrowRightLeft className="w-4 h-4" />
            Registrar Saída
          </Link>
          {/* Apenas quem pode dar entrada vê este botão */}
          {(userRole === "FARMACEUTICO" || isGerente) && (
            <Link href="/estoque/novo" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              Nova Entrada
            </Link>
          )}
        </div>
      </header>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700/50 text-sm text-slate-500 dark:text-slate-400">
                <th className="p-4 font-medium">Produto</th>
                <th className="p-4 font-medium">Medida/Dosagem</th>
                <th className="p-4 font-medium">Lotes</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                {isGerente && <th className="p-4 font-medium text-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {produtos.length === 0 ? (
                <tr>
                  <td colSpan={isGerente ? 6 : 5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    Nenhum produto no estoque.
                  </td>
                </tr>
              ) : (
                produtos.map((produto) => {
                  const estoqueTotal = produto.lotes.reduce((acc, lote) => acc + lote.quantidade, 0);
                  const estoqueMinimo = produto.estoqueMinimo || 0;
                  const alertaAbaixoMinimo = estoqueTotal <= estoqueMinimo;

                  return (
                    <tr key={produto.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{produto.nome}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{produto.medida || '-'}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{produto.lotes.length}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{estoqueTotal}</td>
                      <td className="p-4">
                        {alertaAbaixoMinimo ? (
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
                            <AlertCircle className="w-3.5 h-3.5" /> Baixo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> OK
                          </span>
                        )}
                      </td>
                      {isGerente && (
                        <td className="p-4 text-right">
                          <BotaoDeletar id={produto.id} nome={produto.nome} />
                        </td>
                      )}
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